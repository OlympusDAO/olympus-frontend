import { Box, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { PrimaryButton } from "@olympusdao/component-library";
import React, { ReactNode } from "react";
import { AddressMap } from "src/constants/addresses";
import { useContractAllowance } from "src/hooks/useContractAllowance";

import { useApproveToken } from "./hooks/useApproveToken";

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
