import { Edge, Node } from "react-flow-renderer";

export const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "0x1" },
    position: { x: 0, y: 0 },
    type: "input",
  },
  {
    id: "2",
    data: { label: "0x2" },
    position: { x: 0, y: 100 },
    type: "default",
  },
  {
    id: "3",
    data: { label: "0x3" },
    position: { x: 50, y: 200 },
    type: "output",
  },
];

export const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];
