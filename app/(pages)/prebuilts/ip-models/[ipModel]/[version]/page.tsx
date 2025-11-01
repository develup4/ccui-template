import { ADMIN_GROUP, ADMIN_GROUP_ID } from "@commons/globals/constants";
import { notFound, redirect } from "next/navigation";
import IPModelInfo from "./ip-model-info";
import getSession from "@commons/globals/session";
import db from "@database/db";

interface IpModelProps {
  params: { ipModel: string; version: string };
  searchParams: { mode: string };
}

export async function generateMetadata({
  params: { ipModel, version },
  searchParams: { mode },
}: IpModelProps) {
  return { title: `${ipModel.toUpperCase()} ${version}` };
}

export default async function IPModel({
  params: { ipModel, version },
  searchParams: { mode },
}: IpModelProps) {
  const session = await getSession();
  const parsedVersion = version.split("v")[1];

  const ipModels = (
    await db.iPModel.findMany({
      where: {
        OR: [
          { ownerGroup: { name: session.dept } },
          { ownerGroup: { name: ADMIN_GROUP } },
        ],
      },
    })
  ).map((model) => model.type);

  const ipModelData = await db.iPModel.findUniqueOrThrow({
    where: {
      type: ipModel,
      OR: [
        { ownerGroup: { name: session.dept } },
        { ownerGroup: { name: ADMIN_GROUP } },
      ],
    },
    include: {
      ownerGroup: true,
      _count: {
        select: {
          instances: true,
        },
      },
    },
  });

  const portTypes = await db.iPPortType.findMany();

  // 404
  if (!ipModelData) {
    notFound();
  }

  // 403
  if (
    ipModelData.ownerGroup.name !== ADMIN_GROUP &&
    ipModelData.ownerGroup.name !== session.dept
  ) {
    redirect("/credentials/forbidden");
  }

  const editable =
    ipModelData.ownerGroupId !== ADMIN_GROUP_ID ||
    (ipModelData.ownerGroupId === ADMIN_GROUP_ID &&
      session.dept === ADMIN_GROUP);

  return (
    <IPModelInfo
      selectedModel={ipModelData}
      version={parsedVersion}
      ipModels={ipModels}
      portTypes={portTypes}
      newMode={mode === "new"}
      editable={editable}
    />
  );
}
