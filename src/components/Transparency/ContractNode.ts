import { CSSProperties } from "react";
import { Node } from "react-flow-renderer";

export type ContractNode = {
  name: string;
  // Will be used as the node ID
  address: string;
  icon?: string;
  style?: CSSProperties;
  type?: string; // Node type: input, output, group or default
};

export const getNode = (item: ContractNode): Node => {
  return {
    id: item.address,
    data: { label: item.name },
    position: { x: 0, y: 0 },
    ...(item.style && { style: item.style }),
    ...(item.type && { type: item.type }),
  };
};

export const getNodes = (items: ContractNode[]): Node[] => {
  const nodesList: Node[] = [];
  items.forEach(value => {
    nodesList.push(getNode(value));
  });
  return nodesList;
};
