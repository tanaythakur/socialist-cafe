"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminProfile, AdminRole } from "@/lib/supabase/admin-types";

export type GetAdminProfileResult = {
  profile: AdminProfile | null;
  paused: boolean;
};

/** Get current admin profile from session. Returns profile or null; paused=true when user exists but is paused. */
export async function getAdminProfile(): Promise<GetAdminProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return { profile: null, paused: false };

  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("profiles")
    .select("id, role, is_paused, created_at")
    .eq("id", user.id)
    .in("role", ["admin", "super_admin"])
    .single();

  if (error || !row) return { profile: null, paused: false };
  if (row.is_paused) return { profile: null, paused: true };
  return {
    profile: {
      id: row.id,
      email: user.email ?? "",
      role: row.role as AdminRole,
      is_paused: row.is_paused,
      created_at: row.created_at,
    },
    paused: false,
  };
}

/** List all admins (super_admin only). */
export async function listAdmins(): Promise<
  { id: string; email: string; role: AdminRole; is_paused: boolean; created_at: string }[]
> {
  const { profile } = await getAdminProfile();
  if (!profile || profile.role !== "super_admin") {
    throw new Error("Forbidden");
  }

  const admin = createAdminClient();
  const { data: listData } = await admin.auth.admin.listUsers();
  const { data: rows } = await admin.from("profiles").select("id, role, is_paused, created_at").in("role", ["admin", "super_admin"]);

  const byId = new Map(rows?.map((r) => [r.id, r]) ?? []);
  const authUsers = listData?.users ?? [];
  return authUsers
    .filter((u: { id: string }) => byId.has(u.id))
    .map((u: { id: string; email?: string }) => {
      const r = byId.get(u.id)!;
      return {
        id: u.id,
        email: u.email ?? "",
        role: r.role as AdminRole,
        is_paused: r.is_paused,
        created_at: r.created_at,
      };
    });
}

/** Create a new admin (super_admin only). */
export async function createAdmin(
  email: string,
  password: string,
  name?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { profile } = await getAdminProfile();
  if (!profile || profile.role !== "super_admin") {
    return { ok: false, error: "Forbidden" };
  }

  const admin = createAdminClient();
  const { data: user, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: name ? { full_name: name } : undefined,
  });

  if (createError) {
    return { ok: false, error: createError.message };
  }
  if (!user.user?.id) {
    return { ok: false, error: "Failed to create user" };
  }

  const { error: insertError } = await admin.from("profiles").insert({
    id: user.user.id,
    role: "admin",
    is_paused: false,
  });

  if (insertError) {
    await admin.auth.admin.deleteUser(user.user.id);
    return { ok: false, error: insertError.message };
  }
  return { ok: true };
}

/** Delete an admin (super_admin only). Cannot delete self. */
export async function deleteAdmin(adminId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { profile } = await getAdminProfile();
  if (!profile || profile.role !== "super_admin") {
    return { ok: false, error: "Forbidden" };
  }
  if (profile.id === adminId) {
    return { ok: false, error: "Cannot delete your own account" };
  }

  const admin = createAdminClient();
  const { error: delProfile } = await admin.from("profiles").delete().eq("id", adminId);
  if (delProfile) return { ok: false, error: delProfile.message };
  await admin.auth.admin.deleteUser(adminId);
  return { ok: true };
}

/** Toggle pause for an admin (super_admin only). Cannot pause self. */
export async function togglePauseAdmin(adminId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { profile } = await getAdminProfile();
  if (!profile || profile.role !== "super_admin") {
    return { ok: false, error: "Forbidden" };
  }
  if (profile.id === adminId) {
    return { ok: false, error: "Cannot pause your own account" };
  }

  const admin = createAdminClient();
  const { data: row } = await admin.from("profiles").select("is_paused").eq("id", adminId).single();
  if (!row) return { ok: false, error: "Admin not found" };

  const { error } = await admin
    .from("profiles")
    .update({ is_paused: !row.is_paused })
    .eq("id", adminId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** One-time seed: create super admin user and profile. Safe to call multiple times (skips if exists). Uses SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD from env. */
export async function seedSuperAdmin(): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (!email || !password) {
    return {
      ok: false,
      error: "Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env (never commit real values).",
    };
  }

  const admin = createAdminClient();
  const { data: existing } = await admin.auth.admin.listUsers();
  const superUser = existing?.users?.find((u) => u.email === email);

  if (superUser) {
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("id", superUser.id)
      .single();
    if (profile) {
      return { ok: true, message: "Super admin already exists." };
    }
    await admin.from("profiles").insert({
      id: superUser.id,
      role: "super_admin",
      is_paused: false,
    });
    return { ok: true, message: "Super admin profile added to existing user." };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) return { ok: false, error: createError.message };
  if (!created.user?.id) return { ok: false, error: "Failed to create user" };

  const { error: insertError } = await admin.from("profiles").insert({
    id: created.user.id,
    role: "super_admin",
    is_paused: false,
  });

  if (insertError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, error: insertError.message };
  }
  return { ok: true, message: "Super admin created. You can sign in with the configured email and password." };
}
