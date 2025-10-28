export interface IPModelData {
  [version: string]: IPModelVersionData;
}

export interface IPModelVersionData {
  ports: { [port: string]: IPModelPortData };
  properties: {
    [property: string]: IPModelPropertyData;
  };
  display: IPModelDisplayData;
  cModelLib: { nca: boolean; ia: boolean };
}

export type DirectionType = "left" | "right";

export interface IPModelPortSourceType {
  type: string;
  portType: string;
}

export const wildcardSource: IPModelPortSourceType = {
  type: "*",
  portType: "*",
};

export function isWildcardSource(source: IPModelPortSourceType): boolean {
  return source.type === "*" && source.portType === "*";
}

export interface IPModelPortDisplayData {
  direction: DirectionType;
  color: string;
}

export interface IPModelPortData {
  type: string;
  sources: IPModelPortSourceType[];
  display: IPModelPortDisplayData;
}

export const propertyTypes = [
  "String",
  "Number",
  "String Select",
  "Number Select",
  "Boolean",
  "Address",
  "Complex",
  "Register Map",
];

export type PropertyType =
  | "String"
  | "Number"
  | "String Select"
  | "Number Select"
  | "Boolean"
  | "Address"
  | "Complex"
  | "Register Map";

export interface NoneConstraintType {
  type: "none";
  value: "none";
}

export interface ListConstraintType {
  type: "list";
  value: (string | number)[];
}

export interface RangeConstraintType {
  type: "range";
  value: { from: number | string; to: number | string };
}

export type IPModelPropertyConstraintType =
  | NoneConstraintType
  | ListConstraintType
  | RangeConstraintType;

export const noneConstraint: IPModelPropertyConstraintType = {
  type: "none",
  value: "none",
};

export const propertyCategories = ["Both", "Simulation", "Hardware"];
export type PropertyCategoryType = "Both" | "Simulation" | "Hardware";

export interface IPModelPropertyData {
  type: PropertyType;
  category: PropertyCategoryType;
  description: string;
  constraint: IPModelPropertyConstraintType;
  defaultValue: any;
}

export interface IPDisplayColorType {
  icon: string;
  border: string;
}

export interface IPModelDisplayData {
  size: { width: number; height: number };
  color: IPDisplayColorType;
}

export interface IPInstanceData {
  ports: { [port: string]: IPInstancePortData };
  properties: { [property: string]: string | number | boolean | object };
  display: IPInstanceDisplayData;
}

export interface IPInstancePortData {
  properties?: {
    mapping?: {
      base: string;
      size: string;
      remap: string;
      add_offset: string;
      remove_offset: boolean;
    };
    size?: number;
  };
  bypass_mapping?: boolean;
}

interface IPInstanceDisplayData {
  size: { width: number; height: number };
  position: { x: number; y: number };
  color: IPDisplayColorType;
  folding: boolean;
}

export interface IPInstanceBindingData {
  from: string;
  to: string;
  properties?: {
    mapping?: {
      from?: number[];
      to?: number[];
    };
    crossing?: {
      type: "sync" | "async";
      fifo_size: number;
      direction: "from" | "none";
      source_sync: number;
      sink_sync: number;
    };
  };
}
