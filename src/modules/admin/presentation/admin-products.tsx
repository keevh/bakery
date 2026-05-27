/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import {
  createAdminProductAction,
  toggleAdminProductAvailabilityAction,
  updateAdminProductAction,
} from "@/app/admin/actions";
import type { getAdminDashboard } from "@/modules/admin/application/get-admin-dashboard";

import { AdminModal } from "./admin-modal";
import {
  AdminCard,
  AdminField,
  AdminPageHeader,
  FeedbackBanner,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
  formatCurrency,
} from "./admin-ui";

type DashboardData = Awaited<ReturnType<typeof getAdminDashboard>>;
type Product = DashboardData["products"][number];

const categoryLabels: Record<string, string> = {
  amasijo: "Amasijo",
  hojaldre: "Hojaldre",
  dulce: "Dulce",
  galleteria: "Galletería",
};

function ProductFormFields({ product }: { product?: Product }) {
  return (
    <>
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Slug">
          <input type="text" name="slug" defaultValue={product?.slug ?? ""} className={adminInputClass} required />
        </AdminField>
        <AdminField label="Categoría">
          <select name="category" defaultValue={product?.category ?? "amasijo"} className={adminInputClass}>
            <option value="amasijo">Amasijo</option>
            <option value="hojaldre">Hojaldre</option>
            <option value="dulce">Dulce</option>
            <option value="galleteria">Galletería</option>
          </select>
        </AdminField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Nombre ES">
          <input type="text" name="nameEs" defaultValue={product?.name.es ?? ""} className={adminInputClass} required />
        </AdminField>
        <AdminField label="Nombre EN">
          <input type="text" name="nameEn" defaultValue={product?.name.en ?? ""} className={adminInputClass} required />
        </AdminField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Descripción ES">
          <textarea name="descriptionEs" defaultValue={product?.description.es ?? ""} className={`${adminInputClass} min-h-24`} required />
        </AdminField>
        <AdminField label="Descripción EN">
          <textarea name="descriptionEn" defaultValue={product?.description.en ?? ""} className={`${adminInputClass} min-h-24`} required />
        </AdminField>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <AdminField label="Precio">
          <input type="number" step="0.01" min="0.01" name="price" defaultValue={product?.price ?? ""} className={adminInputClass} required />
        </AdminField>
        <AdminField label="Mín. pedido">
          <input type="number" min="1" name="minOrder" defaultValue={product?.minOrder ?? ""} className={adminInputClass} required />
        </AdminField>
        <label className="flex items-center gap-2 self-end rounded-lg border border-slate-300 bg-white px-3 py-2">
          <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="h-4 w-4" />
          <span className="text-sm font-medium text-slate-700">Activo</span>
        </label>
      </div>
      <AdminField label="Imagen URL">
        <input type="url" name="image" defaultValue={product?.image ?? ""} className={adminInputClass} required />
      </AdminField>
    </>
  );
}

export function AdminProducts({ data, feedback, error }: { data: DashboardData; feedback?: string; error?: string }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  return (
    <>
      <AdminPageHeader title="Productos" description="Gestiona el catálogo de la panadería." />
      <FeedbackBanner feedback={feedback} error={error} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{data.productSummary.total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Activos</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">{data.productSummary.active}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Inactivos</p>
          <p className="mt-1 text-2xl font-semibold text-slate-400">{data.productSummary.inactive}</p>
        </div>
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Listado</h2>
          <button type="button" className={adminPrimaryButtonClass} onClick={() => setCreating(true)}>
            Crear producto
          </button>
        </div>

        {/* Mobile cards */}
        <div className="grid gap-3 lg:hidden">
          {data.products.map((product) => (
            <div key={product.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-start gap-3">
                <img src={product.image} alt={product.name.es} className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{product.name.es}</p>
                  <p className="truncate text-sm text-slate-500">/{product.slug}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatCurrency(product.price)} · mín. {product.minOrder} · {product.isActive ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-3">
                <button type="button" className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900" onClick={() => setEditing(product)}>
                  Editar
                </button>
                <ToggleButton product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 font-medium">Producto</th>
                <th className="font-medium">Categoría</th>
                <th className="font-medium">Precio</th>
                <th className="font-medium">Mín.</th>
                <th className="font-medium">Estado</th>
                <th className="font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name.es} className="h-11 w-11 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-slate-900">{product.name.es}</p>
                        <p className="text-xs text-slate-500">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600">{categoryLabels[product.category] ?? product.category}</td>
                  <td className="py-3 text-slate-900">{formatCurrency(product.price)}</td>
                  <td className="py-3 text-slate-600">{product.minOrder}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        product.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-4">
                      <button type="button" className="cursor-pointer font-medium text-slate-700 hover:text-slate-900" onClick={() => setEditing(product)}>
                        Editar
                      </button>
                      <ToggleButton product={product} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {creating ? (
        <AdminModal title="Crear producto" onClose={() => setCreating(false)}>
          <form action={createAdminProductAction} className="space-y-4">
            <ProductFormFields />
            <button type="submit" className={`${adminPrimaryButtonClass} w-full`}>
              Crear producto
            </button>
          </form>
        </AdminModal>
      ) : null}

      {editing ? (
        <AdminModal title={`Editar: ${editing.name.es}`} onClose={() => setEditing(null)}>
          <form action={updateAdminProductAction} className="space-y-4">
            <ProductFormFields product={editing} />
            <div className="flex gap-3">
              <button type="submit" className={`${adminPrimaryButtonClass} flex-1`}>
                Guardar cambios
              </button>
              <button type="button" className={adminSecondaryButtonClass} onClick={() => setEditing(null)}>
                Cancelar
              </button>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </>
  );
}

function ToggleButton({ product }: { product: Product }) {
  return (
    <form action={toggleAdminProductAvailabilityAction}>
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="nextIsActive" value={String(!product.isActive)} />
      <button type="submit" className="cursor-pointer font-medium text-slate-500 hover:text-slate-900">
        {product.isActive ? "Desactivar" : "Activar"}
      </button>
    </form>
  );
}
