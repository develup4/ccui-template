import { notFound, redirect } from "next/navigation";
import { ADMIN_GROUP } from "@commons/globals/constants";
import getSession from "@commons/globals/session";
import db from "@database/db";

interface IpModelProps {
  params: { ipModel: string };
}

export default async function IPModelPage({
  params: { ipModel },
}: IpModelProps) {
  const session = await getSession();
  const model = await db.iPModel.findUniqueOrThrow({
    where: {
      type: ipModel,
      OR: [
        { ownerGroup: { name: session.dept } },
        { ownerGroup: { name: ADMIN_GROUP } },
      ],
    },
    include: { ownerGroup: true },
  });

  // 404
  if (!model) {
    notFound();
  }

  // 403
  if (
    model.ownerGroup.name !== ADMIN_GROUP &&
    model.ownerGroup.name !== session.dept
  ) {
    redirect("/credentials/forbidden");
  }

  const initialPage = `/prebuilts/ip-models/${ipModel}/v${
    Object.keys(model.data as Object).at(-1) ?? "1.0.0"
  }`;
  redirect(initialPage);
}
