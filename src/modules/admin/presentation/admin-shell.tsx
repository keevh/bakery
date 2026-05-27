"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { logoutAdminAction } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Panel", icon: "ph-squares-four" },
  { href: "/admin/products", label: "Productos", icon: "ph-bread" },
  { href: "/admin/orders", label: "Pedidos", icon: "ph-receipt" },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <i className={`ph ${link.icon} text-lg`} />
            <span className="font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function ViewStoreLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <i className="ph ph-storefront text-lg" />
      <span className="font-medium">Ver tienda</span>
    </Link>
  );
}

function LogoutButton({ className }: { className: string }) {
  return (
    <form action={logoutAdminAction}>
      <button type="submit" className={className}>
        <i className="ph ph-sign-out text-lg" />
        <span className="font-medium">Cerrar sesión</span>
      </button>
    </form>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-5 lg:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
            Bakery
          </Link>
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Cerrar navegación" : "Abrir navegación"}
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <i className={`ph ${mobileMenuOpen ? "ph-x" : "ph-list"} text-xl`} />
          </button>
        </div>

        <div className="hidden flex-col justify-between px-3 pb-6 lg:flex lg:h-[calc(100vh-5rem)]">
          <NavLinks pathname={pathname} />
          <div className="flex flex-col gap-1">
            <ViewStoreLink />
            <LogoutButton className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900" />
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="space-y-3 px-3 pb-4 lg:hidden">
            <NavLinks pathname={pathname} onNavigate={() => setMobileMenuOpen(false)} />
            <ViewStoreLink onNavigate={() => setMobileMenuOpen(false)} />
            <LogoutButton className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900" />
          </div>
        ) : null}
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:px-10">{children}</main>
    </div>
  );
}
