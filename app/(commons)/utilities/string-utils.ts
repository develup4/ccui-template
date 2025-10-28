import { IPInstanceTree } from "./architecture-utils";

export function makeFirstCharOnlyUpper(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function isNumeric(str: string): boolean {
  if (typeof str !== "string" || str.trim() === "") {
    return false;
  }
  return !isNaN(Number(str));
}

export function isValidAddress(str: string): boolean {
  let content = str;
  if (str.includes("0x")) {
    content = str.split("0x")[1];
  }
  return /^[0-9a-fA-F]{8}$/.test(content);
}

export function convertNameToUrl(title: string): string {
  const formattedStr = title.replace(/\s+/g, "-");
  return formattedStr;
}

export function convertUrlToName(url: string): string {
  const formattedStr = url.replace(/-/g, " ");
  return formattedStr;
}

export function getNoOverlappedName(name: string, parent: IPInstanceTree) {
  let currentName = name;
  let numbering = 2;

  const findExistSameName = () =>
    parent.children.some(
      (component: IPInstanceTree) => component.name === currentName
    );

  // Initial numbering name
  if (findExistSameName()) {
    currentName = `${name}${numbering}`;
  } else {
    return currentName;
  }

  // Find right numbering
  while (findExistSameName()) {
    numbering++;
    currentName = `${currentName.slice(
      0,
      numbering > 10 ? -2 : -1
    )}${numbering}`;
  }
  return currentName;
}
