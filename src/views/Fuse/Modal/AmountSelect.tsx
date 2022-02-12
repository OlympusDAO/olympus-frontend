import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  SvgIcon,
  Switch,
  Typography,
  useMediaQuery,
  withStyles,
} from "@material-ui/core";
import Big from "big.js";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { createComptroller } from "src/fuse-sdk/helpers/createComptroller";
import { useWeb3Context } from "src/hooks";

import { ReactComponent as ArrowUp } from "../../../assets/icons/arrow-up.svg";
import { USDPricedFuseAsset } from "../../../fuse-sdk/helpers/fetchFusePoolData";
import { fetchMaxAmount, Mode } from "../../../fuse-sdk/helpers/fetchMaxAmount";
import { useRari } from "../../../fuse-sdk/helpers/RariContext";
import { ETH_TOKEN_DATA, useTokenData } from "../../../fuse-sdk/hooks/useTokenData";
import { error } from "../../../slices/MessagesSlice";
import { DialogTitle } from "./DialogTitle";
import { StatsColumn } from "./StatsColumn";
import { TabBar } from "./TabBar";
import { TokenNameAndMaxButton } from "./TokenNameAndMaxButton";

enum UserAction {
  NO_ACTION,
  WAITING_FOR_TRANSACTIONS,
}

export enum CTokenErrorCodes {
  NO_ERROR,
  UNAUTHORIZED,
  BAD_INPUT,
  COMPTROLLER_REJECTION,
  COMPTROLLER_CALCULATION_ERROR,
  INTEREST_RATE_MODEL_ERROR,
  INVALID_ACCOUNT_PAIR,
  INVALID_CLOSE_AMOUNT_REQUESTED,
  INVALID_COLLATERAL_FACTOR,
  MATH_ERROR,
  MARKET_NOT_FRESH,
  MARKET_NOT_LISTED,
  TOKEN_INSUFFICIENT_ALLOWANCE,
  TOKEN_INSUFFICIENT_BALANCE,
  TOKEN_INSUFFICIENT_CASH,
  TOKEN_TRANSFER_IN_FAILED,
  TOKEN_TRANSFER_OUT_FAILED,
  UTILIZATION_ABOVE_MAX,
}

export function AmountSelect({
  onClose,
  asset,
  mode,
  setMode,
  borrowLimit,
  comptrollerAddress,
}: {
  onClose: () => void;
  asset: USDPricedFuseAsset;
  mode: Mode;
  setMode: (mode: Mode) => void;
  borrowLimit: number;
  comptrollerAddress: string;
}) {
  const { fuse } = useRari();
  const dispatch = useDispatch();
  const { scannerUrl, address } = useWeb3Context();

  const queryClient = useQueryClient();

  const tokenData = useTokenData(asset.underlyingToken);

  const [userAction, setUserAction] = useState(UserAction.NO_ACTION);

  const [userEnteredAmount, _setUserEnteredAmount] = useState("");

  const [amount, _setAmount] = useState<Big>(Big(0));

  const onToggleCollateral = async () => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    try {
      if (asset.membership) {
        await comptroller.exitMarket(asset.cToken);
      } else {
        await comptroller.enterMarkets([asset.cToken]);
      }
    } catch (e) {
      if (asset.membership) {
        dispatch(
          error(
            "You cannot disable this asset as collateral as you would not have enough collateral posted to keep your borrow. Try adding more collateral of another type or paying back some of your debt.",
          ),
        );
      } else {
        dispatch(error("You cannot enable this asset as collateral at this time."));
      }

      return;
    }

    queryClient.refetchQueries();
  };

  const updateAmount = (newAmount: string) => {
    if (newAmount.startsWith("-")) {
      return;
    }

    _setUserEnteredAmount(newAmount);

    try {
      // Try to set the amount to BigNumber(newAmount):
      const bigAmount = Big(newAmount);
      _setAmount(bigAmount.times(10 ** asset.underlyingDecimals));
    } catch (e) {
      // If the number was invalid, set the amount to null to disable confirming:
      _setAmount(Big(0));
    }

    setUserAction(UserAction.NO_ACTION);
  };

  const { data: amountIsValid } = useQuery((amount?.toString() ?? "null") + " " + mode + " isValid", async () => {
    if (amount.eq(0)) {
      return false;
    }

    try {
      const max = await fetchMaxAmount(mode, fuse, address, asset);

      return amount.lte(max!.toString());
    } catch (e) {
      dispatch(error((e as Error).message));
      return false;
    }
  });

  let depositOrWithdrawAlert = null;

  if (amount.eq(0)) {
    if (mode === Mode.SUPPLY) {
      depositOrWithdrawAlert = "Enter a valid amount to supply.";
    } else if (mode === Mode.BORROW) {
      depositOrWithdrawAlert = "Enter a valid amount to borrow.";
    } else if (mode === Mode.WITHDRAW) {
      depositOrWithdrawAlert = "Enter a valid amount to withdraw.";
    } else {
      depositOrWithdrawAlert = "Enter a valid amount to repay.";
    }
  } else if (amountIsValid === undefined) {
    depositOrWithdrawAlert = `Loading your balance of ${asset.underlyingSymbol}...`;
  } else if (!amountIsValid) {
    if (mode === Mode.SUPPLY) {
      depositOrWithdrawAlert = `You don't have enough ${asset.underlyingSymbol}!`;
    } else if (mode === Mode.REPAY) {
      depositOrWithdrawAlert = `You don't have enough ${asset.underlyingSymbol} or are over-repaying!`;
    } else if (mode === Mode.WITHDRAW) {
      depositOrWithdrawAlert = "You cannot withdraw this much!";
    } else if (mode === Mode.BORROW) {
      depositOrWithdrawAlert = "You cannot borrow this much!";
    }
  } else {
    depositOrWithdrawAlert = null;
  }

  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const onConfirm = async () => {
    try {
      setUserAction(UserAction.WAITING_FOR_TRANSACTIONS);

      const isETH = asset.underlyingToken === ETH_TOKEN_DATA.address;
      const isRepayingMax = amount.gte(asset.borrowBalance) && !isETH && mode === Mode.REPAY;

      const max = BigNumber.from(2).pow(256).sub(1);

      const amountBN = amount.toString();

      const cToken = new ethers.Contract(
        asset.cToken,
        isETH
          ? JSON.parse(fuse.compoundContracts["contracts/CEtherDelegate.sol:CEtherDelegate"].abi)
          : JSON.parse(fuse.compoundContracts["contracts/CErc20Delegate.sol:CErc20Delegate"].abi),
        fuse.provider,
      );

      if (mode === Mode.SUPPLY || mode === Mode.REPAY) {
        if (!isETH) {
          const token = new ethers.Contract(
            asset.underlyingToken,
            JSON.parse(fuse.compoundContracts["contracts/EIP20Interface.sol:EIP20Interface"].abi),
            fuse.provider,
          );

          const hasApprovedEnough = (await token.allowance(address, cToken.options.address)).gte(amountBN);

          if (!hasApprovedEnough) {
            await token.approve(cToken.options.address, max);
          }
        }

        if (mode === Mode.SUPPLY) {
          // If they want to enable as collateral now, enter the market:
          if (asset.membership) {
            const comptroller = createComptroller(comptrollerAddress, fuse);
            // Don't await this, we don't care if it gets executed first!
            comptroller.enterMarkets([asset.cToken]);
          }

          if (isETH) {
            await cToken.mint({ value: amountBN });
          } else {
            await cToken.mint(amountBN);
          }
        } else if (mode === Mode.REPAY) {
          if (isETH) {
            await cToken.repayBorrow({ value: amountBN });
          } else {
            await cToken.repayBorrow(isRepayingMax ? max : amountBN);
          }
        }
      } else if (mode === Mode.BORROW) {
        await cToken.borrow(amountBN);
      } else if (mode === Mode.WITHDRAW) {
        await cToken.redeemUnderlying(amountBN);
      }

      queryClient.refetchQueries();

      // Wait 2 seconds for refetch and then close modal.
      // We do this instead of waiting the refetch because some refetches take a while or error out and we want to close now.
      await new Promise(resolve => setTimeout(resolve, 2000));

      onClose();
    } catch (e) {
      dispatch(error((e as Error).message));
      setUserAction(UserAction.NO_ACTION);
    }
  };

  return userAction === UserAction.WAITING_FOR_TRANSACTIONS ? (
    <>
      <DialogTitle onClose={onClose}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <CircularProgress size={40} />
          </Grid>
          <Grid item>
            <Typography variant="h5">{"Check your wallet to submit the transactions"}</Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h5">{"Do not close this tab until you submit all transactions!"}</Typography>
      </DialogContent>
    </>
  ) : (
    <>
      <DialogTitle onClose={onClose}>
        <Grid container alignItems="center" spacing={1} justifyContent="center">
          <Grid item>
            <Avatar
              className={"avatar-medium"}
              component="span"
              src={
                tokenData?.logoURL ??
                "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
              }
            />
          </Grid>
          <Grid item>
            <Typography variant="h5" component="span">
              {!isSmallScreen && asset.underlyingName.length < 25 ? asset.underlyingName : asset.underlyingSymbol}
            </Typography>
            <Link href={`${scannerUrl}/token/${asset.underlyingToken}`} target="_blank">
              <Typography variant="body2">
                View contract <SvgIcon className={"view-contract-icon"} component={ArrowUp} />
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent className="pool-modal-content">
        <Grid container spacing={3} direction="column" justifyContent="space-around">
          <Grid item>
            <TabBar mode={mode} setMode={setMode} />
          </Grid>
          <Grid item>
            <FormControl variant="outlined" color="primary" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                type="number"
                fullWidth
                value={userEnteredAmount}
                onChange={e => updateAmount(e.target.value)}
                labelWidth={55}
                endAdornment={
                  <InputAdornment position="end">
                    <TokenNameAndMaxButton mode={mode} asset={asset} updateAmount={updateAmount} />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>

          <StatsColumn
            symbol={tokenData?.symbol ?? asset.underlyingSymbol}
            amount={amount ? Number(amount.toNumber().toFixed(0)) : 0}
            asset={asset}
            mode={mode}
            enableAsCollateral={mode === Mode.SUPPLY}
            borrowLimit={borrowLimit}
          />

          {mode === Mode.SUPPLY ? (
            <Grid item>
              <Box display="flex" alignItems="baseline" justifyContent="space-between">
                <Typography>Enable As Collateral</Typography>
                <OrangeSwitch checked={asset.membership} onChange={onToggleCollateral} />
              </Box>
            </Grid>
          ) : null}
        </Grid>
      </DialogContent>
      <DialogActions disableSpacing>
        <Button
          variant="contained"
          color="primary"
          className={`connect-button ${!amountIsValid ? "claim-disable" : ""}`}
          onClick={onConfirm}
          disabled={!amountIsValid}
        >
          {depositOrWithdrawAlert || "Confirm"}
        </Button>
      </DialogActions>
    </>
  );
}

const OrangeSwitch = withStyles({
  switchBase: {
    color: "#ff9900",
    "&$checked": {
      color: "#ff9900",
    },
    "&$checked + $track": {
      backgroundColor: "#ff9900",
    },
  },
  checked: {},
  track: {},
})(Switch);
