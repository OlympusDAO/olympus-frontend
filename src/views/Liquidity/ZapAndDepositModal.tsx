import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { Modal, OHMTokenStackProps, PrimaryButton, TokenStack } from "@olympusdao/component-library";
import { ContractReceipt, ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useApproveToken } from "src/components/TokenAllowanceGuard/hooks/useApproveToken";
import { AddressMap } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { useZeroExSwap } from "src/hooks/useZeroExSwap";
import { NetworkId } from "src/networkDetails";
import { ZeroEx__factory } from "src/typechain";
import { TransformedERC20EventObject } from "src/typechain/ZeroEx";
import { useDepositLiqudiity } from "src/views/Liquidity/hooks/useDepositLiquidity";
import { ModalHandleSelectProps } from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import { useNetwork } from "wagmi";

export const ZapAndDepositModal = ({
  vaultDepositTokenAddressMap,
  vaultSpenderAddressMap,
  isOpen,
  setIsOpen,
  swapAssetType,
  swapAmount,
  buyAddress,
  vaultAddress,
  minLpAmount,
  slippage,
}: {
  vaultDepositTokenAddressMap: AddressMap;
  vaultSpenderAddressMap: AddressMap;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  swapAssetType: ModalHandleSelectProps;
  swapAmount: string;
  buyAddress: string;
  vaultAddress: string;
  minLpAmount: DecimalBigNumber;
  slippage: string;
}) => {
  const { chain = { id: 1 } } = useNetwork();
  const [step, setCurrentStep] = useState(0);
  const theme = useTheme();
  const { data: balance = new DecimalBigNumber("0") } = useBalance(vaultDepositTokenAddressMap)[
    chain.id as keyof typeof vaultDepositTokenAddressMap
  ] || { data: new DecimalBigNumber("0") };
  const approveMutation = useApproveToken(vaultDepositTokenAddressMap, vaultSpenderAddressMap);
  const { data: allowance } = useContractAllowance(vaultDepositTokenAddressMap, vaultSpenderAddressMap);
  const zeroExSwap = useZeroExSwap();
  const deposit = useDepositLiqudiity();

  //Fire the swap mutation when the modal loads.
  useEffect(() => {
    stepZero();
  }, [swapAssetType]);

  const stepZero = () => {
    zeroExSwap.mutate(
      {
        slippage: slippage,
        sellAmount: parseUnits(swapAmount, swapAssetType.decimals),
        tokenAddress: swapAssetType.address || "",
        buyAddress,
      },
      {
        onSuccess: async data => {
          const needsApproval = needsToApproveVault();

          if (needsApproval) {
            setCurrentStep(1);
            approveMutation.mutate(undefined, {
              onSuccess: async () => {
                setCurrentStep(2);
                depositIntoVault(data);
              },
            });
          } else {
            setCurrentStep(2);
            const test = await depositIntoVault(data);
          }
        },
      },
    );
  };

  const needsToApproveVault = () => {
    const needsApproval =
      (allowance &&
        allowance.eq(0) &&
        vaultDepositTokenAddressMap[chain.id as NetworkId] !== ethers.constants.AddressZero) ||
      (allowance && allowance.lt(balance.toBigNumber()))
        ? true
        : false;

    return needsApproval;
  };

  const depositIntoVault = async (data: ContractReceipt) => {
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
      return deposit.mutate(
        {
          amount: formatUnits(decoded.outputTokenAmount, 18),
          address: vaultAddress,
          minLpAmount: minLpAmount,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        },
      );
    }
  };

  return (
    <Modal
      maxWidth="542px"
      minHeight="200px"
      open={isOpen}
      headerContent={
        <Box display="flex" flexDirection="row" gap="6px" alignItems="center">
          <TokenStack tokens={["wsETH" as keyof OHMTokenStackProps["tokens"]]} sx={{ fontSize: "27px" }} />
          <Typography fontWeight="500">Zapping to</Typography>
        </Box>
      }
      onClose={() => setIsOpen(false)}
    >
      <>
        <Box textAlign="center">
          {step === 0 ? (
            <PrimaryButton
              fullWidth
              disabled={zeroExSwap.isLoading}
              loading={zeroExSwap.isLoading}
              onClick={() => stepZero()}
            >
              Zapping to wsETH
            </PrimaryButton>
          ) : (
            <Typography color={theme.colors.gray[40]} mt="18px">
              Zapping to wsETH
            </Typography>
          )}
          {step === 1 ? (
            <PrimaryButton fullWidth disabled={approveMutation.isLoading} loading={approveMutation.isLoading}>
              Approving Vault Deposit Contract
            </PrimaryButton>
          ) : (
            <Typography color={theme.colors.gray[40]} mt="18px">
              Approving Vault Deposit Contract
            </Typography>
          )}
          {step === 2 ? (
            <PrimaryButton fullWidth disabled={deposit.isLoading} loading={deposit.isLoading}>
              Confirming Deposit to Vault
            </PrimaryButton>
          ) : (
            <Typography color={theme.colors.gray[40]} mt="18px">
              Confirming Deposit to Vault
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" gap="25px"></Box>
      </>
    </Modal>
  );
};
