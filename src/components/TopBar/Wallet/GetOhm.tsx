import { Box, Fade, Grid, SvgIcon, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GetOnButton, ItemCard, OHMTokenProps, OHMTokenStackProps } from "@olympusdao/component-library";
import { FC } from "react";
import { ReactComponent as balancerIcon } from "src/assets/balancer.svg";
import sushiswapImg from "src/assets/sushiswap.png";
import uniswapImg from "src/assets/uniswap.png";
import { OHM_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, formatNumber, trim } from "src/helpers";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { defiLlamaChainToNetwork } from "src/helpers/defiLlamaChainToNetwork";
import { normalizeSymbol } from "src/helpers/normalizeSymbol";
import { prettifySecondsInDays } from "src/helpers/timeUtil";
import { useGetLPStats } from "src/hooks/useGetLPStats";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { NetworkId } from "src/networkDetails";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";
import { useNetwork } from "wagmi";
const PREFIX = "GetOhm";

const classes = {
  title: `${PREFIX}-title`,
};

const StyledBox = styled(Box)(() => ({
  [`& .${classes.title}`]: {
    lineHeight: "24px",
    fontWeight: 600,
    marginBottom: "12px",
    marginTop: "30px",
  },
}));

/**
 * Component for Displaying GetOhm
 */
const GetOhm: FC = () => {
  const { chain = { id: 1 } } = useNetwork();
  const { data: rebaseRate = 0 } = useStakingRebaseRate();

  const bonds = useLiveBonds().data;
  const fiveDayRate = Math.pow(1 + rebaseRate, 5 * 3) - 1;
  const { data: defiLlamaPools } = useGetLPStats();

  return (
    <Fade in={true}>
      <StyledBox>
        <Typography variant="h6" className={classes.title}>
          Exchanges
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <GetOnButton
              href={`https://app.balancer.fi/#/trade/`}
              logo={<SvgIcon component={balancerIcon} style={{ fontSize: "45px" }} />}
              exchangeName="Balancer"
            />
          </Grid>
          <Grid item xs={6}>
            <GetOnButton
              href={`https://app.sushi.com/swap/?outputCurrency=${OHM_ADDRESSES[NetworkId.MAINNET]}`}
              logo={<img src={sushiswapImg}></img>}
              exchangeName="Sushiswap"
            />
          </Grid>
          <Grid item xs={6}>
            <GetOnButton
              href={`https://app.uniswap.org/#/swap?outputCurrency=${OHM_ADDRESSES[NetworkId.MAINNET]}`}
              logo={<img src={uniswapImg}></img>}
              exchangeName="Uniswap"
            />
          </Grid>
        </Grid>
        {NetworkId.MAINNET === chain.id && (
          <>
            <Typography variant="h6" className={classes.title}>
              Zap
            </Typography>
            <ItemCard
              tokens={["wETH", "wBTC", "USDC", "DAI"]}
              title={`Zap with more assets`}
              href={`/stake`}
              disableFlip
            />
            <Typography variant="h6" className={classes.title}>
              Bonds
            </Typography>
            {bonds &&
              sortByDiscount(bonds).map(bond => (
                <ItemCard
                  key={bond.id}
                  tokens={bond.quoteToken.icons}
                  value={`$${bond.price.inUsd.toString({ decimals: 2, trim: false })}`}
                  roi={`${bond.discount.mul(new DecimalBigNumber("100")).toString({ decimals: 2, trim: false })}%`}
                  days={prettifySecondsInDays(bond.duration)}
                  href={`/bonds/${bond.id}`}
                  hrefText={`Bond ${bond.quoteToken.name}`}
                />
              ))}
            <Typography variant="h6" className={classes.title}>
              Stake
            </Typography>
            <ItemCard
              tokens={["sOHM", "wsOHM"]}
              title={`Stake Now`}
              roi={`${trim(Number(fiveDayRate) * 100, 2)}%`}
              days={`5 Days`}
              href={`/stake`}
              disableFlip
            />
          </>
        )}
        <Typography variant="h6" className={classes.title}>
          Farm Pool
        </Typography>
        {defiLlamaPools &&
          defiLlamaPools.map(pool => (
            <ItemCard
              tokens={normalizeSymbol(pool.symbol.split("-")) as OHMTokenStackProps["tokens"]}
              title={pool.symbol}
              href={pool.project.link}
              external
              disableFlip
              value={formatCurrency(pool.tvlUsd || 0)}
              roi={`${formatNumber(pool.apy || 0, 2)} %`}
              networkName={defiLlamaChainToNetwork(pool.chain) as OHMTokenProps["name"]}
            />
          ))}
        <Typography variant="h6" className={classes.title}>
          Vaults
        </Typography>
        <ItemCard
          tokens={["DOPEX"]}
          title={`Deposit on Dopex`}
          href={`https://app.dopex.io/ssov`}
          networkName="ARBITRUM"
          external
          disableFlip
        />
        <ItemCard
          tokens={["TOKEMAK"]}
          title={`Deposit on Tokemak`}
          href={`https://www.tokemak.xyz/`}
          external
          disableFlip
        />
        <Typography variant="h6" className={classes.title}>
          Borrow
        </Typography>
        <ItemCard
          tokens={["VST"]}
          title={`Borrow on Vesta Finance`}
          networkName="ARBITRUM"
          href={`https://vestafinance.xyz/products/gohm`}
          external
          disableFlip
        />
        <ItemCard
          tokens={["IMPERMAX"]}
          title={`Borrow on Impermax`}
          networkName="ARBITRUM"
          href={`https://arbitrum.impermax.finance/lending-pool/2/0x6d94f7e67c6ae0b0257c35754e059fdfb249d998`}
          external
          disableFlip
        />
      </StyledBox>
    </Fade>
  );
};

export default GetOhm;
