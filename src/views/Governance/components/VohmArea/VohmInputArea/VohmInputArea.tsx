import { Box, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import { OHMSwapCardProps, PrimaryButton, SwapCard, SwapCollection } from "@olympusdao/component-library";
import React, { useEffect, useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import {
  GOVERNANCE_GOHM_ADDRESSES,
  GOVERNANCE_VOHM_VAULT_ADDRESSES,
  VOTE_TOKEN_ADDRESSES,
} from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance, useVoteBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useUnwrapFromVohm, useWrapToVohm } from "src/hooks/useVoting";
import { ModalHandleSelectProps } from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import { useNetwork } from "wagmi";

enum EvOHM {
  Wrap = "WRAP",
  Unwrap = "UNWRAP",
}
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

export const VohmInputArea: React.FC<{ isZoomed: boolean }> = props => {
  const networks = useTestableNetworks();
  const [stakedAssetType, setStakedAssetType] = useState<ModalHandleSelectProps>({ name: "vOHM" });
  const [swapAssetType, setSwapAssetType] = useState<ModalHandleSelectProps>({ name: "gOHM" });
  const { chain = { id: 1 } } = useNetwork();

  const [currentAction, setCurrentAction] = useState<EvOHM>(EvOHM.Wrap);

  const fromToken = currentAction === EvOHM.Wrap ? swapAssetType.name : stakedAssetType.name;

  // Max balance stuff
  const [amount, setAmount] = useState("");
  const addresses = fromToken === "gOHM" ? GOVERNANCE_GOHM_ADDRESSES : VOTE_TOKEN_ADDRESSES;

  const balance = useBalance(addresses)[networks.MAINNET].data;
  const gOhmBalance = useBalance(GOVERNANCE_GOHM_ADDRESSES)[networks.MAINNET].data;
  const vOhmBalance = useVoteBalance()[networks.MAINNET].data;

  const contractRouting = swapAssetType.name === "gOHM" ? "Wrap" : "Unwrap";

  // Staking/unstaking mutation stuff
  // TODO
  const wrapMutation = useWrapToVohm();
  const unwrapMutation = useUnwrapFromVohm();
  const isMutating = (currentAction === EvOHM.Wrap ? wrapMutation : unwrapMutation).isLoading;

  const amountExceedsBalance = balance && new DecimalBigNumber(amount, 18).gt(balance) ? true : false;

  useEffect(() => {
    setAmount("0");
    //If we're unstaking we reset swap asset back to OHM. this is all you can receive when unstaking.
    if (currentAction === EvOHM.Unwrap) {
      setSwapAssetType({ name: "gOHM" });
    }
    if (currentAction === EvOHM.Wrap) {
      setStakedAssetType({ name: "vOHM" });
    }
  }, [currentAction]);

  const GohmSwapCard = () => {
    const balance =
      swapAssetType.name === "gOHM"
        ? gOhmBalance
          ? gOhmBalance.toString({ decimals: 2 })
          : "0.00"
        : swapAssetType.name === "vOHM"
        ? vOhmBalance
          ? vOhmBalance.toString({ decimals: 2 })
          : "0.00"
        : swapAssetType.balance;

    return (
      <SwapCard
        id="gohm-input"
        token={swapAssetType.name as OHMSwapCardProps["token"]}
        tokenName={swapAssetType.name}
        inputProps={{ "data-testid": "gohm-input", min: "0" }}
        value={amount}
        onChange={event => +event.target.value >= 0 && setAmount(event.target.value)}
        info={`Balance: ${balance} ${swapAssetType.name}`}
        endString={currentAction === EvOHM.Wrap ? "Max" : ""}
        endStringOnClick={() => balance && setAmount(balance)}
        disabled={isMutating}
        inputWidth={`${amount.length > 0 ? amount.length : 1}ch`}
      />
    );
  };

  const VohmSwapCard = () => {
    const balance = stakedAssetType.name === "gOHM" ? gOhmBalance : vOhmBalance;

    return (
      <SwapCard
        id="vohm-input"
        inputProps={{ "data-testid": "staked-input", min: "0" }}
        token={"gOHM" as OHMSwapCardProps["token"]} // forcing gOHM icon since vOHM doesn't have an icon
        tokenName={stakedAssetType.name}
        value={amount}
        onChange={event => +event.target.value >= 0 && setAmount(event.target.value)}
        info={`Balance: ${balance ? balance.toString({ decimals: 2 }) : "0.00"} ${stakedAssetType.name}`}
        endString={currentAction === EvOHM.Unwrap ? "Max" : ""}
        endStringOnClick={() => balance && setAmount(balance.toString())}
        inputWidth={`${amount.length > 0 ? amount.length : 1}ch`}
        disabled={isMutating}
      />
    );
  };

  return (
    <StyledBox mb={3}>
      <Tabs
        centered
        textColor="primary"
        aria-label="stake tabs"
        indicatorColor="primary"
        key={String(props.isZoomed)}
        className="stake-tab-buttons"
        value={currentAction === EvOHM.Wrap ? 0 : 1}
        //hides the tab underline sliding animation in while <Zoom> is loading
        TabIndicatorProps={!props.isZoomed ? { style: { display: "none" } } : undefined}
        onChange={(_, view: number) => setCurrentAction(view === 0 ? EvOHM.Wrap : EvOHM.Unwrap)}
      >
        <Tab aria-label="stake-button" label={`get vOHM`} />

        <Tab aria-label="unstake-button" label={`get gOHM`} />
      </Tabs>

      <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
        <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
          <Box mb="21px">
            <SwapCollection
              UpperSwapCard={currentAction === EvOHM.Wrap ? GohmSwapCard() : VohmSwapCard()}
              LowerSwapCard={currentAction === EvOHM.Wrap ? VohmSwapCard() : GohmSwapCard()}
              arrowOnClick={() => setCurrentAction(currentAction === EvOHM.Wrap ? EvOHM.Unwrap : EvOHM.Wrap)}
            />
          </Box>
          <Box>
            <WalletConnectedGuard>
              <TokenAllowanceGuard
                tokenAddressMap={contractRouting === "Wrap" ? addresses : { [chain.id]: swapAssetType.address }}
                spenderAddressMap={GOVERNANCE_VOHM_VAULT_ADDRESSES}
                approvalText={currentAction === EvOHM.Wrap ? "Approve Wrapping" : "Approve Unwrapping"}
                approvalPendingText={"Confirming Approval in your wallet"}
                isVertical
              >
                {contractRouting === "Wrap" && (
                  <PrimaryButton
                    data-testid="submit-button-vohm"
                    loading={isMutating}
                    fullWidth
                    disabled={isMutating || !amount || amountExceedsBalance || parseFloat(amount) === 0}
                    onClick={() =>
                      currentAction === EvOHM.Wrap ? wrapMutation.mutate(amount) : unwrapMutation.mutate(amount)
                    }
                  >
                    {amountExceedsBalance
                      ? "Amount exceeds balance"
                      : !amount || parseFloat(amount) === 0
                      ? "Enter an amount"
                      : currentAction === EvOHM.Wrap
                      ? isMutating
                        ? "Confirming Wrapping in your wallet"
                        : "Wrap to vOHM"
                      : isMutating
                      ? "Confirming Unwrapping in your wallet "
                      : "Unwrap to gOHM"}
                  </PrimaryButton>
                )}
              </TokenAllowanceGuard>
            </WalletConnectedGuard>
          </Box>
        </Box>
      </Box>
    </StyledBox>
  );
};
