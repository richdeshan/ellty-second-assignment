import { Calculation } from "@/types";

export function buildTree(items: Calculation[]): Calculation[] {
  const rootNodes: Calculation[] = [];
  const lookup: { [key: string]: Calculation & { children: Calculation[] } } =
    {};

  for (const item of items) {
    lookup[item._id] = { ...item, children: [] };
  }

  for (const item of items) {
    const parentId = item.parentId;
    if (parentId && lookup[parentId]) {
      lookup[parentId].children.push(lookup[item._id]);
    } else {
      rootNodes.push(lookup[item._id]);
    }
  }

  return rootNodes;
}
