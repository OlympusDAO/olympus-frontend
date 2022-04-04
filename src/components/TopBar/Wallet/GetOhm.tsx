import { t } from "@lingui/macro";
import { Box, Fade, Grid, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GetOnButton, ItemCard, OHMItemCardProps } from "@olympusdao/component-library";
import { FC } from "react";
import sushiswapImg from "src/assets/sushiswap.png";
import uniswapImg from "src/assets/uniswap.png";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, formatNumber, parseBigNumber, trim } from "src/helpers";
import { beetsPools, joePools, jonesPools, spiritPools, sushiPools, zipPools } from "src/helpers/AllExternalPools";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { ExternalPool } from "src/lib/ExternalPool";
import { NetworkId } from "src/networkDetails";
import {
  BeetsPoolAPY,
  JoePoolAPY,
  JonesPoolAPY,
  SpiritPoolAPY,
  SushiPoolAPY,
  ZipPoolAPY,
} from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolAPY";
import { BalancerPoolTVL, useStakePoolTVL } from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolTVL";

import { SupplyRatePerBlock } from "./queries";

const useStyles = makeStyles<Theme>(() => ({
  title: {
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

  const classes = useStyles();
  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]).sort((a, b) => b.discount - a.discount);
  });
  const fiveDayRate = Math.pow(1 + rebaseRate, 5 * 3) - 1;

  return (
    <Fade in={true}>
      <Box>
        <Typography variant="h6" className={classes.title}>
          Exchanges
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <GetOnButton
              href={`https://app.sushi.com/swap/?outputCurrency=${
                GOHM_ADDRESSES[networkId as keyof typeof GOHM_ADDRESSES]
              }`}
              logo={<img src={sushiswapImg}></img>}
              exchangeName="Sushiswap"
            />
          </Grid>
          <Grid item xs={6}>
            <GetOnButton
              href={`https://app.uniswap.org/#/swap?outputCurrency=${
                GOHM_ADDRESSES[networkId as keyof typeof GOHM_ADDRESSES]
              }`}
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
            {bondsV2.map((bond, index) => (
              <ItemCard
                key={index}
                tokens={bond.bondIconSvg}
                value={formatCurrency(bond.marketPrice, 2)}
                roi={`${trim(bond.discount * 100, 2)}%`}
                days={bond.duration}
                href={`/bonds/${bond.index}`}
                hrefText={t` Bond ${bond.displayName}`}
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
      </Box>
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
