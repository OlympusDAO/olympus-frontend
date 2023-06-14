import { CheckCircleOutline } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { Modal, OHMTokenStackProps, PrimaryButton, TokenStack } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useApproveToken } from "src/components/TokenAllowanceGuard/hooks/useApproveToken";
import { AddressMap } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { useCreateUserVault } from "src/views/Liquidity/hooks/useCreateUserVault";
import { useDepositLiqudiity } from "src/views/Liquidity/hooks/useDepositLiquidity";
import { ZapSteps } from "src/views/Liquidity/ZapSteps";
import { ModalHandleSelectProps } from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import { useNetwork } from "wagmi";

interface DepositSteps {
  vaultDepositTokenAddressMap: AddressMap;
  vaultManagerAddress: string;
  userVault?: string;
  zapIntoAddress?: string;
  pairAmount: string;
  minLpAmount: DecimalBigNumber;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  slippage?: string;
  swapAssetType?: ModalHandleSelectProps;
  vaultPairTokenName: string;
}
export const DepositSteps = ({
  userVault,
  vaultDepositTokenAddressMap,
  vaultManagerAddress,
  zapIntoAddress,
  pairAmount,
  minLpAmount,
  setIsOpen,
  isOpen,
  slippage,
  swapAssetType,
  vaultPairTokenName,
}: DepositSteps) => {
  const createUserVault = useCreateUserVault();
  const { chain = { id: 1 } } = useNetwork();
  const [currentStep, setCurrentStep] = useState(0);
  const deposit = useDepositLiqudiity();
  const networks = useTestableNetworks();
  const theme = useTheme();
  const [depositAmountFromZap, setDepositAmountFromZap] = useState<string | undefined>();
  const { data: balance = new DecimalBigNumber("0") } = useBalance(vaultDepositTokenAddressMap)[
    chain.id as keyof typeof vaultDepositTokenAddressMap
  ] || { data: new DecimalBigNumber("0") };

  const approveDepositVault = useApproveToken(vaultDepositTokenAddressMap);
  const { data: allowanceDepositToken, isLoading: allowanceIsLoading } = useContractAllowance(
    vaultDepositTokenAddressMap,
    {
      [networks.MAINNET]: userVault,
    },
  );
  const hasUserVault = userVault && userVault != ethers.constants.AddressZero;
  useEffect(() => {
    if (currentStep === 0) {
      if (hasUserVault) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
    if (currentStep === 1) {
      createUserVault.mutate({ address: vaultManagerAddress }, { onSuccess: () => setCurrentStep(2) });
    }

    if (currentStep === 5) {
      if (userVault) {
        deposit.mutate(
          {
            amount: pairAmount,
            minLpAmount: minLpAmount,
            address: userVault,
          },
          {
            onSuccess: () => {
              setIsOpen(false);
            },
          },
        );
      }
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 2 && !allowanceIsLoading && hasUserVault) {
      if (needsToApproveDepositVault()) {
        const depositTokenAddress = vaultDepositTokenAddressMap[chain.id as NetworkId];
        if (depositTokenAddress) {
          approveDepositVault.mutate(
            {
              spenderAddressMap: {
                [networks.MAINNET]: userVault,
              },
            },
            {
              onSuccess: () => (zapIntoAddress ? setCurrentStep(3) : setCurrentStep(5)),
            },
          );
        }
      } else {
        zapIntoAddress ? setCurrentStep(3) : setCurrentStep(5);
      }
    }
  }, [currentStep, allowanceIsLoading, hasUserVault]);

  const needsToApproveDepositVault = () => {
    const needsApproval =
      (allowanceDepositToken &&
        allowanceDepositToken.eq(0) &&
        vaultDepositTokenAddressMap[chain.id as NetworkId] !== ethers.constants.AddressZero) ||
      (allowanceDepositToken && allowanceDepositToken.lt(balance.toBigNumber()))
        ? true
        : false;

    return needsApproval;
  };

  //CREATE VAULT - step 1
  //APPROVE Deposit VAULT - step 2
  //APPROVE ZAP - ZAP ONLY - step 3
  //SWAP FOR VAULT - ZAP ONLY - step 4
  //DEPOSIT VAULT - step 5

  return (
    <Modal
      open={isOpen}
      maxWidth="542px"
      minHeight="200px"
      headerContent={
        <Box display="flex" flexDirection="row" gap="6px" alignItems="center">
          <TokenStack tokens={["wsETH" as keyof OHMTokenStackProps["tokens"]]} sx={{ fontSize: "27px" }} />
          <Typography fontWeight="500">Confirming Transactions</Typography>
        </Box>
      }
      onClose={() => setIsOpen(false)}
    >
      <Box display="flex" flexDirection="column">
        {currentStep === 1 ? (
          <PrimaryButton
            disabled={currentStep !== 1 || createUserVault.isLoading}
            loading={createUserVault.isLoading}
            onClick={() => {
              createUserVault.mutate({ address: vaultManagerAddress }, { onSuccess: () => setCurrentStep(2) });
            }}
          >
            Create Vault
          </PrimaryButton>
        ) : (
          <Box
            display="flex"
            gap="2px"
            alignItems="center"
            justifyContent="center"
            color={theme.colors.gray[40]}
            mt="18px"
          >
            {hasUserVault && <CheckCircleOutline style={{ fontSize: "18px" }} viewBox="0 0 24 24" />} Create Vault
          </Box>
        )}
        {currentStep === 2 ? (
          <Box mt="18px">
            <PrimaryButton
              disabled={currentStep !== 2 || approveDepositVault.isLoading}
              loading={approveDepositVault.isLoading}
              onClick={() => {
                approveDepositVault.mutate(
                  {
                    spenderAddressMap: {
                      [networks.MAINNET]: userVault,
                    },
                  },
                  { onSuccess: () => (zapIntoAddress ? setCurrentStep(3) : setCurrentStep(5)) },
                );
              }}
              fullWidth
            >
              Approve Depositing {vaultPairTokenName} to Vault
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
            {!needsToApproveDepositVault() && <CheckCircleOutline style={{ fontSize: "18px" }} viewBox="0 0 24 24" />}{" "}
            Approve Depositing {vaultPairTokenName} to Vault
          </Box>
        )}
        <>
          {zapIntoAddress && slippage && swapAssetType && (
            <ZapSteps
              zapIntoAddress={zapIntoAddress}
              slippage={slippage}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              setDepositAmountFromZap={setDepositAmountFromZap}
              swapAmount={pairAmount}
              swapAssetType={swapAssetType}
              vaultPairTokenName={vaultPairTokenName}
            />
          )}
        </>
        {currentStep === 5 ? (
          <PrimaryButton
            loading={deposit.isLoading}
            disabled={currentStep !== 5 || deposit.isLoading}
            onClick={() => {
              userVault &&
                deposit.mutate(
                  {
                    amount: depositAmountFromZap || pairAmount,
                    minLpAmount: minLpAmount,
                    address: userVault,
                  },
                  {
                    onSuccess: () => {
                      setIsOpen(false);
                    },
                  },
                );
            }}
          >
            Deposit {vaultPairTokenName} to Vault
          </PrimaryButton>
        ) : (
          <Box
            display="flex"
            gap="2px"
            alignItems="center"
            justifyContent="center"
            color={theme.colors.gray[40]}
            mt="18px"
          >
            Deposit {vaultPairTokenName} to Vault
          </Box>
        )}
      </Box>
    </Modal>
  );
};
