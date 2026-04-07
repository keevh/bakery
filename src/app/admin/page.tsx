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
      <main className="min-h-screen bg-[#FDFBF7] px-4 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <section className="rounded-[3rem] border-2 border-[#3C2317]/10 bg-white p-8 shadow-sm md:p-12">
            <p className="mb-4 inline-block rounded-full bg-[#FFDC39] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#3C2317]">
              Rollin. Backoffice
            </p>
            <h1 className="mb-6 text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[#3C2317] md:text-7xl">
              Admin con
              <br />
              mirada CMS
            </h1>
            <p className="max-w-xl text-sm font-medium text-[#3C2317]/70 md:text-base">
              Reformulamos el panel para que sirva como centro operativo: pedidos vigentes, historial y contexto del catalogo, todo sin perder la estetica visual original de la marca.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#9BE1E8] px-4 py-2 text-xs font-black uppercase text-white">Pedidos actuales</span>
              <span className="rounded-full bg-[#FF9B71] px-4 py-2 text-xs font-black uppercase text-white">Historial</span>
              <span className="rounded-full bg-[#8B5CF6] px-4 py-2 text-xs font-black uppercase text-white">Sesion segura</span>
            </div>
          </section>

          <AdminLoginForm bootstrapCredentials={bootstrapCredentials} />
        </div>
      </main>
    );
  }

  const dashboard = await getAdminDashboard();

  return <AdminDashboard data={dashboard} feedback={feedback} error={error} />;
}
