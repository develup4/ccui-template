import Link from "next/link";
import { SubMenusType } from "./types";

interface TabMenusProps {
  subMenus: SubMenusType;
  selectedMenu: string;
}

export default function TabMenus({ subMenus, selectedMenu }: TabMenusProps) {
  return (
    <div role="tablist" className="tabs tabs-border tabs-xs -ml-2">
      {subMenus.map((menu, index) => (
        <div
          role="tab"
          className={`tab text-highlight hover:text-highlight pl-5 ${
            menu.name === selectedMenu ? "tab-active" : ""
          }`}
          key={index}
        >
          <Link
            href={menu.link}
            target={menu.newWindow ? "_blank" : "_self"}
            className="flex items-center *:hover:text-highlight *:hover:font-bold"
          >
            <menu.Icon
              className={`${
                menu.name === selectedMenu ? "text-highlight" : "text-gray-300"
              }`}
            />
            <p
              className={`${
                menu.name === selectedMenu
                  ? "text-highlight font-bold"
                  : "text-gray-300"
              } pl-1.5 pr-5`}
            >
              {menu.name}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
