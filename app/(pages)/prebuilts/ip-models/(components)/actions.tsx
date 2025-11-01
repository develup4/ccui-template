"use server";

import "server-only";
import { format } from "date-fns";
import getSession from "@/app/(commons)/globals/session";
import db from "@/prisma/db";
import {
  MIN_NODE_HEIGHT,
  MIN_NODE_WIDTH,
  NODE_DEFAULT_COLOR,
} from "@/app/(commons)/globals/constants";
import { convertNameToUrl } from "@/app/(commons)/utilities/string-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getTimestampedIpModelName(): string {
  const timestamp = format(new Date(), "yyMMdd_HHmmss");
  return `new_model_${timestamp}`;
}

export async function createIpModel() {
  const session = await getSession();
  const newModelName = getTimestampedIpModelName();

  await db.iPModel.create({
    data: {
      "1.0.0": {
        ports: {},
        properties: {},
        display: {
          size: { width: MIN_NODE_WIDTH, height: MIN_NODE_HEIGHT },
          color: NODE_DEFAULT_COLOR,
        },
        cModelLib: { ia: false, nca: false },
      },
      ownerGroup: { connect: { name: session.dept } },
    },
  });

  // Redirect to new project page
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(
    `[  SUCCESS  ] Create IP Model - ${newModelName} (${session.knoxId})`
  );
  const newModelUrl = convertNameToUrl(newModelName);
  revalidatePath(`/prebuitls/ip-models/${newModelUrl}`);
  redirect(`/prebuitls/ip-models/${newModelUrl}/v1.0.0?mode=new`);
}
