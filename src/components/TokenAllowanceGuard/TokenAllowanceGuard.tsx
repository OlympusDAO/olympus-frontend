import { t } from "@lingui/macro";
import { Box, Grid, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PrimaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import React, { ReactNode } from "react";
import { useApproveToken } from "src/components/TokenAllowanceGuard/hooks/useApproveToken";
import { AddressMap } from "src/constants/addresses";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { NetworkId } from "src/networkDetails";
import { useNetwork } from "wagmi";

const PREFIX = "TokenAllowanceGuard";

const classes = {
  inputRow: `${PREFIX}-inputRow`,
  gridItem: `${PREFIX}-gridItem`,
  input: `${PREFIX}-input`,
  button: `${PREFIX}-button`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledAllowanceGuard = styled("div")(({ theme }) => ({
  [`& .${classes.inputRow}`]: {
    justifyContent: "space-around",
    alignItems: "center",
    height: "auto",
    marginTop: "4px",
  },

  [`& .${classes.gridItem}`]: {
    width: "100%",
    paddingRight: "5px",
    alignItems: "center",
    justifyContent: "center",
  },

  [`& .${classes.input}`]: {
    [theme.breakpoints.down("md")]: {
      marginBottom: "10px",
    },
    [theme.breakpoints.up("sm")]: {
      marginBottom: "0",
    },
  },

  [`& .${classes.button}`]: {
    alignSelf: "center",
    width: "100%",
    minWidth: "163px",
    maxWidth: "542px",
    height: "43px",
  },
}));

export const TokenAllowanceGuard: React.FC<{
  message?: ReactNode;
  isVertical?: boolean;
  tokenAddressMap: AddressMap;
  spenderAddressMap: AddressMap;
  approvalText?: string;
  approvalPendingText?: string;
}> = ({
  message,
  isVertical = false,
  tokenAddressMap,
  spenderAddressMap,
  approvalText = "Approve",
  approvalPendingText = "Approving...",
  children,
}) => {
  const { chain = { id: 1 } } = useNetwork();
  const approveMutation = useApproveToken(tokenAddressMap, spenderAddressMap);
  const { data: allowance } = useContractAllowance(tokenAddressMap, spenderAddressMap);

  if (!allowance && tokenAddressMap[chain.id as NetworkId] !== ethers.constants.AddressZero)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={isVertical ? "84px" : "40px"}>
        <Skeleton width="150px" />
      </Box>
    );

  if (allowance && allowance.eq(0) && tokenAddressMap !== ethers.constants.AddressZero)
    return (
      <Grid container alignItems="center">
        {message && (
          <Grid item xs={12} sm={isVertical ? 12 : 8}>
            <Box display="flex" textAlign="center" alignItems="center" justifyContent="center">
              <Typography variant="body1" color="textSecondary">
                <em>{message}</em>
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12} sm={isVertical ? 12 : 4}>
          <Box display="flex" alignItems="center" justifyContent="center" mt={[2, isVertical && message ? 2 : 0]}>
            <PrimaryButton
              loading={approveMutation.isLoading}
              fullWidth
              className=""
              onClick={approveMutation.mutate}
              disabled={approveMutation.isLoading}
            >
              {approveMutation.isLoading ? t`${approvalPendingText}` : t`${approvalText}`}
            </PrimaryButton>
          </Box>
        </Grid>
      </Grid>
    );

  return <StyledAllowanceGuard>{children}</StyledAllowanceGuard>;
};
