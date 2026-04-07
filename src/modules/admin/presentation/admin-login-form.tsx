"use client";

import { useActionState } from "react";

import { loginAdminAction } from "@/app/admin/actions";

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
    <div className="mx-auto max-w-md rounded-[2rem] border-2 border-[#3C2317]/10 bg-white p-8 shadow-[6px_6px_0px_0px_#FFDC39]">
      <p className="mb-3 inline-block rounded-full bg-[#9BE1E8] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">
        Admin Login
      </p>
      <h1 className="mb-3 text-4xl font-black uppercase leading-none tracking-tighter text-[#3C2317]">
        Rollin. CMS
      </h1>
      <p className="mb-6 text-sm font-medium text-[#3C2317]/70">
        Inicia sesion para ver pedidos actuales, historial y el resumen operativo del catalogo.
      </p>

      <form action={formAction} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-[#3C2317]/60">
            Correo
          </span>
          <input
            type="email"
            name="email"
            defaultValue={bootstrapCredentials.email}
            className="w-full rounded-2xl border-2 border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-bold text-[#3C2317] outline-none transition-colors focus:border-[#8B5CF6]"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-[#3C2317]/60">
            Contrasena
          </span>
          <input
            type="password"
            name="password"
            defaultValue={bootstrapCredentials.password}
            className="w-full rounded-2xl border-2 border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-bold text-[#3C2317] outline-none transition-colors focus:border-[#8B5CF6]"
            required
          />
        </label>

        {state.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {state.error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full border-2 border-[#3C2317] bg-[#3C2317] px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_#FFDC39] transition-colors hover:bg-[#8B5CF6] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Entrando..." : "Entrar al panel"}
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#3C2317]/45">
          Bootstrap default: {bootstrapCredentials.email} / {bootstrapCredentials.password}
        </p>
      </form>
    </div>
  );
}
