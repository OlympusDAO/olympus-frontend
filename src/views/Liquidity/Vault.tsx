import { ArrowBack } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, Link, Typography } from "@mui/material";
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
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { useFetchZeroExSwapData } from "src/hooks/useFetchZeroExSwapData";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { ConfirmationModal } from "src/views/Liquidity/ConfirmationModal";
import { DepositSteps } from "src/views/Liquidity/DepositStepsModal";
import { useGetUserVault } from "src/views/Liquidity/hooks/useGetUserVault";
import { useGetVault } from "src/views/Liquidity/hooks/useGetVault";
import { useWithdrawLiquidity } from "src/views/Liquidity/hooks/useWithdrawLiquidity";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";
import { WithdrawModal } from "src/views/Liquidity/WithdrawModal";
import TokenModal, {
  ModalHandleSelectProps,
} from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import SlippageModal from "src/views/Zap/SlippageModal";
import { useAccount, useBalance as useWagmiBalance } from "wagmi";

export const Vault = () => {
  const { id } = useParams();
  const { data: vault, isLoading } = useGetVault({ address: id });
  const networks = useTestableNetworks();
  const { data: ohmPrice } = useOhmPrice();
  const withdraw = useWithdrawLiquidity();
  const zapQuote = useFetchZeroExSwapData();
  const [zapTokenModalOpen, setZapTokenModalOpen] = useState(false);
  const [swapAssetType, setSwapAssetType] = useState<ModalHandleSelectProps>({});
  const { address } = useAccount();
  const [customSlippage, setCustomSlippage] = useState<string>("1.0");
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const { data: userVault, isLoading: userVaultLoading } = useGetUserVault({ address: id });

  console.log(userVault, "userVault");
  const { data: daiBalance } = useWagmiBalance({
    addressOrName: address,
    formatUnits: "ether",
    chainId: networks.MAINNET,
  });
  const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isZapAndDepositModalOpen, setIsZapAndDepositModalOpen] = useState(false);
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

  const onDepositTokenChange = (amount: string) => {
    if (isZap && Number(amount) > 0) {
      if (vault?.pairTokenAddress && swapAssetType.address) {
        zapQuote.mutate(
          {
            slippage: Number(customSlippage),
            amount: parseUnits(amount, swapAssetType.decimals),
            tokenAddress: swapAssetType.address, //TODO: REPLACE swapAssetType.address
            buyAddress: "0x1643e812ae58766192cf7d2cf9567df2c37e9b7f", //TODO: testnetToMainnetContract(vault.pairTokenAddress),
          },
          {
            onSuccess: data => {
              setZapDepositTokenAmount(formatUnits(data.buyAmount, 18));
              setReserveAmount(
                (Number(vault?.pricePerDepositToken) * Number(formatUnits(data.buyAmount, 18))).toString(),
              );
              console.log("parseUnits", formatUnits(data.buyAmount, 18), vault.pricePerDepositToken);
              console.log("quote data", data);
            },
            onError: (err: any) => {
              console.log(err, "err");
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
    if (isZap && Number(amount) > 0) {
      if (vault?.pairTokenAddress && swapAssetType.address) {
        const buyAmount = (Number(amount) / Number(vault.pricePerDepositToken)).toString();
        console.log("buyAmount", buyAmount);
        zapQuote.mutate(
          {
            slippage: Number(customSlippage),
            amount: new DecimalBigNumber(buyAmount).toBigNumber(),
            tokenAddress: swapAssetType.address, //TODO: REPLACE swapAssetType.address
            buyAddress: "0x1643e812ae58766192cf7d2cf9567df2c37e9b7f", //TODO: testnetToMainnetContract(vault.pairTokenAddress),
            isSell: false,
          },
          {
            onSuccess: data => {
              console.log("data", data);
              setZapDepositTokenAmount(formatUnits(data.buyAmount, 18));
              setPairAmount(formatUnits(data.sellAmount, swapAssetType.decimals)); //TODO: OHM testnet decimals
              console.log("parseUnits", formatUnits(data.buyAmount, 18), vault.pricePerDepositToken);
              console.log("quote data", data);
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
  };

  const noAllowance =
    (allowance && allowance.eq(0) && vault?.pairTokenAddress !== ethers.constants.AddressZero) ||
    (allowance && allowance.lt(pairTokenBalance.toBigNumber()));

  const [searchParams, setSearchParams] = useSearchParams();
  const isWithdrawal = searchParams.get("withdraw");
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

  const slippageToPercent = 1;
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
      tokenOnClick={!isWithdrawal ? () => setZapTokenModalOpen(true) : undefined}
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
        console.log("maxBalance", maxBalance);
        onDepositTokenChange(maxBalance);
        setPairAmount(maxBalance);
      }}
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
        ></PageTitle>
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
          {noAllowance && (
            <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
              <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
                <Box mt="12px">
                  <InfoNotification dismissible>
                    <Typography>
                      First time adding Liquidity with <strong>{vault.pairTokenName}</strong>
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
                {!isWithdrawal && (
                  <InfoNotification dismissible>
                    <Typography>
                      By depositing {vault.pairTokenName} into an AMO pools, you are not guaranteed to get back the
                      exact same amount of deposit tokens at time of withdraw and your position will be exposed to
                      impermanent loss.
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
                <DataRow title="Your LP Tokens" balance={formatNumber(Number(vault.lpTokenBalance), 2)} />
                <DataRow title="Max You Can Deposit" balance={formatNumber(Number(vault.depositLimit), 2) || "0"} />
              </Box>
            </Box>
          </Box>

          <PrimaryButton
            fullWidth
            disabled={
              isWithdrawal
                ? Number(reserveAmount) === 0 ||
                  Number(reserveAmount) > Number(vault.lpTokenBalance) ||
                  withdraw.isLoading
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

          {isDepositStepsModalOpen && (
            <DepositSteps
              userVault={userVault}
              vaultDepositTokenAddressMap={{ [networks.MAINNET]: vault.pairTokenAddress }}
              vaultManagerAddress={vault.vaultAddress}
              // zapFromTokenAddressMap={{ [networks.MAINNET]: swapAssetType.address }}
              pairAmount={pairAmount}
              minLpAmount={minLpAmount}
              setIsOpen={() => setIsDepositStepsModalOpen(false)}
              isOpen={isDepositStepsModalOpen}
              swapAssetType={swapAssetType}
              slippage={customSlippage}
              zapIntoAddress={isZap ? "0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F" : undefined} //TODO: replace with vault address. this is testnet stETH for now for
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
                    withdraw.mutate(
                      { amount: reserveAmount, slippage: "0", address: userVault },
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
                {
                  name: "ETH",
                  balance: daiBalance?.formatted,
                  address: ethers.constants.AddressZero,
                  price: 10,
                },
              ]}
            />
          )}
        </Box>
      </Box>
    </>
  );
};
