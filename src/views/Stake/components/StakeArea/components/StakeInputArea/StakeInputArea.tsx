import { Avatar, Box, Link, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  InfoNotification,
  OHMSwapCardProps,
  PrimaryButton,
  SwapCard,
  SwapCollection,
} from "@olympusdao/component-library";
import { parseUnits } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import {
  GOHM_ADDRESSES,
  OHM_ADDRESSES,
  SOHM_ADDRESSES,
  STAKING_ADDRESSES,
  ZAP_ADDRESSES,
} from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useZapExecute } from "src/hooks/useZapExecute";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";
import StakeConfirmationModal from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/StakeConfirmationModal";
import TokenModal, {
  ModalHandleSelectProps,
} from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import { useStakeToken } from "src/views/Stake/components/StakeArea/components/StakeInputArea/hooks/useStakeToken";
import { useUnstakeToken } from "src/views/Stake/components/StakeArea/components/StakeInputArea/hooks/useUnstakeToken";
import { useWrapSohm } from "src/views/Wrap/components/WrapInputArea/hooks/useWrapSohm";
import ZapTransactionDetails from "src/views/Zap/ZapTransactionDetails";
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

  const [currentAction, setCurrentAction] = useState<"STAKE" | "UNSTAKE">("STAKE");
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [zapTokenModalOpen, setZapTokenModalOpen] = useState(false);
  const [zapSlippageAmount, setZapSlippageAmount] = useState("");
  const [zapMinAmount, setZapMinAmount] = useState("");
  const zapExecute = useZapExecute();
  const wrapMutation = useWrapSohm();

  const fromToken = currentAction === "STAKE" ? swapAssetType.name : stakedAssetType.name;

  // Max balance stuff
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [zapExchangeRate, setZapExchangeRate] = useState(0);
  const [zapOutputAmount, setZapOutputAmount] = useState("");
  const addresses = fromToken === "OHM" ? OHM_ADDRESSES : fromToken === "sOHM" ? SOHM_ADDRESSES : GOHM_ADDRESSES;

  const balance = useBalance(addresses)[networks.MAINNET].data;
  const ohmBalance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;
  const sOhmBalance = useBalance(SOHM_ADDRESSES)[networks.MAINNET].data;
  const gOhmBalance = useBalance(GOHM_ADDRESSES)[networks.MAINNET].data;
  const { data: currentIndex } = useCurrentIndex();

  const contractRouting = ["OHM", "gOHM"].includes(swapAssetType.name)
    ? "Stake"
    : swapAssetType.name === "sOHM"
    ? "Wrap"
    : "Zap";
  const contractAddress = contractRouting === "Stake" || contractRouting === "Wrap" ? STAKING_ADDRESSES : ZAP_ADDRESSES;

  const humanReadableRouting =
    currentAction === "STAKE"
      ? contractRouting
      : currentAction === "UNSTAKE" && contractRouting === "Stake"
      ? "Unstake"
      : currentAction === "UNSTAKE" && contractRouting === "Wrap"
      ? "Unwrap"
      : currentAction === "UNSTAKE" && contractRouting === "Zap"
      ? "Zap out"
      : contractRouting;

  // Staking/unstaking mutation stuff
  const stakeMutation = useStakeToken();
  const unstakeMutation = useUnstakeToken(stakedAssetType.name === "gOHM" ? "gOHM" : "sOHM");
  const isMutating = (currentAction === "STAKE" ? stakeMutation : unstakeMutation).isLoading;
  const isMutationSuccess =
    stakeMutation.isSuccess || unstakeMutation.isSuccess || zapExecute.isSuccess || wrapMutation.isSuccess;

  const bonds = useLiveBonds({ isInverseBond: true }).data;
  const amountExceedsBalance = balance && new DecimalBigNumber(amount).gt(balance) ? true : false;

  const liveInverseBonds = bonds && bonds.length > 0;

  const ohmOnChange = (value: string, spendAsset: boolean) => {
    if (!currentIndex) return null;
    spendAsset ? setAmount(value) : setReceiveAmount(value);
    let oppositeAmount: string;
    if (currentAction === "STAKE" && contractRouting === "Zap") {
      if (zapExchangeRate === 0) return null;
      if (spendAsset) {
        oppositeAmount = new DecimalBigNumber(value).div(new DecimalBigNumber(zapExchangeRate.toString())).toString();
      } else {
        oppositeAmount = new DecimalBigNumber(value).mul(new DecimalBigNumber(zapExchangeRate.toString())).toString();
      }
    } else {
      if ((currentAction === "STAKE" && spendAsset) || (currentAction === "UNSTAKE" && !spendAsset)) {
        oppositeAmount =
          stakedAssetType.name === "gOHM" ? new DecimalBigNumber(value, 9).div(currentIndex, 18).toString() : value;
      } else {
        oppositeAmount =
          stakedAssetType.name === "gOHM" ? new DecimalBigNumber(value, 18).mul(currentIndex).toString() : value;
      }
    }
    spendAsset ? setReceiveAmount(oppositeAmount) : setAmount(oppositeAmount);
  };

  useEffect(() => {
    ohmOnChange(amount, true);
  }, [stakedAssetType, swapAssetType, zapExchangeRate]);

  useEffect(() => {
    if (isMutationSuccess) setConfirmationModalOpen(false);
  }, [isMutationSuccess]);

  useEffect(() => {
    ohmOnChange(amount, currentAction === "UNSTAKE");
    //If we're unstaking we reset swap asset back to OHM. this is all you can receive when unstaking.
    if (currentAction === "UNSTAKE") {
      setSwapAssetType({ name: "OHM" });
    }
    if (currentAction === "STAKE" && stakedAssetType.name === "sOHM") {
      setStakedAssetType({ name: "gOHM" });
    }
  }, [currentAction]);

  const onZap = async () => {
    if (swapAssetType.balance && swapAssetType.address && swapAssetType.decimals) {
      zapExecute.mutate({
        slippage: zapSlippageAmount,
        sellAmount: parseUnits(amount, swapAssetType.decimals),
        tokenAddress: swapAssetType.address,
        minimumAmount: zapMinAmount,
        gOHM: stakedAssetType.name === "gOHM",
      });
    }
  };

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
        tokenOnClick={currentAction === "STAKE" ? () => setZapTokenModalOpen(true) : undefined}
        inputProps={{ "data-testid": "ohm-input", min: "0" }}
        value={currentAction === "STAKE" ? amount : receiveAmount}
        onChange={event => +event.target.value >= 0 && ohmOnChange(event.target.value, currentAction === "STAKE")}
        info={`Balance: ${balance} ${swapAssetType.name}`}
        endString={currentAction === "STAKE" ? "Max" : ""}
        endStringOnClick={() => balance && ohmOnChange(balance, currentAction === "STAKE")}
        disabled={isMutating}
        inputWidth={`${
          (currentAction === "STAKE" ? amount : receiveAmount).length > 0
            ? (currentAction === "STAKE" ? amount : receiveAmount).length
            : 1
        }ch`}
      />
    );
  };

  const GohmSwapCard = () => {
    const balance = stakedAssetType.name === "sOHM" ? sOhmBalance : gOhmBalance;
    const tokenOnClick =
      sOhmBalance && currentAction === "UNSTAKE" ? { tokenOnClick: () => setTokenModalOpen(true) } : {};

    return (
      <SwapCard
        id="staked-input"
        inputProps={{ "data-testid": "staked-input", min: "0" }}
        token={stakedAssetType.name as OHMSwapCardProps["token"]}
        value={currentAction === "STAKE" ? receiveAmount : amount}
        onChange={event => +event.target.value >= 0 && ohmOnChange(event.target.value, currentAction === "UNSTAKE")}
        info={`Balance: ${balance ? balance.toString({ decimals: 2 }) : "0.00"} ${stakedAssetType.name}`}
        endString={currentAction === "UNSTAKE" ? "Max" : ""}
        endStringOnClick={() => balance && ohmOnChange(balance.toString(), currentAction === "UNSTAKE")}
        inputWidth={`${
          (currentAction === "STAKE" ? receiveAmount : amount).length > 0
            ? (currentAction === "STAKE" ? receiveAmount : amount).length
            : 1
        }ch`}
        disabled={isMutating}
        {...tokenOnClick}
      />
    );
  };

  return (
    <>
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
          <Tab aria-label="stake-button" label="Stake" />

          <Tab aria-label="unstake-button" label={`Unstake`} />
        </Tabs>

        <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
          <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
            <Box mb="21px">
              <SwapCollection
                UpperSwapCard={currentAction === "STAKE" ? OhmSwapCard() : GohmSwapCard()}
                LowerSwapCard={currentAction === "STAKE" ? GohmSwapCard() : OhmSwapCard()}
                arrowOnClick={() => setCurrentAction(currentAction === "STAKE" ? "UNSTAKE" : "STAKE")}
              />
            </Box>
            {tokenModalOpen && (
              <TokenModal
                open={tokenModalOpen}
                handleSelect={name => setStakedAssetType(name)}
                handleClose={() => setTokenModalOpen(false)}
                sOhmBalance={sOhmBalance && sOhmBalance.toString({ decimals: 2 })}
                gOhmBalance={gOhmBalance && gOhmBalance.toString({ decimals: 2 })}
              />
            )}
            {zapTokenModalOpen && (
              <TokenModal
                open={zapTokenModalOpen}
                handleSelect={name => {
                  setSwapAssetType(name);
                }}
                handleClose={() => setZapTokenModalOpen(false)}
                ohmBalance={ohmBalance && ohmBalance.toString({ decimals: 2 })}
                sOhmBalance={sOhmBalance && sOhmBalance.toString({ decimals: 2 })}
                gOhmBalance={gOhmBalance && gOhmBalance.toString({ decimals: 2 })}
                showZapAssets
              />
            )}
            {contractRouting === "Zap" && (
              <ZapTransactionDetails
                inputQuantity={amount}
                outputGOHM={stakedAssetType.name === "gOHM" ? true : false}
                swapTokenBalance={swapAssetType}
                handleOutputAmount={amount => setZapOutputAmount(amount)}
                handleExchangeRate={rate => setZapExchangeRate(rate)}
                handleSlippageAmount={slippage => setZapSlippageAmount(slippage)}
                handleMinAmount={minAmount => setZapMinAmount(minAmount)}
              />
            )}
            {currentAction === "UNSTAKE" && liveInverseBonds && (
              <Box mb="6.5px">
                <InfoNotification dismissible>
                  {`Unstaking your OHM? Trade for Treasury Stables with no slippage & zero trading fees via`}
                  &nbsp;
                  <Link href={`#/bonds`}>{`Inverse Bonds`}</Link>
                </InfoNotification>
              </Box>
            )}
            {contractRouting === "Zap" && (
              <Box mt="21px" mb="6.5px">
                <InfoNotification dismissible>
                  <strong>You are about to Zap.</strong> Zaps allow you to stake OHM from any other currency, all in one
                  tx, saving you gas and headache.
                  <br />
                  <Link
                    href="https://docs.olympusdao.finance/main/using-the-website/olyzaps"
                    target="_blank"
                  >{`Learn more`}</Link>
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
                        : currentAction === "STAKE"
                        ? isMutating
                          ? "Confirming Staking in your wallet"
                          : "Stake"
                        : isMutating
                        ? "Confirming Unstaking in your wallet "
                        : "Unstake"}
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
                      : currentAction === "STAKE"
                      ? isMutating
                        ? "Confirming Wrapping in your wallet"
                        : "Wrap to gOHM"
                      : isMutating
                      ? "Confirming Unstaking in your wallet "
                      : "Unstake"}
                  </PrimaryButton>
                )}
                {contractRouting === "Zap" && (
                  <>
                    <PrimaryButton
                      data-testid="submit-zap-button"
                      fullWidth
                      disabled={
                        zapExecute.isLoading ||
                        zapOutputAmount === "" ||
                        (+zapOutputAmount < 0.5 && stakedAssetType.name !== "gOHM") ||
                        import.meta.env.VITE_DISABLE_ZAPS ||
                        parseFloat(amount) === 0
                      }
                      onClick={() => setConfirmationModalOpen(true)}
                    >
                      <Box display="flex" flexDirection="row" alignItems="center">
                        {zapOutputAmount === ""
                          ? "Enter an amount"
                          : +zapOutputAmount >= 0.5 || stakedAssetType.name == "gOHM"
                          ? "Zap-Stake"
                          : "Minimum Output Amount: 0.5 sOHM"}
                      </Box>
                    </PrimaryButton>
                  </>
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
        currentAction={currentAction}
        amount={amount}
        receiveAmount={receiveAmount}
        amountExceedsBalance={amountExceedsBalance}
        zapOutputAmount={zapOutputAmount}
        zapSlippageAmount={zapSlippageAmount}
        zapMinAmount={zapMinAmount}
        stakeMutation={stakeMutation}
        unstakeMutation={unstakeMutation}
        isMutating={isMutating}
        onZap={onZap}
        wrapMutation={wrapMutation}
        zapExecuteIsLoading={zapExecute.isLoading}
        humanReadableRouting={humanReadableRouting}
      />
    </>
  );
};
