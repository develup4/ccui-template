import { TbLego } from "react-icons/tb";
import { SiBlueprint } from "react-icons/si";
import { FaCodeBranch } from "react-icons/fa6";
import { MdOutlinePrecisionManufacturing } from "react-icons/md";
import { SubMenusType } from "@layout/(commons)/tab-menus/types";

export const subMenus: SubMenusType = [
  { name: "IP Model", link: "/prebuilts/ip-models", Icon: TbLego },
  {
    name: "Baseline Architecture",
    link: "/prebuilts/baseline-architectures",
    Icon: SiBlueprint,
  },
  { name: "Firmware", link: "/prebuilts/firmwares", Icon: FaCodeBranch },
  {
    name: "Manufacturing Process",
    link: "/prebuilts/manufacturing-processes",
    Icon: MdOutlinePrecisionManufacturing,
  },
];
