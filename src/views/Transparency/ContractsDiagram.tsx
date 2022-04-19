import { Grid } from "@material-ui/core";
import { Paper } from "@olympusdao/component-library";
import dagre from "dagre";
import { useState } from "react";
import ReactFlow, { Background, Edge, Node, Position } from "react-flow-renderer";

import { initialEdges, initialNodes } from "./contractNodes";

const nodeDimensions = { width: 200, height: 30 };

// Based on: https://reactflow.dev/docs/examples/layouting/
const getElementsWithLayout = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR" });

  console.log("nodes " + JSON.stringify(nodes));
  console.log("edges " + JSON.stringify(nodes));

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, nodeDimensions);
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeDimensions.width / 2,
      y: nodeWithPosition.y - nodeDimensions.height / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const ContractsDiagram = (): JSX.Element => {
  const connectionLineStyle = { stroke: "white" };
  const edgeOptions = {
    animated: false,
    style: {
      stroke: "white",
    },
  };
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const elementLayout = getElementsWithLayout(nodes, edges);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Paper fullWidth style={{ height: "500px" }}>
            <ReactFlow
              defaultNodes={nodes}
              defaultEdges={edges}
              defaultEdgeOptions={edgeOptions}
              fitView
              // connectionLineStyle={connectionLineStyle}
              nodesDraggable={false}
              nodesConnectable={false}
            >
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
