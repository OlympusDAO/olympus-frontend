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
  isVertical?: boolean;
  tokenAddressMap: AddressMap;
  spenderAddressMap: AddressMap;
}> = ({ message, isVertical = false, tokenAddressMap, spenderAddressMap, children }) => {
  const approveMutation = useApproveToken(tokenAddressMap, spenderAddressMap);
  const { data: allowance } = useContractAllowance(tokenAddressMap, spenderAddressMap);

  if (!allowance)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={isVertical ? "84px" : "40px"}>
        <Skeleton width="150px" />
      </Box>
    );

  if (allowance.eq(0))
    return (
      <Grid container>
        <Grid item xs={12} sm={isVertical ? 12 : 8}>
          <Box display="flex" textAlign="center" alignItems="center" justifyContent="center">
            <Typography variant="body1" color="textSecondary">
              <em>{message}</em>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={isVertical ? 12 : 4}>
          <Box display="flex" alignItems="center" justifyContent="center" mt={[2, isVertical ? 2 : 0]}>
            <PrimaryButton fullWidth className="" onClick={approveMutation.mutate} disabled={approveMutation.isLoading}>
              {approveMutation.isLoading ? "Approving..." : "Approve"}
            </PrimaryButton>
          </Box>
        </Grid>
      </Grid>
    );

  return <>{children}</>;
};

export const GiveTokenAllowanceGuard: React.FC<{
  message: ReactNode;
  tokenAddressMap: AddressMap;
  spenderAddressMap: AddressMap;
}> = props => {
  const classes = useStyles();
  const approveMutation = useApproveToken(props.tokenAddressMap, props.spenderAddressMap);
  const _useContractAllowance = useContractAllowance(props.tokenAddressMap, props.spenderAddressMap);

  if (_useContractAllowance.isLoading)
    return (
      <Grid container className={classes.inputRow}>
        <Skeleton width="100%" />
      </Grid>
    );

  if (!_useContractAllowance.data || _useContractAllowance.data.eq(0))
    return (
      <Grid container className={classes.inputRow} direction="column" spacing={5}>
        <Grid item xs={12} sm={8} className={classes.gridItem}>
          <Typography variant="h6" align="center" className="stake-note" color="textSecondary">
            {props.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} className={classes.gridItem}>
          <PrimaryButton
            fullWidth
            className={classes.button}
            onClick={approveMutation.mutate}
            disabled={approveMutation.isLoading}
          >
            {approveMutation.isLoading ? "Approving..." : "Approve"}
          </PrimaryButton>
        </Grid>
      </Grid>
    );

  return <>{props.children}</>;
};
