"use server";

import { redirect } from "next/navigation";

import { authenticateAdmin } from "@/modules/admin/application/authenticate-admin";
import { updateOrderStatus } from "@/modules/admin/application/update-order-status";
import {
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
} from "@/modules/admin/infrastructure/admin-auth";
import {
  createAdminProduct,
  toggleAdminProductAvailability,
  updateAdminProduct,
} from "@/modules/catalog/application/save-admin-product";
import { revalidateBakeryPaths } from "@/modules/shared/application/revalidate-bakery-paths";

function buildAdminUrl(path: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return `${path}?${searchParams.toString()}`;
}

async function requireAdminAccess() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin");
  }
}

/**
 * Runs the action work and resolves the URL to redirect to. `redirect()` must run OUTSIDE the
 * try/catch (it signals via a thrown control-flow error that must not be swallowed), so this helper
 * only returns the target URL and the caller redirects afterwards.
 */
async function runAdminMutation(
  path: string,
  successFeedback: string,
  fallbackMessage: string,
  work: () => Promise<void>,
): Promise<string> {
  try {
    await work();
    revalidateBakeryPaths();
    return buildAdminUrl(path, { feedback: successFeedback });
  } catch (error) {
    const message = error instanceof Error ? error.message : fallbackMessage;
    return buildAdminUrl(path, { error: message });
  }
}

export async function loginAdminAction(_: { error?: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  const adminUser = await authenticateAdmin({ email, password });

  if (!adminUser) {
    return { error: "Credenciales invalidas. Usa el acceso configurado para admin." };
  }

  await createAdminSession(adminUser.id);
  redirect("/admin");
}

export async function logoutAdminAction() {
  await destroyAdminSession();
  redirect("/admin");
}

export async function createAdminProductAction(formData: FormData) {
  await requireAdminAccess();
  const target = await runAdminMutation("/admin/products", "product-created", "Unable to create product.", () =>
    createAdminProduct(formData).then(() => undefined),
  );
  redirect(target);
}

export async function updateAdminProductAction(formData: FormData) {
  await requireAdminAccess();
  const target = await runAdminMutation("/admin/products", "product-updated", "Unable to update product.", () =>
    updateAdminProduct(formData).then(() => undefined),
  );
  redirect(target);
}

export async function toggleAdminProductAvailabilityAction(formData: FormData) {
  await requireAdminAccess();
  const target = await runAdminMutation("/admin/products", "product-toggled", "Unable to toggle product.", () =>
    toggleAdminProductAvailability(formData).then(() => undefined),
  );
  redirect(target);
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdminAccess();
  const target = await runAdminMutation("/admin/orders", "order-updated", "Unable to update order.", () =>
    updateOrderStatus(formData).then(() => undefined),
  );
  redirect(target);
}
