import { t } from "@lingui/macro";
import { Grid, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GetOnButton, ItemCard } from "@olympusdao/component-library";
import { FC } from "react";
import sushiswapImg from "src/assets/sushiswap.png";
import uniswapImg from "src/assets/uniswap.png";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, parseBigNumber, trim } from "src/helpers";
import allPools from "src/helpers/AllExternalPools";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { ExternalPool } from "src/lib/ExternalPool";
import { useStakePoolTVL } from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolTVL";

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
  const { networkId, address, provider } = useWeb3Context();
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
    <>
      <Typography variant="h6" className={classes.title}>
        Our Partners
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

      <Typography variant="h6" className={classes.title}>
        Bonds
      </Typography>
      {bondsV2.map(bond => (
        <ItemCard
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
      <Typography variant="h6" className={classes.title}>
        Zap
      </Typography>
      <ItemCard tokens={["wETH", "wBTC", "USDC", "DAI"]} title={t`Zap with more assets`} href={`/zap`} disableFlip />
      <Typography variant="h6" className={classes.title}>
        Farm Pool
      </Typography>
      {allPools.map(pool => (
        <StakePool pool={pool} />
      ))}
      <Typography variant="h6" className={classes.title}>
        Borrow
      </Typography>
      <ItemCard
        tokens={["RARI"]}
        title={t`Get Loans on Rari`}
        href={`https://app.rari.capital/fuse/pool/18`}
        external
        roi={`${fuseSupplyApy}%`}
        days="APY"
        disableFlip
      />
    </>
  );
};

export default GetOhm;

const StakePool: React.FC<{ pool: ExternalPool }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  return (
    <ItemCard
      tokens={props.pool.icons}
      title={props.pool.poolName}
      value={totalValueLocked && formatCurrency(totalValueLocked)}
      href={props.pool.href}
      external
      disableFlip
    />
  );
};
