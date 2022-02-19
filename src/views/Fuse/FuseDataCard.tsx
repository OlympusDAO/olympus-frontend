import { Box, Typography } from "@material-ui/core";
import { DataRow, InfoTooltip, Paper, TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { useCallback } from "react";

import { convertMantissaToAPY } from "../../fuse-sdk/helpers/apyUtils";
import { USDPricedFuseAsset } from "../../fuse-sdk/helpers/fetchFusePoolData";
import { Mode } from "../../fuse-sdk/helpers/fetchMaxAmount";
import { useTokenData } from "../../fuse-sdk/hooks/useTokenData";
import { formatCurrency } from "../../helpers";
import { shortUsdFormatter } from "./Fuse";

function FuseDataCard({
  asset,
  onClick,
}: {
  asset: USDPricedFuseAsset;
  onClick: (asset: USDPricedFuseAsset, mode: Mode) => void;
}) {
  const tokenData = useTokenData(asset.underlyingToken);

  const supplyAPY = convertMantissaToAPY(asset.supplyRatePerBlock, 365);
  const borrowAPR = convertMantissaToAPY(asset.borrowRatePerBlock, 365);

  const handleSupplyClick = useCallback(() => onClick(asset, Mode.SUPPLY), [asset, onClick]);
  const handleBorrowClick = useCallback(() => onClick(asset, Mode.BORROW), [asset, onClick]);

  return (
    <Paper>
      <div className="fuse-pair">
        {/* @ts-ignore TODO */}
        <TokenStack token={asset.underlyingToken} />
        <div className="fuse-name">
          <Typography>{asset.underlyingName}</Typography>
        </div>
      </div>
      <DataRow
        title="APY/LTV"
        balance={
          <>
            {`${supplyAPY.toFixed(2)}%/${asset.collateralFactor / 1e16}% LTV`}
            <InfoTooltip
              message={`The Collateral Factor (CF) ratio defines the maximum amount of tokens in the pool that can be borrowed with a specific collateral. It’s expressed in percentage: if in a pool ETH has 75% LTV, for every 1 ETH worth of collateral, borrowers will be able to borrow 0.75 ETH worth of other tokens in the pool.`}
            ></InfoTooltip>
          </>
        }
      />
      <DataRow
        title="APR/TVL"
        balance={
          asset.isPaused ? (
            "-"
          ) : (
            <>
              {`${borrowAPR.toFixed(2)}%/${shortUsdFormatter(asset.totalSupplyUSD)} TVL`}
              <InfoTooltip
                message={`Total Value Lent (TVL) measures how much of this asset has been supplied in total. TVL does not account for how much of the lent assets have been borrowed, use 'liquidity' to determine the total unborrowed assets lent.`}
              ></InfoTooltip>
            </>
          )
        }
      />
      <DataRow
        title="Supply balance"
        balance={`${formatCurrency(asset.supplyBalanceUSD, 2)} ${formatCurrency(
          asset.supplyBalance / 10 ** asset.underlyingDecimals,
          2,
        ).replace("$", "")} ${tokenData?.extraData?.shortName ?? tokenData?.symbol ?? asset.underlyingSymbol}`}
      />
      <DataRow
        title="Borrow balance"
        balance={`${formatCurrency(asset.borrowBalanceUSD, 2)} ${formatCurrency(
          asset.borrowBalance / 10 ** asset.underlyingDecimals,
          2,
        ).replace("$", "")} ${tokenData?.extraData?.shortName ?? tokenData?.symbol ?? asset.underlyingSymbol}`}
      />
      <DataRow
        title="Liquidity"
        balance={
          <>
            {`${shortUsdFormatter(asset.liquidityUSD)} ${shortUsdFormatter(
              asset.liquidity / 10 ** asset.underlyingDecimals,
            ).replace("$", "")} ${tokenData?.symbol}`}
            <InfoTooltip
              message={`Liquidity is the amount of this asset that is available to borrow (unborrowed). To see how much has been supplied and borrowed in total, navigate to the Pool Info tab.`}
            />
          </>
        }
      />
      <Box display="flex" justifyContent="space-between" className="fuse-buttons">
        <TertiaryButton fullWidth onClick={handleSupplyClick}>
          Supply
        </TertiaryButton>
        <TertiaryButton fullWidth onClick={handleBorrowClick} disabled={asset.isPaused}>
          Borrow
        </TertiaryButton>
      </Box>
    </Paper>
  );
}

export default FuseDataCard;
