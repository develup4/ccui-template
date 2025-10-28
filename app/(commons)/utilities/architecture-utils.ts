import { Architecture, IPInstance, IPModel } from "@prisma/client";
import getSession from "../globals/session";
import db from "@database/db";
import { includes } from "lodash";

export type IPInstanceTree = IPInstance & {
  parent: IPInstance | null;
  children: IPInstanceTree[];
  model: IPModel;
};

export type ArchitectureWithTree = Architecture & {
  ipInstance: IPInstanceTree;
};

export async function getArchitectureWithHierarchy(
  name: string
): Promise<ArchitectureWithTree> {
  const architecture = await db.architecture.findUniqueOrThrow({
    where: { name },
    includes: { IPInstance: true },
  });

  return {
    ...architecture,
    ipInstance: await fetchIPInstanceTree(architecture.ipInstance.id),
  };
}

export async function fetchIPInstanceTree(id: number): Promise<IPInstanceTree> {
  const instance = await db.ipInstance.findUniqueOrThrow({
    where: { id },
    includes: { children: true, parent: true, model: true },
  });

  const children = await Promise.all(
    instance.children.map((child: IPInstance) => fetchIPInstanceTree(child.id))
  );
  return {
    ...instance,
    children,
    parent: instance.parent as IPInstanceTree,
  };
}

export async function cloneArchitecture(projectName: string, originalName: string, newName:string):Promise<Architecture> {
    const session = await getSession();
    const original = await getArchitectureWithHierarchy(originalName);

    const newRootId = await cloneIPInstanceTree(
        original.ipInstance,
        null,
        new Map()
    );

    const cloned = await db.architecture.create({
      data: {
        name: newName,
        ipInstance: {connect: {id:newRootId}},
        project:{connect:{name:projectName}},
        baseline: {connect:{id:original.baselineId}},
        baselineVersion: original.baselineVersion,
        creator: { connect: {session.id}},
        storedData: original.storedData ?? {}
      }
    });
    return cloned;
}

async function cloneIPInstanceTree(original:IPInstanceTree, parentId: number|null, cloneMap: Map<number, number>):Promise<number>{
  const newInstance = await db.ipInstance.create({
    data: {
      name: original.name,
      memo: original.memo,
      hierarchy: original.hierarchy,
      data: original.data ?? {},
      bindings: original.bindings ?? [],
      children: undefined,
      modelVersion: original.modelVersion,
      model: {connect:{id:original.modelId}},
      parent: parentId ? {connect:{id:parentId}}:undefined
    }
  });

  // Connect children
  cloneMap.set(original.id, newInstance.id);
  const childIds = await Promise.all(
    original.children.map((child:IPInstanceTree) =>
    cloneIPInstanceTree(child, newInstance.id, cloneMap))
  );
  if (childIds.length > 0) {
    await db.ipInstance.update({
      where: {id:newInstance.id},
      data: {
        children: {
          connect: childIds.map((id)=> ({id})),
        }
      }
    });
  }
  return newInstance.id;
}