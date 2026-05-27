import { getBootstrapCredentials } from "@/modules/bootstrap/application/ensure-bakery-bootstrap";

import { getAdminDashboard } from "@/modules/admin/application/get-admin-dashboard";
import { isAdminAuthenticated } from "@/modules/admin/infrastructure/admin-auth";
import { AdminDashboard } from "@/modules/admin/presentation/admin-dashboard";
import { AdminLoginForm } from "@/modules/admin/presentation/admin-login-form";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAuthenticated = await isAdminAuthenticated();
  const resolvedSearchParams = (await searchParams) ?? {};
  const feedback = typeof resolvedSearchParams.feedback === "string" ? resolvedSearchParams.feedback : undefined;
  const error = typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined;

  if (!isAuthenticated) {
    const bootstrapCredentials = getBootstrapCredentials();

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
        <AdminLoginForm bootstrapCredentials={bootstrapCredentials} />
      </main>
    );
  }

  const dashboard = await getAdminDashboard();

  return <AdminDashboard data={dashboard} feedback={feedback} error={error} />;
}
