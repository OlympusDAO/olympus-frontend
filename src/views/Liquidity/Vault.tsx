import { ArrowBack } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
  DataRow,
  Icon,
  InfoNotification,
  OHMSwapCardProps,
  OHMTokenStackProps,
  PrimaryButton,
  SwapCard,
  SwapCollection,
  TokenStack,
} from "@olympusdao/component-library";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link as RouterLink, useParams, useSearchParams } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { useFetchZeroExSwapData } from "src/hooks/useFetchZeroExSwapData";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { ConfirmationModal } from "src/views/Liquidity/ConfirmationModal";
import { DepositSteps } from "src/views/Liquidity/DepositStepsModal";
import { useGetExpectedPairTokenAmount } from "src/views/Liquidity/hooks/useGetExpectedPairTokenAmount";
import { useGetLastDeposit } from "src/views/Liquidity/hooks/useGetLastDeposit";
import { useGetUserVault } from "src/views/Liquidity/hooks/useGetUserVault";
import { useGetVault } from "src/views/Liquidity/hooks/useGetVault";
import { useWithdrawLiquidity } from "src/views/Liquidity/hooks/useWithdrawLiquidity";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";
import { WithdrawModal } from "src/views/Liquidity/WithdrawModal";
import TokenModal, {
  ModalHandleSelectProps,
} from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import SlippageModal from "src/views/Zap/SlippageModal";
import { useNetwork, useSwitchNetwork } from "wagmi";

export const Vault = () => {
  const { id } = useParams();
  const { data: vault, isLoading } = useGetVault({ address: id });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const networks = useTestableNetworks();
  const { data: ohmPrice } = useOhmPrice();
  const withdraw = useWithdrawLiquidity();
  const zapQuote = useFetchZeroExSwapData();
  const [zapTokenModalOpen, setZapTokenModalOpen] = useState(false);
  const [swapAssetType, setSwapAssetType] = useState<ModalHandleSelectProps>({});
  const [customSlippage, setCustomSlippage] = useState<string>("1.0");
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const { data: userVault } = useGetUserVault({ address: id });
  const getExpectedPairTokenAmount = useGetExpectedPairTokenAmount();
  const { data: lastDeposit } = useGetLastDeposit({ userVaultAddress: userVault });

  const date =
    (lastDeposit &&
      `${new Date(+lastDeposit * 1000).toLocaleDateString()} ${new Date(+lastDeposit * 1000).toLocaleTimeString()}`) ||
    undefined;

  const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isDepositStepsModalOpen, setIsDepositStepsModalOpen] = useState(false);
  const [zapDepositTokenAmount, setZapDepositTokenAmount] = useState("0");

  const { data: pairTokenBalance = new DecimalBigNumber("0", 18) } = useBalance({
    [networks.MAINNET]: vault?.pairTokenAddress || "",
  })[networks.MAINNET];

  const [pairAmount, setPairAmount] = useState("0");
  const [reserveAmount, setReserveAmount] = useState("0");
  const { data: allowance } = useContractAllowance(
    { [networks.MAINNET]: vault?.pairTokenAddress },
    { [networks.MAINNET]: id },
  );
  const isZap =
    swapAssetType.name !== vault?.pairTokenName &&
    swapAssetType.name !== undefined &&
    vault?.pairTokenName !== undefined;
  const [searchParams, setSearchParams] = useSearchParams();
  const isWithdrawal = searchParams.get("withdraw") ? true : false;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    if (vault) {
      setSwapAssetType({ name: vault?.pairTokenName });
    }
  }, [vault?.pairTokenName]);

  useEffect(() => {
    if (isZap && pairAmount !== "0") {
      onDepositTokenChange(pairAmount);
    }
  }, [swapAssetType.name, isZap]);

  useEffect(() => {
    if (isWithdrawal && vault && +pairAmount > 0) {
      getExpectedPairTokenAmount.mutate(
        {
          lpAmount: parseUnits(pairAmount, 18),
          address: vault.vaultAddress,
        },
        {
          onSuccess: data => {
            setPairAmount(formatUnits(data, 18));
          },
        },
      );
    }
  }, [isWithdrawal]);

  const onDepositTokenChange = (amount: string) => {
    if (isZap && Number(amount) > 0) {
      if (vault?.pairTokenAddress && swapAssetType.address) {
        zapQuote.mutate(
          {
            slippage: Number(customSlippage),
            amount: parseUnits(amount, swapAssetType.decimals),
            tokenAddress: swapAssetType.address,
            buyAddress: vault.pairTokenAddress,
          },
          {
            onSuccess: data => {
              setZapDepositTokenAmount(formatUnits(data.buyAmount, 18));
              setReserveAmount(
                (Number(vault?.pricePerDepositToken) * Number(formatUnits(data.buyAmount, 18))).toString(),
              );
            },
            onError: (err: any) => {
              toast.error(err.message, { id: err.message, duration: 2000 });
            },
          },
        );
      }
    } else {
      setReserveAmount((Number(vault?.pricePerDepositToken) * Number(amount)).toString());
    }
  };

  const onReserveTokenChange = (amount: string) => {
    if (isWithdrawal && vault && +amount > 0) {
      getExpectedPairTokenAmount.mutate(
        {
          lpAmount: parseUnits(amount, 18),
          address: vault.vaultAddress,
        },
        {
          onSuccess: data => {
            setPairAmount(formatUnits(data, 18));
          },
        },
      );
    } else {
      if (isZap && Number(amount) > 0) {
        if (vault?.pairTokenAddress && swapAssetType.address) {
          const buyAmount = (Number(amount) / Number(vault.pricePerDepositToken)).toString();
          zapQuote.mutate(
            {
              slippage: Number(customSlippage),
              amount: new DecimalBigNumber(buyAmount).toBigNumber(),
              tokenAddress: swapAssetType.address,
              buyAddress: vault.pairTokenAddress,
              isSell: false,
            },
            {
              onSuccess: data => {
                setZapDepositTokenAmount(formatUnits(data.buyAmount, 18));
                setPairAmount(formatUnits(data.sellAmount, swapAssetType.decimals));
              },
              onError: (err: any) => {
                toast.error(err.message, { id: err.message, duration: 2000 });
              },
            },
          );
        }
      } else {
        setPairAmount((Number(amount) / Number(vault?.pricePerDepositToken)).toString());
      }
    }
  };

  const noAllowance =
    (allowance && allowance.eq(0) && vault?.pairTokenAddress !== ethers.constants.AddressZero) ||
    (allowance && allowance.lt(pairTokenBalance.toBigNumber()));

  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }
  if (!vault && !isLoading)
    return (
      <Typography variant="h2" align="center">
        Vault not Found
      </Typography>
    );
  if (!vault) return <></>;

  const slippageToPercent = 1 - +customSlippage / 100;
  const minLpAmount = new DecimalBigNumber(slippageToPercent.toString()).mul(new DecimalBigNumber(reserveAmount));

  const ohmMinted =
    ohmPrice && isZap
      ? new DecimalBigNumber(zapDepositTokenAmount).mul(vault.ohmPricePerDepositToken)
      : new DecimalBigNumber(pairAmount).mul(vault.ohmPricePerDepositToken);
  const maxBalance = (isZap ? swapAssetType.balance : formatUnits(pairTokenBalance.toBigNumber(), 18)) || "0";
  const pairToken = () => (
    <SwapCard
      id={""}
      token={
        swapAssetType.icon ? (
          <Avatar src={swapAssetType.icon} sx={{ width: "21px", height: "21px" }} />
        ) : (
          (swapAssetType.name as OHMSwapCardProps["token"])
        )
      }
      tokenOnClick={
        import.meta.env.VITE_BLE_ZAP_DISABLED ? undefined : !isWithdrawal ? () => setZapTokenModalOpen(true) : undefined
      }
      tokenName={swapAssetType.name}
      value={pairAmount}
      info={`Balance: ${
        swapAssetType.name === vault.pairTokenName
          ? formatNumber(Number(formatUnits(pairTokenBalance.toBigNumber(), 18)), 2)
          : swapAssetType.balance || "0.00"
      } ${swapAssetType.name}`}
      onChange={e => {
        onDepositTokenChange(e.target.value);
        setPairAmount(e.target.value);
      }}
      endString={`Max`}
      endStringOnClick={() => {
        onDepositTokenChange(maxBalance);
        setPairAmount(maxBalance);
      }}
      disabled={isWithdrawal}
    />
  );
  const lpToken = () => (
    <SwapCard
      id={""}
      token={
        <TokenStack
          tokens={[vault.pairTokenName as keyof OHMTokenStackProps["tokens"], "OHM"]}
          sx={{ fontSize: "21px" }}
        />
      }
      tokenName={`${vault.pairTokenName}-OHM LP`}
      value={reserveAmount}
      onChange={e => {
        onReserveTokenChange(e.target.value);
        setReserveAmount(e.target.value);
      }}
      info={`Balance: ${formatNumber(Number(vault.lpTokenBalance), 2)} ${vault.pairTokenName}-OHM LP`}
      endString={`Max`}
      endStringOnClick={() => {
        onReserveTokenChange(vault.lpTokenBalance);
        setReserveAmount(vault.lpTokenBalance);
      }}
    />
  );

  return (
    <>
      <Box width="100%">
        <Box mt={mobile ? "50px" : "0px"}>
          <PageTitle
            name={
              <Box display="flex" flexDirection="row" alignItems="center">
                <Link component={RouterLink} to="/liquidity/vaults">
                  <Box display="flex" flexDirection="row">
                    <ArrowBack />
                    <Typography fontWeight="500" marginLeft="9.5px" marginRight="18px">
                      Back
                    </Typography>
                  </Box>
                </Link>

                <TokenStack
                  tokens={[vault.pairTokenName as keyof OHMTokenStackProps["tokens"], "OHM"]}
                  sx={{ fontSize: "27px" }}
                />
                <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
                  <Typography variant="h4" fontWeight={500}>
                    {vault?.pairTokenName}-OHM LP
                  </Typography>
                </Box>
              </Box>
            }
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
        <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
          <SwapCollection
            UpperSwapCard={isWithdrawal ? lpToken() : pairToken()}
            LowerSwapCard={isWithdrawal ? pairToken() : lpToken()}
            arrowOnClick={() => {
              isWithdrawal ? setSearchParams(undefined) : setSearchParams({ withdraw: "true" });
            }}
          />
          {noAllowance && !isWithdrawal && (
            <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
              <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
                <Box mt="12px">
                  <InfoNotification dismissible>
                    <Typography>
                      First time adding Liquidity with <strong>{vault.pairTokenName}</strong>?
                    </Typography>
                    <Typography>
                      Please approve Olympus DAO to use your <strong>{vault.pairTokenName}</strong> for depositing.
                    </Typography>
                  </InfoNotification>
                </Box>
              </Box>
            </Box>
          )}
          <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
            <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
              <Box mt="12px">
                {isWithdrawal && !vault.canWithdraw && (
                  <InfoNotification dismissible>
                    <Typography>
                      There is a 24 hour withdraw period from time of last deposit {date}. Learn more{" "}
                      <Link
                        href="https://docs.olympusdao.finance/main/overview/boosted-liq-vaults#for-users-1"
                        target="_blank"
                      >
                        here
                      </Link>
                      .
                    </Typography>
                  </InfoNotification>
                )}
                <DataRow
                  title="Slippage Tolerance"
                  balance={
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <Typography>{customSlippage}%</Typography>
                      <Box width="6px" />
                      <Link onClick={() => setSlippageModalOpen(true)}>
                        <Icon name="settings" sx={{ paddingTop: "2px", fontSize: "14px" }} />
                      </Link>
                    </Box>
                  }
                />
                <DataRow
                  title={`OHM ${isWithdrawal ? "Removed" : "Minted"}`}
                  balance={formatNumber(Number(ohmMinted?.toString() || 0), 2)}
                />
                <DataRow
                  title="Fee"
                  balance={`${formatNumber(Number(vault.fee) * 100, 2)}%`}
                  tooltip="Current fee on rewards"
                />
                <DataRow title="Your LP Tokens" balance={formatNumber(Number(vault.lpTokenBalance), 2)} />
                <DataRow
                  title={`Max You Can Deposit ${vault.pairTokenName}-OHM LP)`}
                  balance={formatNumber(Number(vault.depositLimit), 2) || "0"}
                />
              </Box>
            </Box>
          </Box>
          <WalletConnectedGuard fullWidth>
            <>
              {networks.MAINNET == chain?.id ? (
                <PrimaryButton
                  fullWidth
                  disabled={
                    isWithdrawal
                      ? Number(reserveAmount) === 0 ||
                        Number(reserveAmount) > Number(vault.lpTokenBalance) ||
                        withdraw.isLoading ||
                        !vault.canWithdraw
                      : Number(pairAmount) === 0 || Number(pairAmount) > Number(maxBalance)
                  }
                  onClick={() => {
                    isWithdrawal ? setIsWithdrawConfirmOpen(true) : setIsDepositModalOpen(true);
                  }}
                >
                  {isWithdrawal
                    ? `Withdraw for ${vault.pairTokenName}`
                    : `${isZap ? "Zap and" : ""} Deposit ${vault.pairTokenName}`}
                </PrimaryButton>
              ) : (
                <PrimaryButton onClick={() => switchNetwork?.(NetworkId.MAINNET)}>Switch Network</PrimaryButton>
              )}
            </>
          </WalletConnectedGuard>

          {isDepositStepsModalOpen && (
            <DepositSteps
              userVault={userVault}
              vaultDepositTokenAddressMap={{ [networks.MAINNET]: vault.pairTokenAddress }}
              vaultManagerAddress={vault.vaultAddress}
              pairAmount={pairAmount}
              minLpAmount={minLpAmount}
              setIsOpen={() => setIsDepositStepsModalOpen(false)}
              isOpen={isDepositStepsModalOpen}
              swapAssetType={swapAssetType}
              slippage={customSlippage}
              zapIntoAddress={isZap ? vault.pairTokenAddress : undefined}
              vaultPairTokenName={vault.pairTokenName}
            />
          )}
          <LiquidityCTA />
          <ConfirmationModal
            isOpen={isDepositModalOpen}
            setIsOpen={setIsDepositModalOpen}
            depositTokenName={swapAssetType.name}
            vaultDepositTokenName={vault.pairTokenName}
            depositAmount={formatNumber(Number(pairAmount), 4)}
            receiveAmount={formatNumber(Number(reserveAmount), 4)}
            disclaimerChecked={disclaimerChecked}
            setDisclaimerChecked={setDisclaimerChecked}
            confirmButton={
              <PrimaryButton
                fullWidth
                onClick={() => {
                  setIsDepositStepsModalOpen(true);
                  setIsDepositModalOpen(false);
                }}
                disabled={!disclaimerChecked}
              >
                {`${isZap ? "Zap and" : ""} Deposit ${vault.pairTokenName}`}
              </PrimaryButton>
            }
          />

          <WithdrawModal
            isOpen={isWithdrawConfirmOpen}
            setIsOpen={setIsWithdrawConfirmOpen}
            depositToken={vault.pairTokenName}
            rewards={vault.rewards}
            withdrawAmount={reserveAmount}
            pairAmount={pairAmount}
            ohmRemoved={formatNumber(Number(ohmMinted?.toString() || 0), 2)}
            confirmButton={
              <PrimaryButton
                fullWidth
                disabled={
                  Number(reserveAmount) === 0 ||
                  Number(reserveAmount) > Number(vault.lpTokenBalance) ||
                  withdraw.isLoading
                }
                loading={withdraw.isLoading}
                onClick={() => {
                  userVault &&
                    vault &&
                    withdraw.mutate(
                      {
                        amount: reserveAmount,
                        slippage: customSlippage,
                        pairAmountToReceive: pairAmount,
                        userVault,
                        vaultAddress: vault.vaultAddress,
                      },
                      { onSuccess: () => setIsWithdrawConfirmOpen(false) },
                    );
                }}
              >
                Withdraw Liquidity
              </PrimaryButton>
            }
          />
          <SlippageModal
            handleClose={() => setSlippageModalOpen(false)}
            modalOpen={slippageModalOpen}
            setCustomSlippage={setCustomSlippage}
            currentSlippage={customSlippage}
          />
          {zapTokenModalOpen && (
            <TokenModal
              open={zapTokenModalOpen}
              handleSelect={name => {
                setSwapAssetType(name);
              }}
              handleClose={() => setZapTokenModalOpen(false)}
              showZapAssets
              alwaysShowTokens={[
                {
                  name: vault.pairTokenName as keyof OHMTokenStackProps["tokens"],
                  balance: formatNumber(Number(formatUnits(pairTokenBalance.toBigNumber(), 18)), 2),
                  address: vault.pairTokenAddress,
                  price: 1,
                },
              ]}
            />
          )}
        </Box>
      </Box>
    </>
  );
};
