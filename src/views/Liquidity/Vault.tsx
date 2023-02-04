import { ArrowBack } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import {
  DataRow,
  InfoNotification,
  OHMTokenStackProps,
  PrimaryButton,
  SwapCard,
  SwapCollection,
  TokenStack,
} from "@olympusdao/component-library";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useDepositLiqudiity } from "src/views/Liquidity/hooks/useDepositLiquidity";
import { useGetVault } from "src/views/Liquidity/hooks/useGetVault";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";

export const Vault = () => {
  const { id } = useParams();
  const { data: vault, isLoading } = useGetVault({ address: id });
  const networks = useTestableNetworks();
  const deposit = useDepositLiqudiity();

  console.log(vault?.pairTokenAddress, "test");
  const { data: pairTokenBalance = new DecimalBigNumber("0", 18) } = useBalance({
    [networks.MAINNET]: vault?.pairTokenAddress || "",
  })[networks.MAINNET];

  const [pairAmount, setPairAmount] = useState("0");
  const { data: allowance } = useContractAllowance(
    { [networks.MAINNET]: vault?.pairTokenAddress },
    { [networks.MAINNET]: id },
  );

  const noAllowance =
    (allowance && allowance.eq(0) && vault?.pairTokenAddress !== ethers.constants.AddressZero) ||
    (allowance && allowance.lt(pairTokenBalance.toBigNumber()));
  const handleChangePairAmount = (value: any) => {
    //const reserveValue = value * swapPrice;
    setPairAmount(pairAmount);
    //setLPAmount(reserveValue.toString());
  };

  // const handleChangeReserveAmount = (value: any) => {
  //   const ohmValue = value / swapPrice;
  //   setOhmAmount(ohmValue.toString());
  //   setReserveAmount(value);
  // };

  if (!vault && !isLoading)
    return (
      <Typography variant="h2" align="center">
        Vault not Found
      </Typography>
    );
  if (!vault) return <></>;
  return (
    <>
      <Box width="100%">
        <PageTitle
          name={
            <Box display="flex" flexDirection="row" alignItems="center">
              <Link component={RouterLink} to="/liquidity">
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
            UpperSwapCard={
              <SwapCard
                id={""}
                token={vault.pairTokenName as keyof OHMTokenStackProps["tokens"]}
                tokenName={vault.pairTokenName}
                value={pairAmount}
                info={`Balance: ${formatNumber(Number(formatUnits(pairTokenBalance.toBigNumber(), 18)), 2)} ${
                  vault.pairTokenName
                }`}
                onChange={e => {
                  setPairAmount(e.target.value);
                }}
                endString={`Max`}
                endStringOnClick={() => setPairAmount(formatUnits(pairTokenBalance.toBigNumber(), 18))}
              />
            }
            LowerSwapCard={
              <SwapCard
                id={""}
                token={
                  <TokenStack
                    tokens={[vault.pairTokenName as keyof OHMTokenStackProps["tokens"], "OHM"]}
                    sx={{ fontSize: "21px" }}
                  />
                }
                tokenName="stETH-OHM LP"
                info={`Balance: ${vault.lpTokenBalance} ${vault.pairTokenName}-OHM LP`}
                endString={`Max`}
                endStringOnClick={() => hasPrice && onChangeReserveAmount(reserveBalance.toString())}
              />
            }
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
                <DataRow title="Slippage Tolerance" balance="PLACEHOLDER" />
                <DataRow title="OHM Minted" balance={vault.ohmMinted} />
                <DataRow title="Your LP Tokens" balance={vault.lpTokenBalance} />
                <DataRow title="Max You Can Deposit" balance={"TBD"} />
                {/* (Number(vault.limit) - Number(vault.ohmMinted)).toString() */}
                <DataRow title="Fee" balance={vault.fee} />
              </Box>
            </Box>
          </Box>

          <TokenAllowanceGuard
            isVertical
            tokenAddressMap={{ [networks.MAINNET]: vault.pairTokenAddress }}
            approvalText={`Approve ${vault.pairTokenName} for Deposit to Vault`}
            spenderAddressMap={{ [networks.MAINNET]: id }}
          >
            <PrimaryButton
              fullWidth
              disabled={
                Number(pairAmount) === 0 ||
                Number(pairAmount) > Number(formatUnits(pairTokenBalance.toBigNumber(), 18)) ||
                deposit.isLoading
              }
              loading={deposit.isLoading}
              onClick={() => {
                deposit.mutate({ amount: pairAmount, slippage: "0", address: vault.vaultAddress });
              }}
            >
              Deposit {vault.pairTokenName}
            </PrimaryButton>
          </TokenAllowanceGuard>
          <LiquidityCTA />
          {/* <ConfirmationModal /> */}
          {/* <SlippageModal
            handleClose={() => console.log("test")}
            modalOpen={true}
            setCustomSlippage={() => console.log("test")}
            currentSlippage={"0.5"}
          /> */}
        </Box>
      </Box>
    </>
  );
};
