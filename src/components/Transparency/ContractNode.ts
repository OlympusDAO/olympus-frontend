import { CSSProperties } from "react";
import { Node } from "react-flow-renderer";

export type ContractNode = {
  name: string;
  // Will be used as the node ID
  address: string;
  icon?: string;
  style?: CSSProperties;
  type?: string; // Node type: input, output, group or default
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export const getNode = (item: ContractNode): Node => {
  const dimensions: CSSProperties = {
    ...(item.width && { width: item.width }),
    ...(item.height && { height: item.height }),
  };

  return {
    id: item.address,
    data: { label: item.name },
    position: { x: item.x || 0, y: item.y || 0 },
    ...((item.style || Object.keys(dimensions).length) && { style: { ...item.style, ...dimensions } }),
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
