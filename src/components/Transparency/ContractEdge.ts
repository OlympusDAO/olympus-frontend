import { CSSProperties } from "react";
import { Edge } from "react-flow-renderer";

export type ContractEdge = {
  source: string;
  target: string;
  animated?: boolean;
  type?: string; // Edge type: step, smoothstep, straight or default
  style?: CSSProperties;
  label?: string;
  labelBackgroundColor?: string;
  sourceHandle?: string;
  targetHandle?: string;
  labelOffsetX?: string;
  labelOffsetY?: string;
};

export const getEdge = (item: ContractEdge): Edge => {
  const labelStyle: CSSProperties = {
    ...(item.labelOffsetX && !item.labelOffsetY && { transform: `translateX(${item.labelOffsetX})` }),
    ...(!item.labelOffsetX && item.labelOffsetY && { transform: `translateY(${item.labelOffsetY})` }),
    ...(item.labelOffsetX &&
      item.labelOffsetY && { transform: `translateX(${item.labelOffsetX}) translateY(${item.labelOffsetY})` }),
  };

  const labelBgStyle: CSSProperties = {
    ...(item.labelOffsetX && !item.labelOffsetY && { transform: `translateX(${item.labelOffsetX})` }),
    ...(!item.labelOffsetX && item.labelOffsetY && { transform: `translateY(${item.labelOffsetY})` }),
    ...(item.labelOffsetX &&
      item.labelOffsetY && { transform: `translateX(${item.labelOffsetX}) translateY(${item.labelOffsetY})` }),
    ...(item.labelBackgroundColor && { fill: item.labelBackgroundColor }),
  };

  return {
    id: item.source + "-" + item.target,
    source: item.source,
    target: item.target,
    ...(item.type && { type: item.type }),
    ...(item.style && { style: item.style }),
    ...(item.label && { label: item.label }),
    ...(item.animated && { animated: item.animated }),
    labelBgPadding: [10, 4],
    labelBgBorderRadius: 4,
    ...(Object.keys(labelBgStyle).length && { labelBgStyle: labelBgStyle }),
    ...(Object.keys(labelStyle).length && { labelStyle: labelStyle }),
    ...(item.sourceHandle && { sourceHandle: item.sourceHandle }),
    ...(item.targetHandle && { targetHandle: item.targetHandle }),
  };
};

export const getEdges = (items: ContractEdge[]): Edge[] => {
  const edgesList: Edge[] = [];
  items.forEach(value => {
    edgesList.push(getEdge(value));
  });
  return edgesList;
};
