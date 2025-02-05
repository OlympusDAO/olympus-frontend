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
  Typography,
} from "@mui/material";
import { OHMTokenProps, PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useMemo, useState } from "react";
import usdsIcon from "src/assets/tokens/usds.svg?react";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { CreateOrRepayLoanV2 } from "src/views/Lending/CoolerV2/components/CreateOrRepayLoanV2";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

export const MonoCoolerPositions = () => {
  const { data: position } = useMonoCoolerPosition();
  const [createLoanModalOpen, setCreateLoanModalOpen] = useState(false);
  const [isRepayMode, setIsRepayMode] = useState(false);

  // Calculate how much collateral can be withdrawn
  const withdrawableCollateral = useMemo(() => {
    if (!position) return new DecimalBigNumber("0", 18);

    // If there's no debt, all collateral can be withdrawn
    if (position.currentDebt.eq(0)) {
      return new DecimalBigNumber(position.collateral.toString(), 18);
    }

    // Calculate minimum collateral needed for current debt
    const minCollateralNeeded = new DecimalBigNumber(position.currentDebt.toString(), 18).div(
      new DecimalBigNumber(position.maxOriginationLtv.toString(), 18),
    );

    const currentCollateral = new DecimalBigNumber(position.collateral.toString(), 18);

    // If we have more than minimum needed, the excess can be withdrawn
    if (currentCollateral.gt(minCollateralNeeded)) {
      return currentCollateral.sub(minCollateralNeeded);
    }

    return new DecimalBigNumber("0", 18);
  }, [position]);

  if (!position) return null;

  const hasActivePosition = position.collateral.gt(0);

  if (!hasActivePosition) {
    return (
      <>
        <Box mb="21px" mt="33px">
          <Typography variant="h2">MonoCooler Position</Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <Box textAlign="center">
            <Typography variant="h6" mb={2}>
              You don't have any active positions
            </Typography>
            <PrimaryButton
              onClick={() => {
                setIsRepayMode(false);
                setCreateLoanModalOpen(true);
              }}
            >
              Create Position
            </PrimaryButton>
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

  return (
    <>
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
                Liquidation Threshold
              </TableCell>
              <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row" sx={{ padding: "9px" }}>
                <Box display="flex" alignItems="center" gap="3px">
                  {parseFloat(ethers.utils.formatUnits(position.collateral)).toFixed(4)} {position.collateralAssetName}
                  <Token name={position.collateralAssetName as OHMTokenProps["name"]} style={{ fontSize: "21px" }} />
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ padding: "9px" }}>
                {(Number(position.interestRateBps) / 100).toFixed(2)}%
              </TableCell>
              <TableCell align="right" sx={{ padding: "9px" }}>
                <Box display="flex" justifyContent="end" alignItems="center" gap="3px">
                  {parseFloat(ethers.utils.formatUnits(position.currentDebt)).toFixed(2)} {position.debtAssetName}
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
                <Box display="flex" justifyContent="end" alignItems="center" gap="3px">
                  {parseFloat(ethers.utils.formatUnits(position.liquidationDebtAmount)).toFixed(2)}{" "}
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
                  {position.currentDebt.gt(0) && (
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
};
