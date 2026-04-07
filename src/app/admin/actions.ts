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

function createAdminRedirect(path: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  redirect(`${path}?${searchParams.toString()}`);
}

async function requireAdminAccess() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin");
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

  try {
    await createAdminProduct(formData);
    revalidateBakeryPaths();
    createAdminRedirect("/admin", { feedback: "product-created" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create product.";
    createAdminRedirect("/admin", { error: message });
  }
}

export async function updateAdminProductAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await updateAdminProduct(formData);
    revalidateBakeryPaths();
    createAdminRedirect("/admin", { feedback: "product-updated" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update product.";
    createAdminRedirect("/admin", { error: message });
  }
}

export async function toggleAdminProductAvailabilityAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await toggleAdminProductAvailability(formData);
    revalidateBakeryPaths();
    createAdminRedirect("/admin", { feedback: "product-toggled" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to toggle product.";
    createAdminRedirect("/admin", { error: message });
  }
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await updateOrderStatus(formData);
    revalidateBakeryPaths();
    createAdminRedirect("/admin", { feedback: "order-updated" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update order.";
    createAdminRedirect("/admin", { error: message });
  }
}
