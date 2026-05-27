"use client";

import { useState } from "react";

import type { getAdminDashboard } from "@/modules/admin/application/get-admin-dashboard";

import { AdminCard, AdminPageHeader, FeedbackBanner, StatusBadge, formatCurrency } from "./admin-ui";
import { AdminModal } from "./admin-modal";
import { OrderStatusSelect } from "./order-status-select";

type DashboardData = Awaited<ReturnType<typeof getAdminDashboard>>;
type Order = DashboardData["currentOrders"][number];

const channelLabels: Record<string, string> = {
  email: "Correo",
  cell: "Celular",
};

function orderUnits(order: Order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function OrderRow({ order, onSelect }: { order: Order; onSelect: (order: Order) => void }) {
  return (
    <tr
      onClick={() => onSelect(order)}
      className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50"
    >
      <td className="py-3 font-medium text-slate-900">{order.id}</td>
      <td className="py-3 text-slate-700">{order.client}</td>
      <td className="py-3 text-slate-600">{order.date}</td>
      <td className="py-3 text-slate-600">{orderUnits(order)}</td>
      <td className="py-3 font-medium text-slate-900">{formatCurrency(order.amount)}</td>
      <td className="py-3">
        <StatusBadge status={order.status} />
      </td>
    </tr>
  );
}

function OrderDetailModal({ order, editableStatus, onClose }: { order: Order; editableStatus: boolean; onClose: () => void }) {
  return (
    <AdminModal title={`Pedido ${order.id}`} onClose={onClose}>
      <div className="space-y-5 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Detail label="Cliente" value={order.client} />
          <Detail label="Entrega" value={order.date} />
          <Detail label="Contacto" value={`${channelLabels[order.contactChannel] ?? order.contactChannel}: ${order.contactValue}`} />
          <Detail label="Total" value={formatCurrency(order.amount)} />
          <div className="sm:col-span-2">
            <Detail label="Dirección" value={order.address} />
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Productos</p>
          <ul className="space-y-1.5">
            {order.items.map((item) => (
              <li
                key={`${order.id}-${item.productName}`}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-700"
              >
                <span>{item.productName}</span>
                <span className="font-medium text-slate-900">× {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        {order.notes ? (
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">Notas</p>
            <p className="text-slate-600">{order.notes}</p>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <span className="text-xs uppercase tracking-wide text-slate-400">Estado</span>
          {editableStatus ? <OrderStatusSelect orderNumber={order.id} status={order.status} /> : <StatusBadge status={order.status} />}
        </div>
      </div>
    </AdminModal>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 font-medium text-slate-900">{value}</p>
    </div>
  );
}

export function AdminOrders({ data, feedback, error }: { data: DashboardData; feedback?: string; error?: string }) {
  const [selected, setSelected] = useState<{ order: Order; editableStatus: boolean } | null>(null);

  return (
    <>
      <AdminPageHeader title="Pedidos" description="Cola de pedidos activos e historial de entregas." />
      <FeedbackBanner feedback={feedback} error={error} />

      <AdminCard className="mb-6 overflow-x-auto">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Pedidos activos</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{data.currentOrders.length} pedidos</span>
        </div>
        {data.currentOrders.length ? (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 font-medium">Pedido</th>
                <th className="font-medium">Cliente</th>
                <th className="font-medium">Entrega</th>
                <th className="font-medium">Unidades</th>
                <th className="font-medium">Total</th>
                <th className="font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.currentOrders.map((order) => (
                <OrderRow key={order.id} order={order} onSelect={(value) => setSelected({ order: value, editableStatus: true })} />
              ))}
            </tbody>
          </table>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">No hay pedidos activos.</p>
        )}
      </AdminCard>

      <details className="rounded-xl border border-slate-200 bg-white p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <span className="text-lg font-semibold text-slate-900">Historial</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{data.orderHistory.length} pedidos</span>
        </summary>
        <div className="mt-5 overflow-x-auto">
          {data.orderHistory.length ? (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 font-medium">Pedido</th>
                  <th className="font-medium">Cliente</th>
                  <th className="font-medium">Entrega</th>
                  <th className="font-medium">Unidades</th>
                  <th className="font-medium">Total</th>
                  <th className="font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.orderHistory.map((order) => (
                  <OrderRow key={order.id} order={order} onSelect={(value) => setSelected({ order: value, editableStatus: false })} />
                ))}
              </tbody>
            </table>
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">Todavía no hay historial.</p>
          )}
        </div>
      </details>

      {selected ? (
        <OrderDetailModal order={selected.order} editableStatus={selected.editableStatus} onClose={() => setSelected(null)} />
      ) : null}
    </>
  );
}
