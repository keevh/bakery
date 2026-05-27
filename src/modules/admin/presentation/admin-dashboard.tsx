import Link from "next/link";

import type { getAdminDashboard } from "@/modules/admin/application/get-admin-dashboard";

import { AdminCard, AdminPageHeader, FeedbackBanner, StatCard, StatusBadge, formatCurrency } from "./admin-ui";

type DashboardData = Awaited<ReturnType<typeof getAdminDashboard>>;

export function AdminDashboard({ data, feedback, error }: { data: DashboardData; feedback?: string; error?: string }) {
  return (
    <>
      <AdminPageHeader title="Panel" description="Resumen operativo de pedidos, catálogo e ingresos." />
      <FeedbackBanner feedback={feedback} error={error} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pedidos activos" value={String(data.stats.activeOrders)} />
        <StatCard label="Entregados" value={String(data.stats.completedOrders)} />
        <StatCard label="Cancelados" value={String(data.stats.cancelledOrders)} />
        <StatCard label="Ingresos" value={formatCurrency(data.stats.totalRevenue)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Pedidos activos</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-slate-500 hover:text-slate-900">
              Ver todos
            </Link>
          </div>
          {data.currentOrders.length ? (
            <div className="space-y-3">
              {data.currentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{order.client}</p>
                    <p className="text-sm text-slate-500">Entrega {order.date}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(order.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No hay pedidos activos.</p>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Catálogo</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-sm text-slate-600">Total</span>
              <span className="text-base font-semibold text-slate-900">{data.productSummary.total}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-sm text-slate-600">Activos</span>
              <span className="text-base font-semibold text-emerald-600">{data.productSummary.active}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-sm text-slate-600">Inactivos</span>
              <span className="text-base font-semibold text-slate-400">{data.productSummary.inactive}</span>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            Gestionar productos <i className="ph ph-arrow-right" />
          </Link>
        </AdminCard>
      </div>
    </>
  );
}
