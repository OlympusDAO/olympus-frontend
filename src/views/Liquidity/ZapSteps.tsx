import { CheckCircleOutline } from "@mui/icons-material";
import { Box, useTheme } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { ContractReceipt, ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useEffect } from "react";
import { useApproveToken } from "src/components/TokenAllowanceGuard/hooks/useApproveToken";
import { ZERO_EX_EXCHANGE_PROXY_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useZeroExSwap } from "src/hooks/useZeroExSwap";
import { IERC20__factory } from "src/typechain";
import { TransferEventObject } from "src/typechain/IERC20";
import { ModalHandleSelectProps } from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import { useAccount } from "wagmi";

interface ZapSteps {
  zapIntoAddress: string;
  slippage: string;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  swapAmount: string;
  swapAssetType: ModalHandleSelectProps;
  setDepositAmountFromZap: (amount: string) => void;
  vaultPairTokenName: string;
}
export const ZapSteps = ({
  zapIntoAddress,
  slippage,
  currentStep,
  setCurrentStep,
  swapAmount,
  swapAssetType,
  setDepositAmountFromZap,
  vaultPairTokenName,
}: ZapSteps) => {
  const networks = useTestableNetworks();
  const zeroExSwap = useZeroExSwap();
  const theme = useTheme();
  const { address } = useAccount();

  const { data: zapBalance = new DecimalBigNumber("0") } = useBalance({
    [networks.MAINNET]: zapIntoAddress,
  })[networks.MAINNET] || { data: new DecimalBigNumber("0") };

  const approveZap = useApproveToken({ [networks.MAINNET]: swapAssetType.address });
  const { data: allowanceZapFromToken, isLoading: allowanceIsLoading } = useContractAllowance(
    { [networks.MAINNET]: swapAssetType.address },
    ZERO_EX_EXCHANGE_PROXY_ADDRESSES,
  );

  useEffect(() => {
    if (currentStep === 3 && !allowanceIsLoading) {
      if (needsToApproveProxy()) {
        approveZap.mutate(
          { spenderAddressMap: ZERO_EX_EXCHANGE_PROXY_ADDRESSES },
          {
            onSuccess: () => {
              setCurrentStep(4);
              depositIntoVault();
            },
          },
        );
      } else {
        setCurrentStep(4);
        depositIntoVault();
      }
    }
  }, [currentStep, allowanceIsLoading]);

  const depositIntoVault = () => {
    zeroExSwap.mutate(
      {
        slippage: slippage,
        sellAmount: parseUnits(swapAmount, swapAssetType.decimals),
        tokenAddress: swapAssetType.address || "",
        buyAddress: zapIntoAddress,
      },
      {
        onSuccess: async data => {
          parseDepositReceipt(data);
        },
      },
    );
  };

  //** Finds the amount that came from the deposit transaction, and sets it in state */
  const parseDepositReceipt = (data: ContractReceipt) => {
    //Find the Transfer events, then filter by transfer to the depositor address
    const transferEvents = data.logs.filter(log =>
      log.topics.includes("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"),
    );
    const iface = new ethers.utils.Interface(IERC20__factory.abi);
    if (transferEvents) {
      const decodedEvents = transferEvents.map(transfer => {
        return iface.decodeEventLog("Transfer", transfer.data, transfer.topics) as unknown as TransferEventObject;
      });

      //find the amount that was sent back to the depositor
      const transferIn = decodedEvents.find(event => event.to === address);

      if (transferIn) {
        //set to step 5. set the amount to the amount received from the swap.
        setDepositAmountFromZap(formatUnits(transferIn.value, 18));
        setCurrentStep(5);
      }
    }
  };

  const needsToApproveProxy = () => {
    const needsApproval =
      (allowanceZapFromToken &&
        allowanceZapFromToken.eq(0) &&
        swapAssetType.address !== ethers.constants.AddressZero) ||
      (allowanceZapFromToken && allowanceZapFromToken.lt(zapBalance.toBigNumber()))
        ? true
        : false;

    return needsApproval;
  };

  return (
    <>
      {currentStep === 3 ? (
        <Box mt="18px">
          <PrimaryButton
            disabled={approveZap.isLoading}
            loading={approveZap.isLoading}
            fullWidth
            onClick={() =>
              approveZap.mutate(
                { spenderAddressMap: ZERO_EX_EXCHANGE_PROXY_ADDRESSES },
                {
                  onSuccess: () => {
                    setCurrentStep(4);
                    depositIntoVault();
                  },
                },
              )
            }
          >
            Approve {swapAssetType.name} for Swapping
          </PrimaryButton>
        </Box>
      ) : (
        <Box
          display="flex"
          gap="2px"
          alignItems="center"
          justifyContent="center"
          color={theme.colors.gray[40]}
          mt="18px"
        >
          {!needsToApproveProxy() && <CheckCircleOutline style={{ fontSize: "18px" }} viewBox="0 0 24 24" />} Approve
          Swapping {swapAssetType.name}
        </Box>
      )}
      {currentStep === 4 ? (
        <Box mt="18px">
          <PrimaryButton
            disabled={zeroExSwap.isLoading}
            loading={zeroExSwap.isLoading}
            fullWidth
            onClick={() => {
              depositIntoVault();
            }}
          >
            Zap Into {swapAssetType}
          </PrimaryButton>
        </Box>
      ) : (
        <Box
          display="flex"
          gap="2px"
          alignItems="center"
          justifyContent="center"
          color={theme.colors.gray[40]}
          mt="18px"
        >
          {currentStep > 4 && <CheckCircleOutline style={{ fontSize: "18px" }} viewBox="0 0 24 24" />} Zap into
          {vaultPairTokenName}
        </Box>
      )}
    </>
  );
};
