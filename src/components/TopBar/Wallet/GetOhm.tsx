import { t } from "@lingui/macro";
import { Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ItemCard } from "@olympusdao/component-library";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { formatCurrency, trim } from "src/helpers";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { AppDispatch } from "src/store";

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

  const classes = useStyles();
  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]).sort((a, b) => b.discount - a.discount);
  });
  const fiveDayRate = useAppSelector(state => {
    return state.app.fiveDayRate;
  });
  console.log(bondsV2);
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
        roi={`${trim(Number(fiveDayRate) * 100, 4)}%`}
        days={t`5 Days`}
      />
      <Typography variant="h6" className={classes.title}>
        Zap
      </Typography>
      <ItemCard tokens={["wETH", "wBTC", "DAI"]} title={t`Zap with more assets`} />
    </>
  );
};

export default GetOhm;
