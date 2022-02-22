import { t } from "@lingui/macro";
import { Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ItemCard } from "@olympusdao/component-library";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { formatCurrency, parseBigNumber, trim } from "src/helpers";
import allPools from "src/helpers/AllExternalPools";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { ExternalPool } from "src/lib/ExternalPool";
import { AppDispatch } from "src/store";
import { useStakePoolTVL } from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolTVL";

import { SupplyRatePerBlock } from "./queries";

const useStyles = makeStyles<Theme>(theme => ({
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
  const dispatch = useDispatch<AppDispatch>();
  const { data: supplyRate } = SupplyRatePerBlock();
  const ethMantissa = 1e18;
  const blocksPerDay = 6500;
  const daysPerYear = 365;
  const fuseSupplyApy =
    supplyRate && (Math.pow((parseBigNumber(supplyRate) / ethMantissa) * blocksPerDay + 1, daysPerYear) - 1) * 100;

  const classes = useStyles();
  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]).sort((a, b) => b.discount - a.discount);
  });
  const fiveDayRate = useAppSelector(state => {
    return state.app.fiveDayRate;
  });

  return (
    <>
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
        href={`http://google.com`}
        external
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
