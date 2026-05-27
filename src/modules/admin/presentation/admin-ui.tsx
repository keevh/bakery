import type { ReactNode } from "react";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const adminInputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900";

export const adminPrimaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60";

export const adminSecondaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100";

export function AdminPageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </header>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`.trim()}>{children}</section>;
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <AdminCard>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </AdminCard>
  );
}

export function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const statusStyles: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  baking: "border-orange-200 bg-orange-50 text-orange-700",
  ready: "border-sky-200 bg-sky-50 text-sky-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-slate-200 bg-slate-100 text-slate-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  baking: "Horneando",
  ready: "Listo",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export function statusLabel(status: string) {
  return statusLabels[status] ?? status;
}

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-500";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {statusLabel(status)}
    </span>
  );
}

export function FeedbackBanner({ feedback, error }: { feedback?: string; error?: string }) {
  if (!feedback && !error) {
    return null;
  }

  const message =
    error ??
    (feedback === "product-created"
      ? "Producto creado."
      : feedback === "product-updated"
        ? "Producto actualizado."
        : feedback === "product-toggled"
          ? "Disponibilidad actualizada."
          : feedback === "order-updated"
            ? "Estado del pedido actualizado."
            : "Cambios guardados.");

  return (
    <div
      className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
        error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {message}
    </div>
  );
}
