import { IconType } from "react-icons";

export type SubMenusType = {
  name: string;
  link: string;
  Icon: IconType;
  newWindow?: boolean;
}[];
