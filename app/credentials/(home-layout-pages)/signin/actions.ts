"use server";

import "server-only";
import { z } from "zod";
import { redirect } from "next/navigation";
import { UserStatus } from "@prisma/client";
import getSession from "@/app/(commons)/globals/session";
import bcrypt from "bcryptjs";
import db from "@database/db";

const checkKnoxIdExists = async (knoxId: string) => {
  const user = await db.user.findUnique({
    where: {
      knoxId,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  knoxId: z
    .string({
      invalid_type_error: "KnoxId must be a string!",
      required_error: "Please enter a knox id!",
    })
    .toLowerCase()
    .trim()
    .refine(checkKnoxIdExists, "An KnoxId does not exist!"),
  password: z.string().min(4),
});

export async function login(
  data: { redirectUrl: string | undefined | null },
  prevState: any,
  formData: FormData
) {
  // Get input data
  if (!formData.get("knoxId") || !formData.get("password")) {
    console.error("[  FAIL     ] Invalid login input");
    redirect("/credentials/signin");
  }

  const validateData = {
    knoxId: formData.get("knoxId"),
    password: formData.get("password"),
  };

  // Validate form data
  const result = await formSchema.spa(validateData);
  if (result.success === false) {
    console.error("[  FAIL     ] No valid user information");
    const errors = result.error.flatten();
    console.error(errors);
    return errors;
  }

  // Check account
  const user = await db.user.findUnique({
    where: { knoxId: result.data.knoxId },
  });

  if (!user) {
    console.error(`[  FAIL     ] No exist ${result.data.knoxId} in database`);
    redirect("/credentials/signup");
  }

  // Check status
  if (user.status) {
    let errorMessage = "";
    switch (user.status) {
      case UserStatus.BANNED:
        errorMessage = "This user is banned!";
        break;
      case UserStatus.DORMANT:
        errorMessage = "This user is dormant!!";
        break;
      case UserStatus.WAIT_APPROVE:
        errorMessage = "Please wait account approval.";
        break;
      default:
        break;
    }

    console.error(
      `[  FAIL     ] ${result.data.knoxId} is ${user.status} status`
    );
    return {
      fieldErrors: {
        knoxId: [errorMessage],
        password: [],
      },
    };
  }

  // Check password
  const ok = await bcrypt.compare(
    result.data.password,
    user!.hashedPassword ?? ""
  );

  if (ok === false) {
    console.error("[  FAIL     ] Wrong password");
    return {
      fieldErrors: {
        knoxId: [],
        password: ["Wrong password."],
      },
    };
  }

  // Store session
  const session = await getSession();
  session.knoxId = user.knoxId;
  session.name = user.name;
  session.epid = user.epid;
  session.company = user.company;
  session.dept = user.dept;
  session.region = user.region;
  await session.save();

  // Redirect to project page
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`[  SUCCESS  ] logged in successfully (${result.data.knoxId})`);

  let redirectUrl = "/explorer/projects";
  if (
    data &&
    data.redirectUrl !== null &&
    data.redirectUrl !== undefined &&
    data.redirectUrl !== ""
  ) {
    redirectUrl = decodeURIComponent(data.redirectUrl);
  }
  redirect(`/credentials/active-directory?redirectUrl=${redirectUrl}`);
}
