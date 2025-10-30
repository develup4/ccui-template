import { SubMenusType } from "../(commons)/tab-menus/types";
import Header from "./header";

interface VerticalPageLayoutProps {
  title: string;
  subMenus: SubMenusType;
  selectedMenu: string;
  width?: string;
  children: [
    leftTopMenu: React.ReactNode,
    rightTopMenu: React.ReactNode,
    leftPanel: React.ReactNode,
    mainPanel: React.ReactNode
  ];
}

export default function VerticalPageLayout({
  title,
  subMenus,
  selectedMenu,
  width = "max-w-screen-2xl",
  children: [leftTopMenu, rightTopMenu, leftPanel, mainPanel],
}: VerticalPageLayoutProps) {
  return (
    <div className="font-montserrat size-full flex flex-col items-center">
      <Header
        title={title}
        subMenus={subMenus}
        selectedMenu={selectedMenu}
        width={width}
      />
      <div className={`${width} size-full mt-[10rem] pt-4`}>
        <div className="w-full h-16 flex justify-between items-center">
          <div className="md:block hidden fixed ml-2">{leftTopMenu}</div>
          <div id="dummy" />
          <div className="mr-2">{rightTopMenu}</div>
        </div>
        <div className="size-full flex mb-8">
          <div className="min-w-80 max-h-[calc(100vh-20rem)] md:block hidden overflow-y-auto scrollbar-hide pl-2">
            {leftPanel}
          </div>
          <div className="w-full min-h-[calc(100vh-20rem)] bg-overlay rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.15)] ring-1 ring-bd p-8 md:ml-80 mx-2">
            {mainPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
