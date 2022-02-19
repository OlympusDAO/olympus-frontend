import "./ChooseFuse.scss";

import { Trans } from "@lingui/macro";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Paper } from "@olympusdao/component-library";
import { useHistory } from "react-router";
import { useWeb3Context } from "src/hooks";

// import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useFusePools } from "../../fuse-sdk/hooks/useFusePool";
import { PoolDataCard, PoolTableData } from "./PoolTableData";

function FusePools() {
  const { networkId } = useWeb3Context();
  const history = useHistory();
  // usePathForNetwork({ pathName: "fuse", networkID: networkId, history });

  const { pools = [] } = useFusePools();

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const isFuseLoading = pools.length === 0;

  return (
    <div id="choose-fuse-view">
      {/* <Zoom in={true}> */}
      <>
        {pools.length == 0 && !isFuseLoading && (
          <Paper>
            <Box display="flex" justifyContent="center" marginY="24px">
              <Typography variant="h4">No active fuses</Typography>
            </Box>
          </Paper>
        )}
        {!isSmallScreen && pools.length > 0 && (
          <Paper>
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" width={"40%"}>
                        <Trans>Pool Assets</Trans>
                      </TableCell>
                      <TableCell align="center">
                        <Trans>Pool Number</Trans>
                      </TableCell>
                      <TableCell align="center">
                        <Trans>Total Supplied</Trans>
                      </TableCell>
                      <TableCell align="center">
                        <Trans>Total Borrowed</Trans>
                      </TableCell>
                      <TableCell align="center">Pool Risk Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pools.map(f => (
                      <PoolTableData networkId={networkId} key={f.name} pool={f} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Paper>
        )}
      </>
      {/* </Zoom> */}

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container spacing={2}>
            {pools.map(f => (
              <Grid item xs={12} key={f.id}>
                <PoolDataCard key={f.id} pool={f} networkId={networkId} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default FusePools;
