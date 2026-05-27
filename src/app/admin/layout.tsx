import { isAdminAuthenticated } from "@/modules/admin/infrastructure/admin-auth";
import { AdminShell } from "@/modules/admin/presentation/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
