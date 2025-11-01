"use client";

import FoldDivider from "@/app/(pages)/(layout)/(commons)/fold-divider";
import {
  IPModelData,
  IPModelPortData,
  IPModelPropertyData,
  IPModelVersionData,
} from "@/prisma/ir-types";
import { IPModel, IPPortType } from "@prisma/client";
import { useState } from "react";
import { string } from "zod";

interface IPModelInfoProps {
  selectedModel: IPModel & { _count: { instances: number } };
  version: string;
  ipModels: string[];
  portTypes: IPPortType[];
  newMode: boolean;
  editable: boolean;
}

export default function IPModelInfo({
  selectedModel,
  version,
  ipModels,
  portTypes,
  newMode,
  editable,
}: IPModelInfoProps) {
  const ipModelData: IPModelData = selectedModel.data as unknown as IPModelData;
  const currentVersionData: IPModelVersionData = ipModelData[version];

  const [ports, setPorts] = useState<[string, IPModelPortData][]>(
    Object.entries(currentVersionData.ports ?? {}).sort((a, b) =>
      a[0].localeCompare(b[0])
    )
  );

  const properties: [string, IPModelPropertyData][] = Object.entries(
    currentVersionData.ports ?? {}
  ).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div>
      <IPModelTitle
        ipModel={selectedModel}
        version={version}
        newIpModelMode={newMode}
        editable={editable}
      />
      <FoldDivider foldedMessage="Basic Info">
        <div className="flex gap-6 -mt-2 -mb-4">
          <IPModelDesign
            ipModel={selectedModel}
            version={version}
            ports={ports}
            editable={editable}
          />
          <CModelUpload
            ipModel={selectedModel}
            version={version}
            editable={editable}
          />
        </div>
      </FoldDivider>
    </div>
  );
}
