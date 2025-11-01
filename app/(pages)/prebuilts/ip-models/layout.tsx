import { subMenus } from "../sub-menus";
import { GrSelect } from "react-icons/gr";
import { ADMIN_GROUP } from "@commons/globals/constants";
import getSession from "@commons/globals/session";
import VerticalPageLayout from "../../(layout)/vertical";
import NewIPModelButton from "./(components)/new-button";
import IpModelList from "./(components)/list";
import db from "@database/db";

export default async function IpModelsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const ipModels = await db.iPModel.findMany({
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

  return (
    <VerticalPageLayout
      title="IP Model"
      selectedMenu="IP Model"
      subMenus={subMenus}
    >
      <div className="flex items-center ml-1.5">
        <GrSelect className="size-3.5 stroke-txt mr-1.5" />
        <p className="font-bold text-txt">Select a IP Model</p>
      </div>
      <NewIPModelButton />
      <IpModelList ipModels={ipModels} />
      {children}
    </VerticalPageLayout>
  );
}
