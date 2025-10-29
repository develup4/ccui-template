"use client";

import { useState } from "react";
import { GoFold, GoUnfold } from "react-icons/go";

interface FoldDividerProps {
  children: React.ReactNode;
  foldedMessage: string;
}

export default function FoldDivider({
  children,
  foldedMessage,
}: FoldDividerProps) {
  const [fold, setFold] = useState<boolean>(false);

  return (
    <div className="border-t border-bd mt-12 mb-8">
      <div
        onClick={() => setFold(!fold)}
        className="flex justify-end items-center cursor-pointer hover:*:fill-white mt-4"
      >
        <div className="tooltip" data-tip={fold ? "Unfold" : "Fold"}>
          {fold ? <GoUnfold /> : <GoFold />}
        </div>
      </div>
      {fold && <p className="text-base mt-4">{foldedMessage}</p>}
      {fold === false && <div className="mt-2 pr-3">{children}</div>}
    </div>
  );
}
