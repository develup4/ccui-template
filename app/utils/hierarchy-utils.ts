import { IPInstance } from '../sample-data';

export interface HierarchyResult {
  target: IPInstance | null;
  parent: IPInstance | null;
  children: IPInstance[];
}

/**
 * Find an IPInstance by its hierarchy path and return it with its parent and direct children
 * @param rootInstance - The root IPInstance to search from
 * @param hierarchyPath - The hierarchy path string (e.g., "root.cpu_cluster.core0")
 * @returns Object containing the target instance, its parent, and direct children
 */
export function findInstanceWithContext(
  rootInstance: IPInstance,
  hierarchyPath: string
): HierarchyResult {
  const result: HierarchyResult = {
    target: null,
    parent: null,
    children: []
  };

  if (!rootInstance || !hierarchyPath) {
    return result;
  }

  // Find the target instance
  const target = findInstanceByHierarchy(rootInstance, hierarchyPath);
  if (!target) {
    return result;
  }

  result.target = target;
  result.children = target.children || [];

  // Find the parent if it's not the root
  if (target !== rootInstance) {
    result.parent = findParentInstance(rootInstance, hierarchyPath);
  }

  return result;
}

/**
 * Internal function to find an IPInstance by its hierarchy path
 */
function findInstanceByHierarchy(
  rootInstance: IPInstance,
  hierarchyPath: string
): IPInstance | null {
  if (!rootInstance || !hierarchyPath) {
    return null;
  }

  // Recursive search through all instances to find exact hierarchy match
  function searchInInstance(instance: IPInstance): IPInstance | null {
    // Check if current instance matches
    if (instance.hierarchy === hierarchyPath) {
      return instance;
    }

    // Search in children
    if (instance.children) {
      for (const child of instance.children) {
        const found = searchInInstance(child);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  return searchInInstance(rootInstance);
}

/**
 * Internal function to find the parent of an instance by hierarchy path
 */
function findParentInstance(
  rootInstance: IPInstance,
  hierarchyPath: string
): IPInstance | null {
  const pathParts = hierarchyPath.split('.');

  // If there's only one part, the root might be the parent
  if (pathParts.length <= 1) {
    return null;
  }

  // Get the parent path by removing the last part
  const parentPath = pathParts.slice(0, -1).join('.');

  return findInstanceByHierarchy(rootInstance, parentPath);
}