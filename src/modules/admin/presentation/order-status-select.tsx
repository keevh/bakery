"use client";

import { updateOrderStatusAction } from "@/app/admin/actions";

const statuses = [
  { value: "pending", label: "Pendiente" },
  { value: "baking", label: "Horneando" },
  { value: "ready", label: "Listo" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

export function OrderStatusSelect({ orderNumber, status }: { orderNumber: string; status: string }) {
  return (
    <form action={updateOrderStatusAction}>
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <select
        name="status"
        defaultValue={status}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-slate-900"
      >
        {statuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </form>
  );
}
