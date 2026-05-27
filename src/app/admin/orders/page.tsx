import { redirect } from "next/navigation";

import { getAdminDashboard } from "@/modules/admin/application/get-admin-dashboard";
import { isAdminAuthenticated } from "@/modules/admin/infrastructure/admin-auth";
import { AdminOrders } from "@/modules/admin/presentation/admin-orders";

type AdminOrdersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const feedback = typeof resolvedSearchParams.feedback === "string" ? resolvedSearchParams.feedback : undefined;
  const error = typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined;

  const dashboard = await getAdminDashboard();

  return <AdminOrders data={dashboard} feedback={feedback} error={error} />;
}
