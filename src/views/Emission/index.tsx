import { Box, Grid, Link, Typography } from "@mui/material";
import { Accordion, InfoNotification, Metric, Paper } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { useGetEmissionConfig } from "src/views/Emission/hooks/useGetEmissionConfig";

export const Emission = () => {
  const { data: emissionConfig, isLoading } = useGetEmissionConfig();

  // Calculate annualized growth rates
  const calculateAnnualizedRate = (dailyRate: number) => {
    if (dailyRate === 0) {
      return 0;
    }
    return (Math.pow(1 + dailyRate, 365) - 1) * 100;
  };

  // Parse the percentage strings into decimal numbers
  const parsePercentage = (percentStr: string | undefined) => {
    if (!percentStr) return undefined;
    return Number(percentStr.replace("%", "")) / 100;
  };

  const emissionRate = parsePercentage(emissionConfig?.currentEmissionRate);
  const premium = parsePercentage(emissionConfig?.premium);

  const supplyGrowthRate = emissionRate !== undefined ? calculateAnnualizedRate(emissionRate) : undefined;

  const treasuryGrowthRate =
    emissionRate !== undefined && premium !== undefined
      ? calculateAnnualizedRate(emissionRate * (1 + premium))
      : undefined;

  const backingGrowthRate =
    emissionRate && premium
      ? calculateAnnualizedRate((1 + emissionRate * (1 + premium)) / (1 + emissionRate) - 1)
      : undefined;

  return (
    <div id="stake-view">
      <PageTitle name={"Emission Manager"} noMargin />
      <Box width="97%" maxWidth="974px">
        {Boolean(emissionConfig?.activeMarketId) && (
          <Box mb="21px">
            <InfoNotification>
              <Typography>
                A bond market is currently active.{" "}
                <Link
                  component={RouterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  to={`https://app.bondprotocol.finance/#/market/1/${emissionConfig?.activeMarketId}`}
                >
                  View market details
                </Link>
              </Typography>
            </InfoNotification>
          </Box>
        )}
        <Paper enableBackground fullWidth>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Metric label="Base Emission Rate" metric={emissionConfig?.baseEmissionRate} isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Metric label="Premium" metric={emissionConfig?.premium} isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Metric
                label="Current Emission Rate"
                metric={emissionConfig?.currentEmissionRate}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Metric label="Current Emissions" metric={emissionConfig?.currentEmission} isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Metric label="Next Emission Rate" metric={emissionConfig?.nextSale.emissionRate} isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Metric label="Next Emission" metric={emissionConfig?.nextSale.emission} isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Metric
                label="Supply Growth Rate (Annual)"
                metric={supplyGrowthRate ? `${supplyGrowthRate.toFixed(2)}%` : "0%"}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Metric
                label="Treasury Growth Rate (Annual)"
                metric={treasuryGrowthRate ? `${treasuryGrowthRate.toFixed(2)}%` : "0%"}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Metric
                label="Backing Growth Rate (Annual)"
                metric={backingGrowthRate ? `${backingGrowthRate.toFixed(2)}%` : "0%"}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
        </Paper>

        <Accordion
          title="Contract Parameters"
          summary={
            <Box display="flex" alignItems="center" height="60px">
              <Typography fontWeight={600} fontSize="18px">
                Contract Parameters
              </Typography>
            </Box>
          }
          defaultExpanded={false}
        >
          {emissionConfig ? (
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Box display="flex" flexDirection="column" gap="9px">
                  <Typography fontWeight={600} fontSize="18px">
                    Parameters
                  </Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Vesting Period:</Typography>
                    <Typography>{emissionConfig.vestingPeriod}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Active Market ID:</Typography>
                    <Typography>{emissionConfig.activeMarketId}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Minimum Premium:</Typography>
                    <Typography>{emissionConfig.minimumPremium}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Backing:</Typography>
                    <Typography>{emissionConfig.backing}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Box display="flex" flexDirection="column" gap="9px">
                  <Typography fontWeight={600} fontSize="18px">
                    Contract Addresses
                  </Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Emissions Manager:</Typography>
                    <Link
                      component={RouterLink}
                      to={`https://etherscan.io/address/${emissionConfig.emissionsManagerAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{emissionConfig.emissionsManagerAddress}</Typography>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Price Address:</Typography>
                    <Link
                      component={RouterLink}
                      to={`https://etherscan.io/address/${emissionConfig.priceAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{emissionConfig.priceAddress}</Typography>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Roles Address:</Typography>
                    <Link
                      component={RouterLink}
                      to={`https://etherscan.io/address/${emissionConfig.rolesAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{emissionConfig.rolesAddress}</Typography>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Auctioneer Address:</Typography>
                    <Link
                      component={RouterLink}
                      to={`https://etherscan.io/address/${emissionConfig.auctioneerAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{emissionConfig.auctioneerAddress}</Typography>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Kernel Address:</Typography>
                    <Link
                      component={RouterLink}
                      to={`https://etherscan.io/address/${emissionConfig.kernelAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{emissionConfig.kernelAddress}</Typography>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Minter Address:</Typography>
                    <Link
                      component={RouterLink}
                      to={`https://etherscan.io/address/${emissionConfig.mintrAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{emissionConfig.mintrAddress}</Typography>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Reserve Address:</Typography>
                    <Link
                      component={RouterLink}
                      to={`https://etherscan.io/address/${emissionConfig.reserveAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{emissionConfig.reserveAddress}</Typography>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Teller Address:</Typography>
                    <Link
                      component={RouterLink}
                      to={`https://etherscan.io/address/${emissionConfig.tellerAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{emissionConfig.tellerAddress}</Typography>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>Treasury Address:</Typography>
                    <Link
                      component={RouterLink}
                      to={`https://etherscan.io/address/${emissionConfig.trsryAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{emissionConfig.trsryAddress}</Typography>
                    </Link>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
        </Accordion>
      </Box>
    </div>
  );
};
