import { Container, Grid } from "@material-ui/core";
import dagre from "dagre";
import { useState } from "react";
import ReactFlow, { Edge, Node, Position } from "react-flow-renderer";

import { initialEdges, initialNodes } from "./contractNodes";

const nodeDimensions = { width: 50, height: 20 };

// Based on: https://reactflow.dev/docs/examples/layouting/
const getElementsWithLayout = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

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

    console.log("position = ", nodeWithPosition);

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
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // TODO handle auto-positioning
  // useEffect(() => {
  //   const layout = getElementsWithLayout(nodes, edges);
  //   setNodes(layout.nodes);
  //   setEdges(layout.edges);
  // }, []);

  // TODO fix incompatibility with Paper from component-library (but not MUI) which results in the edge paths not being positioned correctly

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          {/* We wrap the ReactFlow component with a container that specifies the height,
           * as passing the height to the Paper component does not work (since it has child
           * components).
           */}
          <Container style={{ height: "40vh" }}>
            <ReactFlow
              defaultNodes={nodes}
              defaultEdges={edges}
              nodesDraggable={false}
              nodesConnectable={false}
              // style={{ width: "30px", height: "20px" }}
            />
          </Container>
        </Grid>
      </Grid>
    </>
  );
};
