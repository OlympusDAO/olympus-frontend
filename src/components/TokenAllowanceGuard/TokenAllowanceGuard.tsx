import { Box, Grid, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PrimaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import React, { ReactNode } from "react";
import { useApproveToken } from "src/components/TokenAllowanceGuard/hooks/useApproveToken";
import { AddressMap } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
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
  spendAmount?: DecimalBigNumber;
  children: any;
}> = ({
  message,
  isVertical = false,
  tokenAddressMap,
  spenderAddressMap,
  approvalText = "Approve",
  approvalPendingText = "Approving...",
  spendAmount,
  children,
}) => {
  const { chain = { id: 1 } } = useNetwork();
  const { data: balance = new DecimalBigNumber("0") } = useBalance(tokenAddressMap)[
    chain.id as keyof typeof tokenAddressMap
  ] || { data: new DecimalBigNumber("0") };
  const approveMutation = useApproveToken(tokenAddressMap);
  const { data: allowance } = useContractAllowance(tokenAddressMap, spenderAddressMap);

  if (!allowance && tokenAddressMap[chain.id as NetworkId] !== ethers.constants.AddressZero)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={isVertical ? "84px" : "40px"}>
        <Skeleton width="150px" />
      </Box>
    );

  if (
    (allowance && allowance.eq(0) && tokenAddressMap[chain.id as NetworkId] !== ethers.constants.AddressZero) ||
    (allowance && allowance.lt(spendAmount?.toBigNumber() || balance.toBigNumber()))
  )
    return (
      <Grid container alignItems="center">
        {allowance && spendAmount && allowance.lt(spendAmount.toBigNumber()) ? (
          <Grid item xs={12} sm={isVertical ? 12 : 8}>
            <Box display="flex" textAlign="center" alignItems="center" justifyContent="center">
              <Typography variant="body1" color="textSecondary">
                <em>{`Your current allowance is less than your requested spend amount. Approve at least your spend amount.`}</em>
              </Typography>
            </Box>
          </Grid>
        ) : message ? (
          <Grid item xs={12} sm={isVertical ? 12 : 8}>
            <Box display="flex" textAlign="center" alignItems="center" justifyContent="center">
              <Typography variant="body1" color="textSecondary">
                <em>{message}</em>
              </Typography>
            </Box>
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12} sm={isVertical ? 12 : 4}>
          <Box display="flex" alignItems="center" justifyContent="center" mt={[2, isVertical && message ? 2 : 0]}>
            <PrimaryButton
              loading={approveMutation.isLoading}
              fullWidth
              className=""
              onClick={() => approveMutation.mutate({ spenderAddressMap })}
              disabled={approveMutation.isLoading}
            >
              {approveMutation.isLoading ? `${approvalPendingText}` : `${approvalText}`}
            </PrimaryButton>
          </Box>
        </Grid>
      </Grid>
    );

  return <StyledAllowanceGuard>{children}</StyledAllowanceGuard>;
};
