import AdminPage from "@/pages/Admin";
import { getAdminProfile, listAdmins, createAdmin, deleteAdmin, togglePauseAdmin } from "./actions";

export default async function AdminRoute() {
  const { profile, paused } = await getAdminProfile();
  return (
    <AdminPage
      initialProfile={profile}
      initialPaused={paused}
      adminActions={{ listAdmins, createAdmin, deleteAdmin, togglePauseAdmin }}
    />
  );
}
