export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
};

export interface AdminUserRepository {
  findByEmail(email: string): Promise<AdminUser | null>;
  findById(id: string): Promise<AdminUser | null>;
  create(input: { email: string; passwordHash: string }): Promise<AdminUser>;
}
