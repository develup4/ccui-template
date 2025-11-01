import { usePathname } from "next/navigation";
import { IoHardwareChipOutline } from "react-icons/io5";
import { IPModel } from "@prisma/client";
import { format } from "date-fns";
import {
  convertNameToUrl,
  convertUrlToName,
} from "@commons/utilities/string-utils";
import Link from "next/link";

interface IpModelListItemProps {
  ipModel: IPModel;
}

export default function IpModelListItem({ ipModel }: IpModelListItemProps) {
  return (
    <Link
      href={`/prebuilts/ip-models/${convertNameToUrl(
        ipModel.type.toLocaleLowerCase()
      )}`}
    >
      <div
        className={`${
          convertUrlToName(usePathname().split("/").at(-2)!) ===
          ipModel.type.toLowerCase()
            ? "bg-bd"
            : ""
        } w-full cursor-pointer hover:bg-gray-overlay rounded-md p-4 mb-1`}
      >
        <p className="font-bold font-poppins text-sm mb-1">
          {ipModel.type.toUpperCase()}
        </p>
        <div className="w-full flex justify-between items-center">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center">
              <IoHardwareChipOutline className="fill-white mr-1 -ml-0.5" />
              {ipModel.isSystem && <p>System IP</p>}
              {ipModel.isComposite && <p>Composite IP</p>}
              {ipModel.isCustom && <p>Custom IP</p>}
              {!ipModel.isSystem &&
                !ipModel.isComposite &&
                !ipModel.isCustom && <p>Embedded IP</p>}
            </div>
            <p className="text-gray-500">
              {format(ipModel.updatedAt, "yy.MM.dd hh:mm:ss")}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
