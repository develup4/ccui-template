"use server";

import "server-only";
import { z } from "zod";
import { redirect } from "next/navigation";
import db from "@database/db";
import bcrypt from "bcryptjs";

const formSchema = z
  .object({
    knoxId: z
      .string({
        invalid_type_error: "Knox Portal ID must be a string!",
        required_error: "Please enter a Knox Portal ID!",
      })
      .toLowerCase()
      .trim(),
    name: z.string({
      invalid_type_error: "Username must be a string!",
      required_error: "Please enter a username!",
    }),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .superRefine(async ({ knoxId }, ctx) => {
    const user = await db.user.findUnique({
      where: { knoxId },
      select: { id: true },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This Knox Portal ID is already used!",
        path: ["knoxId"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(
    ({
      password,
      confirmPassword,
    }: {
      password: string;
      confirmPassword: string;
    }) => password === confirmPassword,
    {
      message: "Both passwords should be the same!",
      path: ["confirmPassword"],
    }
  );

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    knoxId: formData.get("knoxId"),
    name: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // Validate form data
  const result = await formSchema.spa(data);
  if (result.success === false) {
    const errors = result.error.flatten();
    console.error("[  FAIL     ] form data is invalid");
    console.error(errors);
    return errors;
  }

  // Create account
  let hashedPassword = "";
  try {
    hashedPassword = await bcrypt.hash(result.data.password, 12);
  } catch (e) {
    console.error("[  FAIL     ] Fail to make hash of password");
    console.error(e);
    return {
      fieldErrors: {
        knoxId: undefined,
        name: undefined,
        password: undefined,
        confirmPassword: ["Fail to make a hash"],
      },
    };
  }

  try {
    await db.user.create({
      data: {
        knoxId: result.data.knoxId,
        name: result.data.name,
        hashedPassword,
        settings: {},
      },
      select: {
        id: true,
        knoxId: true,
      },
    });
  } catch (e) {
    console.error("[  FAIL     ] Fail to make a user in database");
    console.error(e);
    return {
      fieldErrors: {
        knoxId: undefined,
        name: undefined,
        password: undefined,
        confirmPassword: ["Temporary database problem"],
      },
    };
  }

  // Redirect to home
  console.log(
    `[  SUCCESS  ] Create ${result.data.knoxId} account (${result.data.knoxId})`
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
  redirect("/credentials/wait-approval");
}
