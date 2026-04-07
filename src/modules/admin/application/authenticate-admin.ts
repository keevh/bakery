import { DbAdminUserRepository } from "@/modules/admin/infrastructure/db-admin-user-repository";
import { verifyPassword } from "@/modules/admin/infrastructure/password-hasher";
import { ensureBakeryBootstrap } from "@/modules/bootstrap/application/ensure-bakery-bootstrap";

const adminUserRepository = new DbAdminUserRepository();

export async function authenticateAdmin(input: { email: string; password: string }) {
  await ensureBakeryBootstrap();

  const adminUser = await adminUserRepository.findByEmail(input.email);

  if (!adminUser) {
    return null;
  }

  const isValidPassword = await verifyPassword(input.password, adminUser.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: adminUser.id,
    email: adminUser.email,
  };
}
