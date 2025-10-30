import { BreadcrumbItem } from "../(commons)/breadcrumb";
import { SubMenusType } from "../(commons)/tab-menus/types";
import Header from "./header";

interface FullscreenPageLayoutProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  user: { epId: string; knoxId: string };
  subMenus: SubMenusType;
  selectedMenu: string;
  width?: string;
  children: [
    left: React.ReactNode,
    center: React.ReactNode,
    right: React.ReactNode
  ];
}

export default function FullscreenPageLayout({
  title,
  breadcrumbItems,
  user,
  subMenus,
  selectedMenu,
  width = "max-w-[98%]",
  children: [left, center, right],
}: FullscreenPageLayoutProps) {
  return (
    <div className="w-full font-montserrat size-full bg-background">
      <Header
        title={title}
        breadcrumbItems={breadcrumbItems}
        subMenus={subMenus}
        selectedMenu={selectedMenu}
        width={width}
        user={user}
      />
      <div className="w-full flex justify-center">
        <div
          className={`w-full ${width} h-[calc(100vh-14rem) flex mt-8 px-10]`}
        >
          <div className="min-w-[26rem] max-w-[26rem] overflow-y-scroll scrollbar-hide pr-8">
            {left}
          </div>
          <div className="w-full bg-overlay rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.15)] ring-1 ring-bd">
            {center}
          </div>
          <div className="min-w-[22rem] max-w-[22rem] overflow-y-scroll scrollbar-hide pr-8">
            {right}
          </div>
        </div>
      </div>
    </div>
  );
}
