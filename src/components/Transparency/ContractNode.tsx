import { CSSProperties } from "react";
import { Node } from "react-flow-renderer";

import { NodeLabel } from "./NodeLabel";

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
  labelSpacing?: number;
};

export const getNode = (item: ContractNode, defaultWidth?: number, defaultHeight?: number): Node => {
  const dimensions: CSSProperties = {
    ...(item.width && { width: item.width }),
    ...(!item.width && defaultWidth && { width: defaultWidth }),
    ...(item.height && { height: item.height }),
    ...(!item.height && defaultHeight && { height: defaultHeight }),
  };

  return {
    id: item.address,
    data: { label: <NodeLabel label={item.name} address={item.address} labelSpacing={item.labelSpacing} /> },
    position: { x: item.x || 0, y: item.y || 0 },
    ...((item.style || Object.keys(dimensions).length) && { style: { ...item.style, ...dimensions } }),
    ...(item.type && { type: item.type }),
  };
};

export const getNodes = (items: ContractNode[], defaultWidth?: number, defaultHeight?: number): Node[] => {
  const nodesList: Node[] = [];
  items.forEach(value => {
    nodesList.push(getNode(value, defaultWidth, defaultHeight));
  });
  return nodesList;
};
