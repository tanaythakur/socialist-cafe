export type AdminRole = "super_admin" | "admin";

export type AdminProfile = {
  id: string;
  email: string;
  role: AdminRole;
  is_paused: boolean;
  created_at: string;
};

export type AdminProfileRow = {
  id: string;
  role: AdminRole;
  is_paused: boolean;
  created_at: string;
};
