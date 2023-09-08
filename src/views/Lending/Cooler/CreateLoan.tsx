import { Box, Divider, SvgIcon } from "@mui/material";
import { Modal, OHMSwapCardProps, PrimaryButton, SwapCard, SwapCollection } from "@olympusdao/component-library";
import { SetStateAction, useState } from "react";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { COOLER_CLEARING_HOUSE_ADDRESSES } from "src/constants/addresses";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useCreateCooler } from "src/views/Lending/Cooler/hooks/useCreateCooler";
import { useCreateLoan } from "src/views/Lending/Cooler/hooks/useCreateLoan";

export const CreateLoan = ({
  collateralAddress,
  debtAddress,
  duration,
  interestRate,
  loanToCollateral,
  capacity,
  coolerAddress,
  factoryAddress,
  setModalOpen,
  modalOpen,
}: {
  collateralAddress: string;
  debtAddress: string;
  interestRate: string;
  duration: string;
  loanToCollateral: string;
  capacity: string;
  coolerAddress?: string;
  factoryAddress: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
}) => {
  const createCooler = useCreateCooler();
  const createLoan = useCreateLoan();
  const networks = useTestableNetworks();

  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + Number(duration || 0));

  const [debtAmount, setDebtAmount] = useState(0);
  const [collateralAmount, setCollateralAmount] = useState(0);
  const { data: collateralBalance } = useBalance({ [networks.MAINNET]: collateralAddress || "" })[networks.MAINNET];

  const collateralValue = Number(loanToCollateral) * Number(collateralBalance || 0);
  const maxYouCanBorrow = Math.min(Number(capacity), collateralValue);

  return (
    <Modal
      maxWidth="542px"
      minHeight="200px"
      open={modalOpen}
      headerContent={
        <Box display="flex" alignItems="center" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">Borrow DAI</Box>
        </Box>
      }
      onClose={() => setModalOpen(false)}
    >
      <>
        <SwapCollection
          UpperSwapCard={
            <AssetSwapCard
              assetAddress={collateralAddress}
              tokenName="gOHM"
              value={collateralAmount}
              onChange={(e: { target: { value: SetStateAction<number> } }) => {
                setCollateralAmount(e.target.value);
                setDebtAmount(Number(e.target.value) * Number(loanToCollateral));
              }}
            />
          }
          LowerSwapCard={
            <AssetSwapCard
              assetAddress={debtAddress}
              tokenName="DAI"
              value={debtAmount}
              onChange={(e: { target: { value: SetStateAction<number> } }) => {
                setDebtAmount(e.target.value);
                setCollateralAmount(Number(e.target.value) / Number(loanToCollateral));
              }}
            />
          }
        />
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Max you Can Borrow</Box>
          <Box fontWeight="500">{formatNumber(maxYouCanBorrow, 2)} DAI</Box>
        </Box>
        <Box mt="18px" mb="21px">
          <Divider />
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Interest rate</Box>
          <Box fontWeight="500">{interestRate}%</Box>
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Maturity Date</Box>
          <Box fontWeight="500">
            {maturityDate.toLocaleDateString([], {
              month: "long",
              day: "numeric",
              year: "numeric",
            }) || ""}{" "}
            {maturityDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Loan To Value per gOHM</Box>
          <Box fontWeight="500">{loanToCollateral} DAI</Box>
        </Box>
        <Box mt="18px" width="100%">
          <WalletConnectedGuard fullWidth>
            {!coolerAddress ? (
              <PrimaryButton
                fullWidth
                onClick={() =>
                  createCooler.mutate({
                    collateralAddress,
                    debtAddress,
                    factoryAddress,
                  })
                }
                loading={createCooler.isLoading}
                disabled={createCooler.isLoading || debtAmount > maxYouCanBorrow || debtAmount === 0}
              >
                {debtAmount > maxYouCanBorrow ? `Amount requested exceeds max` : `Create Cooler`}
              </PrimaryButton>
            ) : (
              <TokenAllowanceGuard
                tokenAddressMap={{ [networks.MAINNET]: collateralAddress }}
                spenderAddressMap={COOLER_CLEARING_HOUSE_ADDRESSES}
                isVertical
                message={
                  <>
                    First time borrowing with <b>gOHM</b>? <br /> Please approve Olympus DAO to use your <b>gOHM</b> for
                    borrowing.
                  </>
                }
                spendAmount={new DecimalBigNumber(collateralAmount.toString())}
              >
                <PrimaryButton
                  onClick={() => {
                    coolerAddress &&
                      createLoan.mutate(
                        {
                          coolerAddress,
                          borrowAmount: debtAmount,
                        },
                        {
                          onSuccess: () => {
                            setCollateralAmount(0);
                            setDebtAmount(0);
                            setModalOpen(false);
                          },
                        },
                      );
                  }}
                  disabled={debtAmount > maxYouCanBorrow || debtAmount === 0 || createLoan.isLoading}
                  loading={createLoan.isLoading}
                  fullWidth
                >
                  {debtAmount > maxYouCanBorrow ? `Amount requested exceeds max` : `Borrow DAI & Open Position`}
                </PrimaryButton>
              </TokenAllowanceGuard>
            )}
          </WalletConnectedGuard>
        </Box>
      </>
    </Modal>
  );
};

const AssetSwapCard = ({
  assetAddress,
  tokenName,
  value,
  onChange,
}: {
  assetAddress: string;
  tokenName: OHMSwapCardProps["token"];
  value: number | string;
  onChange: any;
}) => {
  const networks = useTestableNetworks();
  const { data: balance } = useBalance({ [networks.MAINNET]: assetAddress || "" })[networks.MAINNET];
  return (
    <SwapCard
      id={tokenName as string}
      token={tokenName}
      endString={`Balance: ${Number(balance?.toString() || "0").toFixed(4)} ${tokenName}`}
      value={value}
      onChange={onChange}
      endStringOnClick={() => onChange({ target: { value: Number(balance?.toString()) || 0 } })}
    />
  );
};
