import "server-only";

import { eq } from "drizzle-orm";

import type { AdminUser, AdminUserRepository } from "@/modules/admin/domain/admin-user";
import { db } from "@/modules/shared/infrastructure/db/client";
import { adminUsersTable } from "@/modules/shared/infrastructure/db/schema";

function mapAdminUser(record: typeof adminUsersTable.$inferSelect): AdminUser {
  return {
    id: record.id,
    email: record.email,
    passwordHash: record.passwordHash,
  };
}

export class DbAdminUserRepository implements AdminUserRepository {
  async findByEmail(email: string) {
    const [record] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email)).limit(1);
    return record ? mapAdminUser(record) : null;
  }

  async findById(id: string) {
    const [record] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, id)).limit(1);
    return record ? mapAdminUser(record) : null;
  }

  async create(input: { email: string; passwordHash: string }) {
    const [record] = await db
      .insert(adminUsersTable)
      .values({
        email: input.email,
        passwordHash: input.passwordHash,
      })
      .returning();

    return mapAdminUser(record);
  }
}
