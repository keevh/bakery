"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAdminAction } from "@/app/admin/actions";

import { adminInputClass, adminPrimaryButtonClass } from "./admin-ui";

const initialState = { error: "" };

export function AdminLoginForm({
  bootstrapCredentials,
}: {
  bootstrapCredentials: {
    email: string;
    password: string;
  };
}) {
  const [state, formAction, pending] = useActionState(loginAdminAction, initialState);

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <i className="ph ph-arrow-left" /> Volver a la tienda
      </Link>
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">Bakery CMS</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">Inicia sesión para administrar pedidos y catálogo.</p>

      <form action={formAction} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Correo</span>
          <input type="email" name="email" defaultValue={bootstrapCredentials.email} className={adminInputClass} required />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Contraseña</span>
          <input type="password" name="password" defaultValue={bootstrapCredentials.password} className={adminInputClass} required />
        </label>

        {state.error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
        ) : null}

        <button type="submit" disabled={pending} className={`${adminPrimaryButtonClass} w-full`}>
          {pending ? "Entrando..." : "Entrar al panel"}
        </button>
      </form>
    </div>
  );
}
