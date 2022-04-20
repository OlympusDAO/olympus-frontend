import { Container, Grid, useTheme } from "@material-ui/core";
import { useState } from "react";
import ReactFlow from "react-flow-renderer";

import { initialEdges, initialNodes } from "./contractNodes";

export const ContractsDiagram = (): JSX.Element => {
  const theme = useTheme();
  const [nodes] = useState(initialNodes(theme));
  const [edges] = useState(initialEdges);

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
            <ReactFlow fitView nodes={nodes} edges={edges} nodesDraggable={false} nodesConnectable={false} />
          </Container>
        </Grid>
      </Grid>
    </>
  );
};
