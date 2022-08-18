import { t } from "@lingui/macro";
import { Box, Grid, Link, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  InfoNotification,
  OHMSwapCardProps,
  PrimaryButton,
  SwapCard,
  SwapCollection,
} from "@olympusdao/component-library";
import React, { useEffect, useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { GOHM_ADDRESSES, OHM_ADDRESSES, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";
import TokenModal from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import { useStakeToken } from "src/views/Stake/components/StakeArea/components/StakeInputArea/hooks/useStakeToken";
import { useUnstakeToken } from "src/views/Stake/components/StakeArea/components/StakeInputArea/hooks/useUnstakeToken";

const PREFIX = "StakeInputArea";

const classes = {
  inputRow: `${PREFIX}-inputRow`,
  gridItem: `${PREFIX}-gridItem`,
  input: `${PREFIX}-input`,
  button: `${PREFIX}-button`,
};

const StyledBox = styled(Box)(({ theme }) => ({
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
    width: "100%",
    minWidth: "163px",
    maxWidth: "542px",
  },
}));

export const StakeInputArea: React.FC<{ isZoomed: boolean }> = props => {
  const networks = useTestableNetworks();
  const [stakedAssetType, setStakedAssetType] = useState<"sOHM" | "gOHM">("sOHM");
  const [currentAction, setCurrentAction] = useState<"STAKE" | "UNSTAKE">("STAKE");
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  const fromToken = currentAction === "STAKE" ? "OHM" : stakedAssetType;

  // Max balance stuff
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const addresses = fromToken === "OHM" ? OHM_ADDRESSES : fromToken === "sOHM" ? SOHM_ADDRESSES : GOHM_ADDRESSES;
  const balance = useBalance(addresses)[networks.MAINNET].data;
  const ohmBalance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;
  const sOhmBalance = useBalance(SOHM_ADDRESSES)[networks.MAINNET].data;
  const gOhmBalance = useBalance(GOHM_ADDRESSES)[networks.MAINNET].data;
  const { data: currentIndex } = useCurrentIndex();

  // Staking/unstaking mutation stuff
  const stakeMutation = useStakeToken(stakedAssetType);
  const unstakeMutation = useUnstakeToken(stakedAssetType);
  const isMutating = (currentAction === "STAKE" ? stakeMutation : unstakeMutation).isLoading;

  const bonds = useLiveBonds({ isInverseBond: true }).data;
  const amountExceedsBalance = balance && new DecimalBigNumber(amount).gt(balance) ? true : false;

  const liveInverseBonds = bonds && bonds.length > 0;

  const ohmOnChange = (value: string, spendAsset: boolean) => {
    if (!currentIndex) return null;
    spendAsset ? setAmount(value) : setReceiveAmount(value);
    let oppositeAmount: string;
    if ((currentAction === "STAKE" && spendAsset) || (currentAction === "UNSTAKE" && !spendAsset)) {
      oppositeAmount =
        stakedAssetType === "gOHM" ? new DecimalBigNumber(value, 9).div(currentIndex, 18).toString() : value;
    } else {
      oppositeAmount =
        stakedAssetType === "gOHM" ? new DecimalBigNumber(value, 18).mul(currentIndex).toString() : value;
    }
    spendAsset ? setReceiveAmount(oppositeAmount) : setAmount(oppositeAmount);
  };

  useEffect(() => {
    ohmOnChange(amount, true);
  }, [stakedAssetType]);

  useEffect(() => {
    ohmOnChange(amount, currentAction === "UNSTAKE");
  }, [currentAction]);

  const OhmSwapCard = () => (
    <SwapCard
      id="ohm-input"
      token="OHM"
      inputProps={{ "data-testid": "ohmy-input" }}
      value={currentAction === "STAKE" ? amount : receiveAmount}
      onChange={event => ohmOnChange(event.target.value, currentAction === "STAKE")}
      info={`Balance: ${ohmBalance ? ohmBalance.toString({ decimals: 2 }) : "0.00"} OHM`}
      endString={currentAction === "STAKE" ? "Max" : ""}
      endStringOnClick={() => balance && ohmOnChange(balance.toString(), currentAction === "STAKE")}
      disabled={isMutating}
    />
  );

  const SohmGohmSwapCard = () => {
    const balance = stakedAssetType === "sOHM" ? sOhmBalance : gOhmBalance;
    return (
      <SwapCard
        id="staked-input"
        inputProps={{ "data-testid": "staked-input" }}
        token={stakedAssetType as OHMSwapCardProps["token"]}
        tokenOnClick={() => setTokenModalOpen(true)}
        value={currentAction === "STAKE" ? receiveAmount : amount}
        onChange={event => ohmOnChange(event.target.value, currentAction === "UNSTAKE")}
        info={`Balance: ${balance ? balance.toString({ decimals: 2 }) : "0.00"} ${stakedAssetType}`}
        endString={currentAction === "UNSTAKE" ? "Max" : ""}
        endStringOnClick={() => balance && ohmOnChange(balance.toString(), currentAction === "UNSTAKE")}
        disabled={isMutating}
      />
    );
  };
  console.log("amount", amount);
  return (
    <StyledBox mb={3}>
      <Tabs
        centered
        textColor="primary"
        aria-label="stake tabs"
        indicatorColor="primary"
        key={String(props.isZoomed)}
        className="stake-tab-buttons"
        value={currentAction === "STAKE" ? 0 : 1}
        //hides the tab underline sliding animation in while <Zoom> is loading
        TabIndicatorProps={!props.isZoomed ? { style: { display: "none" } } : undefined}
        onChange={(_, view: number) => setCurrentAction(view === 0 ? "STAKE" : "UNSTAKE")}
      >
        <Tab aria-label="stake-button" label={t({ message: "Stake", comment: "The action of staking (verb)" })} />

        <Tab aria-label="unstake-button" label={t`Unstake`} />
      </Tabs>
      <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
        <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
          <SwapCollection
            UpperSwapCard={currentAction === "STAKE" ? OhmSwapCard() : SohmGohmSwapCard()}
            LowerSwapCard={currentAction === "STAKE" ? SohmGohmSwapCard() : OhmSwapCard()}
            arrowOnClick={() => setCurrentAction(currentAction === "STAKE" ? "UNSTAKE" : "STAKE")}
          />
          <TokenModal
            open={tokenModalOpen}
            handleSelect={name => setStakedAssetType(name)}
            handleClose={() => setTokenModalOpen(false)}
            sOhmBalance={sOhmBalance && sOhmBalance.toString({ decimals: 2 })}
            gOhmBalance={gOhmBalance && gOhmBalance.toString({ decimals: 2 })}
          />
          {currentAction === "UNSTAKE" && liveInverseBonds && (
            <InfoNotification>
              {t`Unstaking your OHM? Trade for Treasury Stables with no slippage & zero trading fees via`}
              &nbsp;
              <Link href={`#/bonds`}>{t`Inverse Bonds`}</Link>
            </InfoNotification>
          )}
          <Box my={2}>
            <TokenAllowanceGuard
              tokenAddressMap={addresses}
              spenderAddressMap={STAKING_ADDRESSES}
              approvalText={currentAction === "STAKE" ? "Approve Staking" : "Approve Unstaking"}
              approvalPendingText={"Confirming Approval in your wallet"}
              isVertical
            >
              <Grid item xs={12} className={classes.gridItem}>
                <PrimaryButton
                  data-testid="submit-button"
                  loading={isMutating}
                  fullWidth
                  onClick={() => {
                    console.log(amount, "amount onclicky");
                    (currentAction === "STAKE" ? stakeMutation : unstakeMutation).mutate(amount);
                  }}
                >
                  {amountExceedsBalance
                    ? "Amount exceeds balance"
                    : !amount
                    ? "Enter an amount"
                    : currentAction === "STAKE"
                    ? isMutating
                      ? "Confirming Staking in your wallet"
                      : "Stake"
                    : isMutating
                    ? "Confirming Unstaking in your wallet "
                    : "Unstake"}
                  {}
                </PrimaryButton>
              </Grid>
            </TokenAllowanceGuard>
          </Box>
        </Box>
      </Box>
    </StyledBox>
  );
};
