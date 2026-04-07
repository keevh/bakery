import { revalidatePath } from "next/cache";

export function revalidateBakeryPaths() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}
