import { CSSProperties } from "react";
import { Edge } from "react-flow-renderer";

export type ContractEdge = {
  source: string;
  target: string;
  animated?: boolean;
  type?: string; // Edge type: step, smoothstep, straight or default
  style?: CSSProperties;
  label?: string;
};

export const getEdge = (item: ContractEdge): Edge => {
  return {
    id: item.source + "-" + item.target,
    source: item.source,
    target: item.target,
    ...(item.type && { type: item.type }),
    ...(item.style && { style: item.style }),
    ...(item.label && { label: item.label }),
  };
};

export const getEdges = (items: ContractEdge[]): Edge[] => {
  const edgesList: Edge[] = [];
  items.forEach(value => {
    edgesList.push(getEdge(value));
  });
  return edgesList;
};
