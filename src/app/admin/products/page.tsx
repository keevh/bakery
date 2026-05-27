import { redirect } from "next/navigation";

import { getAdminDashboard } from "@/modules/admin/application/get-admin-dashboard";
import { isAdminAuthenticated } from "@/modules/admin/infrastructure/admin-auth";
import { AdminProducts } from "@/modules/admin/presentation/admin-products";

type AdminProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const feedback = typeof resolvedSearchParams.feedback === "string" ? resolvedSearchParams.feedback : undefined;
  const error = typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined;

  const dashboard = await getAdminDashboard();

  return <AdminProducts data={dashboard} feedback={feedback} error={error} />;
}
