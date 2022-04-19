import { Edge, Node } from "react-flow-renderer";

// We give a dummy position as auto-layout will be applied
const position = { x: 0, y: 0 };

export const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "0x1" },
    position: { x: 10, y: 10 },
  },
  {
    id: "2",
    data: { label: "0x2" },
    position: { x: 100, y: 100 },
  },
];

export const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];
