import {
  Box,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { OHMTokenProps, PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import usdsIcon from "src/assets/tokens/usds.svg?react";
import { formatNumber } from "src/helpers";
import { CreateOrRepayLoanV2 } from "src/views/Lending/CoolerV2/components/CreateOrRepayLoanV2";
import { useMonoCoolerCalculations } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerCalculations";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

export const MonoCoolerPositions = ({
  consolidateButton,
  v1Loans,
}: {
  consolidateButton: React.ReactNode;
  v1Loans: boolean;
}) => {
  const { data: position } = useMonoCoolerPosition();
  const { additionalBorrowingAvailable } = useMonoCoolerCalculations({
    loan: {
      debt: position?.currentDebt || BigNumber.from("0"),
      collateral: position?.collateral || BigNumber.from("0"),
    },
    isRepayMode: false,
  });
  const [createLoanModalOpen, setCreateLoanModalOpen] = useState(false);
  const [isRepayMode, setIsRepayMode] = useState(false);

  if (!position) return <>hi</>;

  const hasActivePosition = position.collateral.gt(0);
  console.log({ position, hasActivePosition });

  if (!hasActivePosition && position.isEnabled) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <Box textAlign="center">
            {!v1Loans && (
              <Typography variant="h6" mb={2}>
                You currently have no Cooler loans
              </Typography>
            )}
            <Box display="flex" gap={1} alignItems="center" justifyContent="center">
              <PrimaryButton
                onClick={() => {
                  setIsRepayMode(false);
                  setCreateLoanModalOpen(true);
                }}
              >
                Borrow USDS & Open Position
              </PrimaryButton>
              {consolidateButton}
            </Box>
          </Box>
        </Box>
        {createLoanModalOpen && (
          <CreateOrRepayLoanV2
            setModalOpen={setCreateLoanModalOpen}
            modalOpen={createLoanModalOpen}
            isRepayMode={isRepayMode}
          />
        )}
      </>
    );
  }

  if (hasActivePosition) {
    return (
      <>
        <Box mb="21px" mt="33px">
          <Typography variant="h2">V2 Cooler Loans</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="monocooler position">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "15px", padding: "9px" }}>Collateral</TableCell>
                <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                  Interest Rate
                </TableCell>
                <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                  Current Debt
                </TableCell>
                <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                  Buffer To Liquidation
                </TableCell>
                <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
                  Available Borrowing
                </TableCell>
                <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ padding: "9px" }}>
                  <Box display="flex" alignItems="center" gap="3px">
                    {formatNumber(Number(ethers.utils.formatUnits(position.collateral)), 4)}{" "}
                    {position.collateralAssetName}
                    <Token name={position.collateralAssetName as OHMTokenProps["name"]} style={{ fontSize: "21px" }} />
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ padding: "9px" }}>
                  {(Number(position.interestRateBps) / 100).toFixed(2)}%
                </TableCell>
                <TableCell align="right" sx={{ padding: "9px" }}>
                  <Box display="flex" justifyContent="end" alignItems="center" gap="3px">
                    {formatNumber(Number(ethers.utils.formatUnits(position.currentDebt)))} {position.debtAssetName}
                    {position.debtAssetName === "USDS" ? (
                      <SvgIcon
                        color="primary"
                        sx={{ width: "20px", height: "20px" }}
                        viewBox="0 0 50 50"
                        component={usdsIcon}
                      />
                    ) : (
                      <Token name={position.debtAssetName as OHMTokenProps["name"]} style={{ fontSize: "21px" }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ padding: "9px" }}>
                  <Tooltip
                    title={
                      position.projectedLiquidationDate
                        ? `Your position is projected to be liquidated on ${position.projectedLiquidationDate.toLocaleString()}`
                        : "Your position is currently healthy"
                    }
                  >
                    <Box display="flex" justifyContent="end" alignItems="center" gap="3px">
                      {formatNumber(Number(ethers.utils.formatUnits(position.liquidationDebtAmount)))}{" "}
                      {position.debtAssetName}
                      {position.debtAssetName === "USDS" ? (
                        <SvgIcon
                          color="primary"
                          sx={{ width: "20px", height: "20px" }}
                          viewBox="0 0 50 50"
                          component={usdsIcon}
                        />
                      ) : (
                        <Token name={position.debtAssetName as OHMTokenProps["name"]} style={{ fontSize: "21px" }} />
                      )}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell align="right" sx={{ padding: "9px" }}>
                  <Box display="flex" justifyContent="end" alignItems="center" gap="3px">
                    {formatNumber(Number(additionalBorrowingAvailable.toString()))} USDS
                    {position.debtAssetName === "USDS" ? (
                      <SvgIcon
                        color="primary"
                        sx={{ width: "20px", height: "20px" }}
                        viewBox="0 0 50 50"
                        component={usdsIcon}
                      />
                    ) : (
                      <Token name={position.debtAssetName as OHMTokenProps["name"]} style={{ fontSize: "21px" }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ padding: "9px" }}>
                  <Box display="flex" gap={1}>
                    <PrimaryButton
                      onClick={() => {
                        setIsRepayMode(false);
                        setCreateLoanModalOpen(true);
                      }}
                    >
                      Borrow More
                    </PrimaryButton>
                    {(position.currentDebt.gt(0) || position.collateral.gt(0)) && (
                      <SecondaryButton
                        onClick={() => {
                          setIsRepayMode(true);
                          setCreateLoanModalOpen(true);
                        }}
                      >
                        Repay
                      </SecondaryButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <Box textAlign="center">{consolidateButton}</Box>
        </Box>

        {createLoanModalOpen && (
          <CreateOrRepayLoanV2
            setModalOpen={setCreateLoanModalOpen}
            modalOpen={createLoanModalOpen}
            loan={{
              debt: position.currentDebt,
              collateral: position.collateral,
            }}
            isRepayMode={isRepayMode}
          />
        )}
      </>
    );
  }

  return null;
};
