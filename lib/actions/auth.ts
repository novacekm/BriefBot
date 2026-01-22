"use server";

import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { signIn, signOut } from "@/lib/auth/auth";

const SALT_ROUNDS = 12;

export type AuthActionResult = {
  error?: string;
  success?: boolean;
};

export async function register(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  const validatedFields = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError =
      errors.email?.[0] ||
      errors.password?.[0] ||
      errors.confirmPassword?.[0] ||
      "Invalid fields";
    return { error: firstError };
  }

  const { email, password } = validatedFields.data;
  const normalizedEmail = email.toLowerCase();

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  // Auto-login after registration
  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo: "/documents",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Failed to sign in after registration" };
    }
    throw error;
  }

  return { success: true };
}

export async function authenticate(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult | undefined> {
  try {
    await signIn("credentials", formData);
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
