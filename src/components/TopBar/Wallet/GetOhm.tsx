import { t } from "@lingui/macro";
import { Box, Fade, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GetOnButton, ItemCard, OHMItemCardProps } from "@olympusdao/component-library";
import { FC } from "react";
import sushiswapImg from "src/assets/sushiswap.png";
import uniswapImg from "src/assets/uniswap.png";
import { OHM_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, formatNumber, parseBigNumber, trim } from "src/helpers";
import {
  balancerPools,
  beetsPools,
  bobaPools,
  convexPools,
  curvePools,
  joePools,
  jonesPools,
  spiritPools,
  sushiPools,
  zipPools,
} from "src/helpers/AllExternalPools";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { prettifySecondsInDays } from "src/helpers/timeUtil";
import { useWeb3Context } from "src/hooks";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { ExternalPool } from "src/lib/ExternalPool";
import { NetworkId } from "src/networkDetails";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";
import {
  BalancerPoolAPY,
  BalancerSwapFees,
  BeetsPoolAPY,
  BobaPoolAPY,
  ConvexPoolAPY,
  CurvePoolAPY,
  JoePoolAPY,
  JonesPoolAPY,
  SpiritPoolAPY,
  SushiPoolAPY,
  ZipPoolAPY,
} from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolAPY";
import {
  BalancerPoolTVL,
  CurvePoolTVL,
  useStakePoolTVL,
} from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolTVL";

import { SupplyRatePerBlock } from "./queries";

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
  const { networkId } = useWeb3Context();
  const { data: supplyRate } = SupplyRatePerBlock();
  const { data: rebaseRate = 0 } = useStakingRebaseRate();
  const ethMantissa = 1e18;
  const blocksPerDay = 6500;
  const daysPerYear = 365;
  const fuseSupplyApy =
    supplyRate && (Math.pow((parseBigNumber(supplyRate) / ethMantissa) * blocksPerDay + 1, daysPerYear) - 1) * 100;

  const bonds = useLiveBonds().data;
  const fiveDayRate = Math.pow(1 + rebaseRate, 5 * 3) - 1;

  return (
    <Fade in={true}>
      <StyledBox>
        <Typography variant="h6" className={classes.title}>
          Exchanges
        </Typography>
        <Grid container spacing={1}>
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
        {NetworkId.MAINNET === networkId && (
          <>
            <Typography variant="h6" className={classes.title}>
              Zap
            </Typography>
            <ItemCard
              tokens={["wETH", "wBTC", "USDC", "DAI"]}
              title={t`Zap with more assets`}
              href={`/zap`}
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
                  hrefText={t`Bond ${bond.quoteToken.name}`}
                />
              ))}
            <Typography variant="h6" className={classes.title}>
              Stake
            </Typography>
            <ItemCard
              tokens={["sOHM", "wsOHM"]}
              title={t`Stake Now`}
              roi={`${trim(Number(fiveDayRate) * 100, 2)}%`}
              days={t`5 Days`}
              href={`/stake`}
              disableFlip
            />
          </>
        )}
        <Typography variant="h6" className={classes.title}>
          Farm Pool
        </Typography>
        {sushiPools.map((pool, index) => (
          <SushiPools key={index} pool={pool} />
        ))}
        {joePools.map((pool, index) => (
          <JoePools key={index} pool={pool} />
        ))}
        {spiritPools.map((pool, index) => (
          <SpiritPools key={index} pool={pool} />
        ))}
        {beetsPools.map((pool, index) => (
          <BeetsPools key={index} pool={pool} />
        ))}
        {zipPools.map((pool, index) => (
          <ZipPools key={index} pool={pool} />
        ))}
        {jonesPools.map((pool, index) => (
          <JonesPools key={index} pool={pool} />
        ))}
        {balancerPools.map((pool, index) => (
          <BalancerPools key={index} pool={pool} />
        ))}
        {bobaPools.map((pool, index) => (
          <BobaPools key={index} pool={pool} />
        ))}
        {curvePools.map((pool, index) => (
          <CurvePools key={index} pool={pool} />
        ))}
        {convexPools.map((pool, index) => (
          <ConvexPools key={index} pool={pool} />
        ))}

        <Typography variant="h6" className={classes.title}>
          Vaults
        </Typography>
        <ItemCard
          tokens={["DOPEX"]}
          title={t`Deposit on Dopex`}
          href={`https://app.dopex.io/ssov`}
          networkName="ARBITRUM"
          external
          disableFlip
        />
        <ItemCard
          tokens={["JONES"]}
          title={t`Deposit on Jones DAO`}
          href={`https://jonesdao.io/vaults/gOHM`}
          networkName="ARBITRUM"
          external
          disableFlip
        />
        <ItemCard
          tokens={["TOKEMAK"]}
          title={t`Deposit on Tokemak`}
          href={`https://www.tokemak.xyz/`}
          external
          disableFlip
        />

        <Typography variant="h6" className={classes.title}>
          Borrow
        </Typography>
        <ItemCard
          tokens={["RARI"]}
          title={t`Borrow on Rari`}
          href={`https://app.rari.capital/fuse/pool/18`}
          external
          roi={`${fuseSupplyApy}%`}
          days="APY"
          disableFlip
        />
        <ItemCard
          tokens={["MARKET"]}
          title={t`Borrow on Market.xyz`}
          networkName={"POLYGON"}
          href={`https://polygon.market.xyz/pool/8`}
          external
          disableFlip
        />
        <ItemCard
          tokens={["MARKET"]}
          title={t`Borrow on Market.xyz`}
          networkName={"AVAX"}
          href={`https://avax.market.xyz/pool/3`}
          external
          disableFlip
        />
        <ItemCard
          tokens={["VST"]}
          title={t`Borrow on Vesta Finance`}
          networkName="ARBITRUM"
          href={`https://vestafinance.xyz/products/gohm`}
          external
          disableFlip
        />
        <ItemCard
          tokens={["IMPERMAX"]}
          title={t`Borrow on Impermax`}
          networkName="ARBITRUM"
          href={`https://arbitrum.impermax.finance/lending-pool/0x6d94f7e67c6ae0b0257c35754e059fdfb249d998`}
          external
          disableFlip
        />
      </StyledBox>
    </Fade>
  );
};

export default GetOhm;

const SushiPools: React.FC<{ pool: ExternalPool }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = SushiPoolAPY(props.pool);
  return <PoolCard {...props} value={totalValueLocked && formatCurrency(totalValueLocked)} roi={apy} />;
};

const JoePools: React.FC<{ pool: ExternalPool }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = JoePoolAPY(props.pool);
  return <PoolCard {...props} value={totalValueLocked && formatCurrency(totalValueLocked)} roi={apy} />;
};
const SpiritPools: React.FC<{ pool: ExternalPool }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = SpiritPoolAPY(props.pool);
  return <PoolCard {...props} value={totalValueLocked && formatCurrency(totalValueLocked)} roi={apy} />;
};
const BeetsPools: React.FC<{ pool: ExternalPool }> = props => {
  const { data: totalValueLocked } = BalancerPoolTVL(props.pool);
  const { apy } = BeetsPoolAPY(props.pool);
  return <PoolCard {...props} value={totalValueLocked && formatCurrency(totalValueLocked)} roi={apy} />;
};

const ZipPools: React.FC<{ pool: ExternalPool }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = ZipPoolAPY(props.pool);
  return <PoolCard {...props} value={totalValueLocked && formatCurrency(totalValueLocked)} roi={apy} />;
};

const JonesPools: React.FC<{ pool: ExternalPool }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = JonesPoolAPY(props.pool);
  return <PoolCard {...props} value={totalValueLocked && formatCurrency(totalValueLocked)} roi={apy} />;
};
const BalancerPools: React.FC<{ pool: ExternalPool }> = props => {
  const { data } = BalancerSwapFees(props.pool.address);
  const { apy } = BalancerPoolAPY(props.pool);
  return <PoolCard {...props} value={data.totalLiquidity && formatCurrency(data.totalLiquidity)} roi={apy} />;
};
const BobaPools: React.FC<{ pool: ExternalPool }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = BobaPoolAPY(props.pool);
  return <PoolCard {...props} value={totalValueLocked && formatCurrency(totalValueLocked)} roi={apy} />;
};
const CurvePools: React.FC<{ pool: ExternalPool }> = props => {
  const { data } = CurvePoolTVL(props.pool);
  const { apy } = CurvePoolAPY(props.pool);
  return <PoolCard {...props} value={data && formatCurrency(data.usdTotal)} roi={apy} />;
};
const ConvexPools: React.FC<{ pool: ExternalPool }> = props => {
  const { apy, tvl } = ConvexPoolAPY(props.pool);
  return <PoolCard {...props} value={tvl && formatCurrency(tvl)} roi={apy} />;
};

const PoolCard = (props: { pool: ExternalPool; value: OHMItemCardProps["value"]; roi: OHMItemCardProps["roi"] }) => {
  const networkName = NetworkId[props.pool.networkID] as OHMItemCardProps["networkName"];
  return (
    <ItemCard
      tokens={props.pool.icons}
      title={props.pool.poolName}
      href={props.pool.href}
      external
      disableFlip
      value={props.value}
      roi={`${props.roi && formatNumber(Number(props.roi) * 100, 2)} %`}
      networkName={networkName}
    />
  );
};
