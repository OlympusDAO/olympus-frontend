import { Container, Grid } from "@material-ui/core";
import ELK, { ElkExtendedEdge, ElkNode } from "elkjs";
import { useEffect, useState } from "react";
import ReactFlow, { Edge, Node, Position } from "react-flow-renderer";

import { initialEdges, initialNodes } from "./contractNodes";

// Based on: https://reactflow.dev/docs/examples/layouting/
const getElementsWithLayout = async (nodes: Node[], edges: Edge[]) => {
  const graph: ElkNode = {
    id: "root",
    layoutOptions: { "elk.algorithm": "layered" },
    children: [],
    edges: [],
  };

  nodes.forEach(node => {
    graph.children?.push({
      id: node.id,
      width: 50,
      height: 20,
    });
  });

  edges.forEach(edge => {
    const newEdge: ElkExtendedEdge = {
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
      sections: [],
    };
    graph.edges?.push(newEdge);
  });

  const elkNodes = await new ELK().layout(graph);

  // Extract children into a map by id
  const children: { [id: string]: ElkNode } = {};
  elkNodes.children?.forEach(value => {
    children[value.id] = value;
  });

  nodes.forEach(node => {
    const nodeWithPosition = children[node.id];
    node.targetPosition = Position.Bottom;
    node.sourcePosition = Position.Top;
    node.position = { x: nodeWithPosition.x || 0, y: nodeWithPosition.y || 0 };
    node.width = nodeWithPosition.width;
    node.height = nodeWithPosition.height;

    console.log("new node ", node);

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    // node.position = {
    //   x: nodeWithPosition.x - nodeDimensions.width / 2,
    //   y: nodeWithPosition.y - nodeDimensions.height / 2,
    // };
  });

  return { nodes, edges };
};

export const ContractsDiagram = (): JSX.Element => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // TODO handle auto-positioning
  useEffect(() => {
    console.log("updating");
    getElementsWithLayout(nodes, edges).then(value => {
      setNodes(value.nodes);
      setEdges(value.edges);
      console.log("updated");
    });
  }, []);

  // TODO fix incompatibility with Paper from component-library (but not MUI) which results in the edge paths not being positioned correctly

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          {/* We wrap the ReactFlow component with a container that specifies the height,
           * as passing the height to the Paper component does not work (since it has child
           * components).
           */}
          <Container style={{ height: "80vh", width: "80vw" }}>
            <ReactFlow nodes={nodes} edges={edges} nodesDraggable={false} nodesConnectable={false} />
          </Container>
        </Grid>
      </Grid>
    </>
  );
};
