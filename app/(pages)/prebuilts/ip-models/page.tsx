import { redirect } from "next/navigation";
import { convertNameToUrl } from "@commons/utilities/string-utils";
import { ADMIN_GROUP } from "@commons/globals/constants";
import getSession from "@/app/(commons)/globals/session";
import db from "@database/db";

export default async function IPModelsPage() {
  const session = await getSession();
  const firstModel = await db.iPModel.findFirst({
    where: {
      OR: [
        { ownerGroup: { name: session.dept } },
        { ownerGroup: { name: ADMIN_GROUP } },
      ],
      isSystem: false,
      deleteFlag: false,
    },
    orderBy: { createdAt: "desc" },
  });

  const initialPage = `/prebuilts/ip-models/${convertNameToUrl(
    firstModel!.type
  )}`;
  redirect(initialPage);
}
