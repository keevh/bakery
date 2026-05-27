"use client";

import type { MouseEvent, ReactNode } from "react";

export function AdminModal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={handleBackdropClick}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="admin-modal-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <i className="ph ph-x text-xl" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
