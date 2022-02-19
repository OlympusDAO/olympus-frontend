import { Box, CircularProgress, Grid, Select, Typography, useTheme } from "@material-ui/core";
import { Paper } from "@olympusdao/component-library";
import { useState } from "react";
import { useQuery } from "react-query";
import { Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip } from "recharts";

import { USDPricedFuseAsset } from "../../fuse-sdk/helpers/fetchFusePoolData";
import { useRari } from "../../fuse-sdk/helpers/RariContext";
import { useTokenData } from "../../fuse-sdk/hooks/useTokenData";
import JumpRateModel from "../../fuse-sdk/irm/JumpRateModel";

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (active) {
    const borrow = payload[0].payload.borrow;
    const supply = payload[1].payload.supply;
    return (
      <Paper className="tooltip-container">
        <Typography className="item" variant="body2">{`${
          borrow.toString() === "0" ? "0%" : ((supply / borrow) * 100).toFixed(2)
        }% Utilization`}</Typography>
        <Box display="flex" justifyContent="space-between" className="item">
          <Typography variant="body2">Borrow rate:</Typography>
          <Typography variant="body2">{`${borrow.toFixed(1)}%`}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" className="item">
          <Typography variant="body2">Deposit rate:</Typography>
          <Typography variant="body2">{`${supply.toFixed(1)}%`}</Typography>
        </Box>
      </Paper>
    );
  }

  return null;
};

export function AssetAndOtherInfo({ assets }: { assets: USDPricedFuseAsset[] }) {
  const { fuse } = useRari();
  const [selectedAsset, setSelectedAsset] = useState(assets.length > 3 ? assets[2] : assets[0]);
  const selectedTokenData = useTokenData(selectedAsset.underlyingToken);
  const selectedAssetUtilization =
    selectedAsset.totalSupply == 0
      ? 0
      : parseFloat(
          // Use Max.min() to cap util at 100%
          Math.min((selectedAsset.totalBorrow / selectedAsset.totalSupply) * 100, 100).toFixed(0),
        );
  const { data } = useQuery(selectedAsset.cToken + " curves", async () => {
    const interestRateModel = await fuse.getInterestRateModel(selectedAsset.cToken);
    if (interestRateModel === null) {
      return { borrowerRates: null, supplierRates: null, data: [] };
    }
    return convertIRMtoCurve(interestRateModel);
  });

  const theme = useTheme();

  const borrowLineColor = theme.palette.type === "light" ? "#2D3748" : "#fff";
  const currentUtilizationColor = theme.palette.type === "light" ? "#a0a0a0" : "#fff";

  return (
    <>
      <div style={{ marginBottom: 15 }}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h3">Stats</Typography>
          </Grid>
          <Grid item>
            <Select
              native
              style={{ width: "130px" }}
              onChange={event => setSelectedAsset(assets.find(asset => asset.cToken === event.target.value)!)}
              value={selectedAsset.cToken}
            >
              {assets.map(asset => (
                <AssetOption asset={asset} key={asset.cToken} />
              ))}
            </Select>
          </Grid>
        </Grid>
      </div>
      {data ? (
        data.data === null ? (
          <h4>No graph is available for this asset's interest curves.</h4>
        ) : (
          <ResponsiveContainer minWidth={300} minHeight={200}>
            <LineChart data={data.data}>
              <Tooltip content={props => <CustomTooltip {...props} />} />
              <Line type="monotone" dataKey={"borrow"} dot={false} strokeWidth={3} stroke={borrowLineColor} />
              <Line
                type="monotone"
                dataKey={"supply"}
                dot={false}
                strokeWidth={3}
                stroke={selectedTokenData?.color || "#A6A6A6"}
              />

              <ReferenceLine
                x={selectedAssetUtilization}
                label={{ value: "Current Utilization", fill: currentUtilizationColor, position: "insideTop" }}
                stroke={currentUtilizationColor}
                strokeDasharray="3 3"
              />
              <ReferenceDot
                r={4}
                x={selectedAssetUtilization}
                y={data.data[selectedAssetUtilization].borrow}
                stroke={borrowLineColor}
                fill={borrowLineColor}
              />
              <ReferenceDot
                r={4}
                x={selectedAssetUtilization}
                y={data.data[selectedAssetUtilization].supply}
                stroke={selectedTokenData?.color || "#A6A6A6"}
                fill={selectedTokenData?.color || "#A6A6A6"}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      )}
    </>
  );
}

function AssetOption({ asset }: { asset: USDPricedFuseAsset }) {
  const tokenData = useTokenData(asset.underlyingToken);
  return (
    <option value={asset.cToken} key={asset.cToken}>
      {tokenData?.symbol ?? asset.underlyingSymbol}
    </option>
  );
}

export const convertIRMtoCurve = (interestRateModel: JumpRateModel) => {
  const borrowerRates = [];
  const supplierRates = [];
  const data = [];
  // TODO Get chain Id
  const blocksPerMin = 4;

  for (let i = 0; i <= 100; i++) {
    const supplyLevel =
      (Math.pow((interestRateModel.getSupplyRate(i * 1e16) / 1e18) * (blocksPerMin * 60 * 24) + 1, 365) - 1) * 100;

    const borrowLevel =
      (Math.pow((interestRateModel.getBorrowRate(i * 1e16) / 1e18) * (blocksPerMin * 60 * 24) + 1, 365) - 1) * 100;

    supplierRates.push({ x: i, y: supplyLevel });
    borrowerRates.push({ x: i, y: borrowLevel });
    data.push({ borrow: borrowLevel, supply: supplyLevel });
  }

  return { borrowerRates, supplierRates, data };
};
