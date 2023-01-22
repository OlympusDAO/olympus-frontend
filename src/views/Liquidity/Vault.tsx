import { ArrowBack } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import {
  DataRow,
  InfoNotification,
  Metric,
  MetricCollection,
  SwapCard,
  SwapCollection,
  TokenStack,
} from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";

export const Vault = () => (
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

            <TokenStack tokens={["wETH", "OHM"]} sx={{ fontSize: "27px" }} />
            <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
              <Typography variant="h4" fontWeight={500}>
                stETH-OHM LP
              </Typography>
            </Box>
          </Box>
        }
      ></PageTitle>
      <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
        <Box display="flex" flexDirection="column" width="100%" maxWidth="900px" mb="28px">
          <MetricCollection>
            <Metric label="First Metric" metric="1" />
            <Metric label="First Metric" metric="1" />
            <Metric label="First Metric" metric="1" />
          </MetricCollection>
        </Box>
      </Box>
    </Box>
    <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
      <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
        <SwapCollection
          UpperSwapCard={<SwapCard id={""} token="wETH" tokenName="stETH" info="Balance: 0" />}
          LowerSwapCard={
            <SwapCard
              id={""}
              token={<TokenStack tokens={["ETH", "OHM"]} sx={{ fontSize: "21px" }} />}
              tokenName="stETH-OHM LP"
              info="Balance: 0"
            />
          }
        />
        <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
          <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
            <Box mt="12px">
              <InfoNotification dismissible>
                <Typography>
                  First time adding Liquidity with <strong>stETH?</strong>
                </Typography>
                <Typography>
                  Please approve Olympus DAO to use your <strong>stETH</strong> for depositing.
                </Typography>
              </InfoNotification>
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
          <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
            <Box mt="12px">
              <InfoNotification dismissible>
                <Typography>
                  By depositing stETH into an AMO pools, you are not guaranteed to get back the exact same amount of
                  deposit tokens at time of withdraw and your position will be exposed to impermanent loss.
                </Typography>
              </InfoNotification>
              <DataRow title="Slippage Tolerance" balance="0.00" />
              <DataRow title="OHM Minted" balance="0.00" />
              <DataRow title="Your LP Tokens" balance="0.00" />
              <DataRow title="Max You Can Deposit" balance="0.00" />
              <DataRow title="Fee" balance="0.00" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  </>
);
