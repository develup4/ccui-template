import { topMenus } from "../(commons)/top-menus";
import { SubMenusType } from "../(commons)/tab-menus/types";
import Breadcrumb, { BreadcrumbItem } from "../(commons)/breadcrumb";
import Logo from "@/app/(commons)/components/logo";
import Avatar from "@/app/(commons)/components/avatar";
import AiAssitant from "../(commons)/ai-assistnat";
import TabMenus from "../(commons)/tab-menus";
import Link from "next/link";

interface HeaderProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  subMenus: SubMenusType;
  selectedMenu: string;
  width: string;
  user: { epId: string; knoxId: string };
}

export default function Header({
  title,
  breadcrumbItems,
  user,
  subMenus,
  selectedMenu,
  width,
}: HeaderProps) {
  return (
    <div className="flex justify-center w-full border-b border-bd px-10 pt-5">
      <div className={`w-full ${width}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="flex items-center gap-5">
            {topMenus.map((menu, index) => (
              <Link href={`/${menu.toLowerCase()}`} key={index}>
                <p className="hover:font-bold hover:text-highlight">{menu}</p>
              </Link>
            ))}
            <Link href={`/support/user/profile/${user.knoxId}`}>
              <Avatar epid={user.epId} knoxId={user.knoxId} ring />
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
