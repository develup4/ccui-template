import { IPInstanceBindingData } from "@/prisma/ir-types";
import { IPInstanceTree } from "./architecture-utils";

export function getBindingIdFromData(binding: IPInstanceBindingData | null) {
  if (!binding) {
    return null;
  }
  return `${binding.from}=>${binding.to}`;
}

export function getBindingFrom(bindingId: string) {
  if (!bindingId || bindingId.includes("=>") === false) {
    return null;
  }
  return bindingId.split("=>")[0];
}

export function getBindingTo(bindingId: string) {
  if (!bindingId || bindingId.includes("=>") === false) {
    return null;
  }
  return bindingId.split("=>")[1];
}

export function getBindingNodeName(fromOrTo: string) {
  if (!fromOrTo || fromOrTo.includes("->") === false) {
    return null;
  }
  return fromOrTo.split("->")[0];
}

export function getBindingPortName(fromOrTo: string) {
  if (!fromOrTo || fromOrTo.includes("->") === false) {
    return null;
  }
  return fromOrTo.split("->")[1];
}

export function findBindingFromOrToParent(fromOrTo: string) {
  return fromOrTo.includes("->") === false;
}

export function findBinding(parent: IPInstanceTree, id: string) {
  const bindings = parent.bindings as IPInstanceBindingData[];
  return bindings.find(
    (binding) =>
      binding.from === getBindingFrom(id) && binding.to === getBindingTo(id)
  );
}

export function updateBindingByNewName(
  parent: IPInstanceTree,
  oldName: string,
  newName: string
) {
  const bindings = parent.bindings as IPInstanceBindingData[];
  return bindings.map((binding) => {
    if (getBindingNodeName(binding.from) === oldName) {
      binding.from = `${newName}->${getBindingPortName(binding.from)}`;
      return binding;
    } else if (getBindingNodeName(binding.to) === oldName) {
      binding.to = `${newName}->${getBindingPortName(binding.to)}`;
      return binding;
    } else {
      return binding;
    }
  });
}
