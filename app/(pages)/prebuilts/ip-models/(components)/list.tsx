"use client";

import { IPModel } from "@prisma/client";
import { useState } from "react";
import IpModelSearch from "@layout/(commons)/search";
import IpModelListItem from "./list-item";

interface IpModelListProps {
  ipModels: IPModel[];
}

export default function IpModelList({ ipModels }: IpModelListProps) {
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const foundIpModels = ipModels.filter((ipModel: IPModel) =>
    ipModel.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="mr-8">
      <IpModelSearch setSearchKeyword={setSearchKeyword} />
      <div className="w-full h-[71.5vh] overflow-y-scroll scrollbar-hide">
        {searchKeyword.length > 0 &&
          foundIpModels.map((ipModel, index) => (
            <IpModelListItem ipModel={ipModel} key={index} />
          ))}
        {searchKeyword.length === 0 &&
          ipModels.map((ipModel, index) => (
            <IpModelListItem ipModel={ipModel} key={index} />
          ))}
      </div>
    </div>
  );
}
