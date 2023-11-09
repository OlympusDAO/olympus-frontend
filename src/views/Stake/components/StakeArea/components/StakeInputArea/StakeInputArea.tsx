import { Avatar, Box, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  InfoNotification,
  OHMSwapCardProps,
  PrimaryButton,
  SwapCard,
  SwapCollection,
} from "@olympusdao/component-library";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { GOHM_ADDRESSES, OHM_ADDRESSES, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";
import StakeConfirmationModal from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/StakeConfirmationModal";
import TokenModal, {
  ModalHandleSelectProps,
} from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import { useStakeToken } from "src/views/Stake/components/StakeArea/components/StakeInputArea/hooks/useStakeToken";
import { useUnstakeToken } from "src/views/Stake/components/StakeArea/components/StakeInputArea/hooks/useUnstakeToken";
import { useWrapSohm } from "src/views/Wrap/components/WrapInputArea/hooks/useWrapSohm";
import { useNetwork } from "wagmi";

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
  const [stakedAssetType, setStakedAssetType] = useState<ModalHandleSelectProps>({ name: "gOHM" });
  const [swapAssetType, setSwapAssetType] = useState<ModalHandleSelectProps>({ name: "OHM" });
  const { chain = { id: 1 } } = useNetwork();
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const wrapMutation = useWrapSohm();
  const [searchParams, setSearchParams] = useSearchParams();
  const isStake = searchParams.get("unstake") ? false : true;
  const fromToken = isStake ? swapAssetType.name : stakedAssetType.name;

  // Max balance stuff
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const addresses = fromToken === "OHM" ? OHM_ADDRESSES : fromToken === "sOHM" ? SOHM_ADDRESSES : GOHM_ADDRESSES;

  const balance = useBalance(addresses)[networks.MAINNET].data;
  const ohmBalance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;
  const sOhmBalance = useBalance(SOHM_ADDRESSES)[networks.MAINNET].data;
  const gOhmBalance = useBalance(GOHM_ADDRESSES)[networks.MAINNET].data;
  const { data: currentIndex } = useCurrentIndex();

  const contractRouting = ["OHM", "gOHM"].includes(swapAssetType.name) ? "Stake" : "Wrap";

  const contractAddress = STAKING_ADDRESSES;

  const humanReadableRouting = isStake
    ? contractRouting
    : !isStake && contractRouting === "Stake"
    ? "Unstake"
    : !isStake && contractRouting === "Wrap"
    ? "Unwrap"
    : contractRouting;

  // Staking/unstaking mutation stuff
  const stakeMutation = useStakeToken();
  const unstakeMutation = useUnstakeToken(stakedAssetType.name === "gOHM" ? "gOHM" : "sOHM");
  const isMutating = (isStake ? stakeMutation : unstakeMutation).isLoading;
  const isMutationSuccess = stakeMutation.isSuccess || unstakeMutation.isSuccess || wrapMutation.isSuccess;

  const bonds = useLiveBonds({ isInverseBond: true }).data;
  const amountExceedsBalance = balance && new DecimalBigNumber(amount).gt(balance) ? true : false;

  const liveInverseBonds = bonds && bonds.length > 0;

  const ohmOnChange = (value: string, spendAsset: boolean) => {
    if (!currentIndex) return null;
    spendAsset ? setAmount(value) : setReceiveAmount(value);
    let oppositeAmount: string;

    if ((isStake && spendAsset) || (!isStake && !spendAsset)) {
      oppositeAmount =
        stakedAssetType.name === "gOHM" ? new DecimalBigNumber(value, 9).div(currentIndex, 18).toString() : value;
    } else {
      oppositeAmount =
        stakedAssetType.name === "gOHM" ? new DecimalBigNumber(value, 18).mul(currentIndex).toString() : value;
    }
    spendAsset ? setReceiveAmount(oppositeAmount) : setAmount(oppositeAmount);
  };

  useEffect(() => {
    ohmOnChange(amount, true);
  }, [stakedAssetType, swapAssetType]);

  useEffect(() => {
    if (isMutationSuccess) setConfirmationModalOpen(false);
  }, [isMutationSuccess]);

  useEffect(() => {
    ohmOnChange(amount, !isStake);
    //If we're unstaking we reset swap asset back to OHM. this is all you can receive when unstaking.
    if (!isStake) {
      setSwapAssetType({ name: "OHM" });
    }
    if (isStake && stakedAssetType.name === "sOHM") {
      setStakedAssetType({ name: "gOHM" });
    }
  }, [isStake]);

  const OhmSwapCard = () => {
    const balance =
      swapAssetType.name === "sOHM"
        ? sOhmBalance
          ? sOhmBalance.toString({ decimals: 2 })
          : "0.00"
        : swapAssetType.name === "OHM"
        ? ohmBalance
          ? ohmBalance.toString({ decimals: 2 })
          : "0.00"
        : swapAssetType.balance;

    return (
      <SwapCard
        id="ohm-input"
        token={
          swapAssetType.icon ? (
            <Avatar src={swapAssetType.icon} sx={{ width: "21px", height: "21px" }} />
          ) : (
            (swapAssetType.name as OHMSwapCardProps["token"])
          )
        }
        tokenName={swapAssetType.name}
        tokenOnClick={isStake ? () => setTokenModalOpen(true) : undefined}
        inputProps={{ "data-testid": "ohm-input", min: "0" }}
        value={isStake ? amount : receiveAmount}
        onChange={event => +event.target.value >= 0 && ohmOnChange(event.target.value, isStake)}
        info={`Balance: ${balance} ${swapAssetType.name}`}
        endString={isStake ? "Max" : ""}
        endStringOnClick={() => balance && ohmOnChange(balance, isStake)}
        disabled={isMutating}
        inputWidth={`${
          (isStake ? amount : receiveAmount).length > 0 ? (isStake ? amount : receiveAmount).length : 1
        }ch`}
      />
    );
  };

  const GohmSwapCard = () => {
    const balance = stakedAssetType.name === "sOHM" ? sOhmBalance : gOhmBalance;
    const tokenOnClick = sOhmBalance && !isStake ? { tokenOnClick: () => setTokenModalOpen(true) } : {};

    return (
      <SwapCard
        id="staked-input"
        inputProps={{ "data-testid": "staked-input", min: "0" }}
        token={stakedAssetType.name as OHMSwapCardProps["token"]}
        value={isStake ? receiveAmount : amount}
        onChange={event => +event.target.value >= 0 && ohmOnChange(event.target.value, !isStake)}
        info={`Balance: ${balance ? balance.toString({ decimals: 2 }) : "0.00"} ${stakedAssetType.name}`}
        endString={!isStake ? "Max" : ""}
        endStringOnClick={() => balance && ohmOnChange(balance.toString(), !isStake)}
        inputWidth={`${
          (isStake ? receiveAmount : amount).length > 0 ? (isStake ? receiveAmount : amount).length : 1
        }ch`}
        disabled={isMutating}
        {...tokenOnClick}
      />
    );
  };

  return (
    <>
      <StyledBox mb={3}>
        <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
          <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
            <Box mb="21px">
              <SwapCollection
                UpperSwapCard={isStake ? OhmSwapCard() : GohmSwapCard()}
                LowerSwapCard={isStake ? GohmSwapCard() : OhmSwapCard()}
              />
            </Box>
            {tokenModalOpen && (
              <TokenModal
                open={tokenModalOpen}
                handleSelect={name => (isStake ? setSwapAssetType(name) : setStakedAssetType(name))}
                handleClose={() => setTokenModalOpen(false)}
                ohmBalance={ohmBalance && ohmBalance.toString({ decimals: 2 })}
                sOhmBalance={sOhmBalance && sOhmBalance.toString({ decimals: 2 })}
                gOhmBalance={gOhmBalance && gOhmBalance.toString({ decimals: 2 })}
                currentAction={isStake ? "STAKE" : "UNSTAKE"}
              />
            )}
            {!isStake && liveInverseBonds && (
              <Box mb="6.5px">
                <InfoNotification dismissible>
                  {`Unstaking your OHM? Trade for Treasury Stables with no slippage & zero trading fees via`}
                  &nbsp;
                  <Link href={`#/bonds`}>{`Inverse Bonds`}</Link>
                </InfoNotification>
              </Box>
            )}

            {/* Stake / Wrap / Zap */}
            <Box>
              <WalletConnectedGuard fullWidth>
                {contractRouting === "Stake" && (
                  <>
                    {/* <AcknowledgeWarmupCheckbox /> */}
                    <PrimaryButton
                      data-testid="submit-button"
                      loading={isMutating}
                      fullWidth
                      disabled={isMutating || !amount || amountExceedsBalance || parseFloat(amount) === 0}
                      onClick={() => setConfirmationModalOpen(true)}
                    >
                      {amountExceedsBalance
                        ? "Amount exceeds balance"
                        : !amount || parseFloat(amount) === 0
                        ? "Enter an amount"
                        : isStake
                        ? isMutating
                          ? "Confirming Wrapping in your wallet"
                          : "Wrap"
                        : isMutating
                        ? "Confirming Unwrapping in your wallet "
                        : "Unwrap"}
                    </PrimaryButton>
                  </>
                )}

                {contractRouting === "Wrap" && (
                  <PrimaryButton
                    data-testid="submit-button"
                    loading={isMutating}
                    fullWidth
                    disabled={isMutating || !amount || amountExceedsBalance || parseFloat(amount) === 0}
                    onClick={() => setConfirmationModalOpen(true)}
                  >
                    {amountExceedsBalance
                      ? "Amount exceeds balance"
                      : !amount || parseFloat(amount) === 0
                      ? "Enter an amount"
                      : isStake
                      ? isMutating
                        ? "Confirming Wrapping in your wallet"
                        : "Wrap to gOHM"
                      : isMutating
                      ? "Confirming Unwrapping in your wallet "
                      : "Unwrap"}
                  </PrimaryButton>
                )}
              </WalletConnectedGuard>
            </Box>
          </Box>
        </Box>
      </StyledBox>
      <StakeConfirmationModal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        contractRouting={contractRouting}
        addresses={addresses}
        chain={chain}
        swapAssetType={swapAssetType}
        stakedAssetType={stakedAssetType}
        contractAddress={contractAddress}
        currentAction={isStake ? "STAKE" : "UNSTAKE"}
        amount={amount}
        receiveAmount={receiveAmount}
        amountExceedsBalance={amountExceedsBalance}
        stakeMutation={stakeMutation}
        unstakeMutation={unstakeMutation}
        isMutating={isMutating}
        wrapMutation={wrapMutation}
        humanReadableRouting={humanReadableRouting}
      />
    </>
  );
};
