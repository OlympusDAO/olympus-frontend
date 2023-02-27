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
import { Link as RouterLink, useParams, useSearchParams } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { ZERO_EX_EXCHANGE_PROXY_ADDRESSES } from "src/constants/addresses";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useZeroExSwap } from "src/hooks/useZeroExSwap";
import { ZeroEx__factory } from "src/typechain";
import { TransformedERC20EventObject } from "src/typechain/ZeroEx";
import { useDepositLiqudiity } from "src/views/Liquidity/hooks/useDepositLiquidity";
import { useGetVault } from "src/views/Liquidity/hooks/useGetVault";
import { useWithdrawLiquidity } from "src/views/Liquidity/hooks/useWithdrawLiquidity";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";
import TokenModal, {
  ModalHandleSelectProps,
} from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import SlippageModal from "src/views/Zap/SlippageModal";
import { useAccount, useBalance as useWagmiBalance } from "wagmi";

export const Vault = () => {
  const { id } = useParams();
  const { data: vault, isLoading } = useGetVault({ address: id });
  const networks = useTestableNetworks();
  const deposit = useDepositLiqudiity();
  const { data: ohmPrice } = useOhmPrice();
  const withdraw = useWithdrawLiquidity();
  const [zapTokenModalOpen, setZapTokenModalOpen] = useState(false);
  const [swapAssetType, setSwapAssetType] = useState<ModalHandleSelectProps>({});
  const { address } = useAccount();
  const zeroExSwap = useZeroExSwap();
  const [customSlippage, setCustomSlippage] = useState<string>("1.0");
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const { data: daiBalance } = useWagmiBalance({
    addressOrName: address,
    formatUnits: "ether",
    chainId: networks.MAINNET,
  });
  const { data: pairTokenBalance = new DecimalBigNumber("0", 18) } = useBalance({
    [networks.MAINNET]: vault?.pairTokenAddress || "",
  })[networks.MAINNET];

  const [pairAmount, setPairAmount] = useState("0");
  const [reserveAmount, setReserveAmount] = useState("0");
  const { data: allowance } = useContractAllowance(
    { [networks.MAINNET]: vault?.pairTokenAddress },
    { [networks.MAINNET]: id },
  );

  useEffect(() => {
    if (vault) {
      setSwapAssetType({ name: vault?.pairTokenName });
    }
  }, [vault?.pairTokenName]);

  const onDepositTokenChange = (amount: string) => {
    setReserveAmount((Number(vault?.pricePerDepositToken) * Number(amount)).toString());
  };

  const onReserveTokenChange = (amount: string) => {
    setPairAmount((Number(amount) / Number(vault?.pricePerDepositToken)).toString());
  };

  const noAllowance =
    (allowance && allowance.eq(0) && vault?.pairTokenAddress !== ethers.constants.AddressZero) ||
    (allowance && allowance.lt(pairTokenBalance.toBigNumber()));

  const [searchParams, setSearchParams] = useSearchParams();
  const isWithdrawal = searchParams.get("withdraw");

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

  const isZap = swapAssetType.name !== vault.pairTokenName && swapAssetType.name !== undefined;
  const minLpAmount = (1 - Number(customSlippage) / 100) * Number(reserveAmount);
  const ohmMinted =
    ohmPrice &&
    new DecimalBigNumber(vault.usdPricePerToken)
      .mul(new DecimalBigNumber(reserveAmount))
      .div(new DecimalBigNumber(ohmPrice?.toString()));

  const usdPriceDeposit = Number(vault.pricePerDepositToken) * Number(vault.usdPricePerToken);

  const vaultLimitUSD = ohmPrice && ((Number(vault.limit) - Number(vault.ohmMinted)) * ohmPrice) / usdPriceDeposit;
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
        onDepositTokenChange(formatUnits(pairTokenBalance.toBigNumber(), 18));
        setPairAmount(formatUnits(pairTokenBalance.toBigNumber(), 18));
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
        {/* <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
          <Box display="flex" flexDirection="column" width="100%" maxWidth="900px" mb="28px">
            <MetricCollection>
              <Metric label="First Metric" metric="1" />
              <Metric label="First Metric" metric="1" />
              <Metric label="First Metric" metric="1" />
            </MetricCollection>
          </Box>
        </Box> */}
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
                <InfoNotification dismissible>
                  <Typography>
                    By depositing {vault.pairTokenName} into an AMO pools, you are not guaranteed to get back the exact
                    same amount of deposit tokens at time of withdraw and your position will be exposed to impermanent
                    loss.
                  </Typography>
                </InfoNotification>
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
                <DataRow title="OHM Minted" balance={formatNumber(Number(ohmMinted?.toString() || 0), 2)} />
                <DataRow title="Your LP Tokens" balance={formatNumber(Number(vault.lpTokenBalance), 2)} />
                <DataRow
                  title="Max You Can Deposit"
                  balance={(vaultLimitUSD && formatNumber(vaultLimitUSD, 2)) || "0"}
                />
              </Box>
            </Box>
          </Box>

          <TokenAllowanceGuard
            isVertical
            tokenAddressMap={
              isZap ? { [networks.MAINNET]: swapAssetType.address } : { [networks.MAINNET]: vault.pairTokenAddress }
            }
            approvalText={
              isZap
                ? `Approve ${swapAssetType.name} for Swapping`
                : `Approve ${vault.pairTokenName} for Deposit to Vault`
            }
            spenderAddressMap={isZap ? ZERO_EX_EXCHANGE_PROXY_ADDRESSES : { [networks.MAINNET]: id }}
          >
            {isZap && (
              <>
                <PrimaryButton
                  onClick={() => {
                    zeroExSwap.mutate(
                      {
                        slippage: "10",
                        sellAmount: parseUnits(pairAmount, swapAssetType.decimals),
                        tokenAddress: swapAssetType.address || "",
                        buyAddress: vault.pairTokenAddress,
                      },
                      {
                        onSuccess: async data => {
                          //Find the TransformedERC20 event, since it includes the amount received.
                          const parsed = data.logs.find(log =>
                            log.topics.includes("0x0f6672f78a59ba8e5e5b5d38df3ebc67f3c792e2c9259b8d97d7f00dd78ba1b3"),
                          );
                          const iface = new ethers.utils.Interface(ZeroEx__factory.abi);
                          if (parsed) {
                            const decoded = iface.decodeEventLog(
                              "TransformedERC20",
                              parsed.data,
                              parsed.topics,
                            ) as unknown as TransformedERC20EventObject;
                            //now we'll move to the next step.
                            console.log("depositing", formatUnits(decoded.outputTokenAmount, 18));
                            deposit.mutate({
                              amount: formatUnits(decoded.outputTokenAmount, 18),
                              address: vault.vaultAddress,
                              minLpAmount: minLpAmount.toString(),
                            });
                          }
                        },
                      },
                    );
                  }}
                >
                  TEST
                </PrimaryButton>
              </>
            )}
            <PrimaryButton
              fullWidth
              disabled={
                isWithdrawal
                  ? Number(reserveAmount) === 0 ||
                    Number(reserveAmount) > Number(vault.lpTokenBalance) ||
                    withdraw.isLoading
                  : Number(pairAmount) === 0 ||
                    Number(pairAmount) > Number(formatUnits(pairTokenBalance.toBigNumber(), 18)) ||
                    deposit.isLoading
              }
              loading={deposit.isLoading}
              onClick={() => {
                isWithdrawal
                  ? withdraw.mutate({ amount: reserveAmount, slippage: "0", address: vault.vaultAddress })
                  : deposit.mutate({
                      amount: pairAmount,
                      minLpAmount: minLpAmount.toString(),
                      address: vault.vaultAddress,
                    });
              }}
            >
              {isWithdrawal ? `Withdraw for ${vault.pairTokenName}` : `Deposit ${vault.pairTokenName}`}
            </PrimaryButton>
          </TokenAllowanceGuard>
          <LiquidityCTA />
          {/* <ConfirmationModal /> */}
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
                },
                {
                  name: "ETH",
                  balance: daiBalance?.formatted,
                  address: ethers.constants.AddressZero,
                },
              ]}
            />
          )}
        </Box>
      </Box>
    </>
  );
};
