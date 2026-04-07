import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { DbAdminUserRepository } from "@/modules/admin/infrastructure/db-admin-user-repository";

export const ADMIN_SESSION_COOKIE = "rollin-admin-session";

const adminUserRepository = new DbAdminUserRepository();

type AdminSessionPayload = {
  userId: string;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET environment variable.");
  }

  return secret;
}

function encodePayload(payload: AdminSessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function parseSessionValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionPayload;

    if (payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = parseSessionValue(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return null;
  }

  const adminUser = await adminUserRepository.findById(session.userId);

  if (!adminUser) {
    return null;
  }

  return {
    id: adminUser.id,
    email: adminUser.email,
  };
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export async function createAdminSession(userId: string) {
  const cookieStore = await cookies();
  const payload = encodePayload({
    userId,
    exp: Date.now() + 60 * 60 * 8 * 1000,
  });
  const signature = signPayload(payload);

  cookieStore.set(ADMIN_SESSION_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
