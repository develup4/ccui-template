import { topMenus } from "../../(commons)/top-menus";
import { SubMenusType } from "../../(commons)/tab-menus/types";
import Logo from "@/app/(commons)/components/logo";
import Avatar from "@/app/(commons)/components/avatar";
import getSession from "@/app/(commons)/globals/session";
import UrlBreadcrumb from "./url-breadcrumb";
import AiAssitant from "../../(commons)/ai-assistnat";
import TabMenus from "../../(commons)/tab-menus";
import Link from "next/link";

interface HeaderProps {
  title: string;
  subMenus: SubMenusType;
  selectedMenu: string;
  width: string;
}

export default async function Header({
  title,
  subMenus,
  selectedMenu,
  width,
}: HeaderProps) {
  const session = await getSession();

  return (
    <div className="w-full min-h-[5rem] flex flex-col items-center bg-background border-b border-bd fixed z-50">
      <div className={`${width} w-full`}>
        <div className="min-h-[5rem] flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
            <UrlBreadcrumb />
          </div>
          <div className="flex items-center gap-5">
            {topMenus.map((menu, index) => (
              <Link href={`/${menu.toLowerCase()}`} key={index}>
                <p className="hover:font-bold hover:text-highlight">{menu}</p>
              </Link>
            ))}
            <Link href={`/support/user/profile/${session.knoxId}`}>
              <Avatar epid={session.epid} knoxId={session.knoxId} ring />
            </Link>
          </div>
        </div>
        <p className="text-2xl font-bold my-5">{title}</p>
        <div className="flex justify-between">
          <TabMenus subMenus={subMenus} selectedMenu={selectedMenu} />
          <AiAssitant />
        </div>
      </div>
    </div>
  );
}
