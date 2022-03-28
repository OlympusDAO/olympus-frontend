import { Box, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { PrimaryButton } from "@olympusdao/component-library";
import React, { ReactNode } from "react";
import { AddressMap } from "src/constants/addresses";
import { useContractAllowance } from "src/hooks/useContractAllowance";

import { useApproveToken } from "./hooks/useApproveToken";

const useStyles = makeStyles<Theme>(theme => ({
  inputRow: {
    justifyContent: "space-around",
    alignItems: "center",
    height: "auto",
    marginTop: "4px",
  },
  gridItem: {
    width: "100%",
    paddingRight: "5px",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
    },
    [theme.breakpoints.up("sm")]: {
      marginBottom: "0",
    },
  },
  button: {
    alignSelf: "center",
    width: "100%",
    minWidth: "163px",
    maxWidth: "542px",
    height: "43px",
  },
}));

export const TokenAllowanceGuard: React.FC<{
  message: ReactNode;
  tokenAddressMap: AddressMap;
  spenderAddressMap: AddressMap;
}> = props => {
  const classes = useStyles();
  const approveMutation = useApproveToken(props.tokenAddressMap, props.spenderAddressMap);
  const { data: allowance } = useContractAllowance(props.tokenAddressMap, props.spenderAddressMap);

  if (!allowance)
    return (
      <Grid container className={classes.inputRow}>
        <Skeleton width="150px" />
      </Grid>
    );

  if (allowance.eq(0))
    return (
      <Grid container className={classes.inputRow}>
        <Grid item xs={12} sm={8} className={classes.gridItem}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body1" className="stake-note" color="textSecondary">
              {props.message}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} className={classes.gridItem}>
          <Box sx={{ marginTop: { xs: 1, sm: 0 } }}>
            <PrimaryButton
              fullWidth
              className={classes.button}
              onClick={approveMutation.mutate}
              disabled={approveMutation.isLoading}
            >
              {approveMutation.isLoading ? "Approving..." : "Approve"}
            </PrimaryButton>
          </Box>
        </Grid>
      </Grid>
    );

  return <>{props.children}</>;
};
