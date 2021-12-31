import BondLogo from "../../components/BondLogo";
import { DisplayBondPrice, DisplayBondDiscount } from "./BondV2";
import { Box, Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { t, Trans } from "@lingui/macro";
import { Skeleton } from "@material-ui/lab";
import useBonds from "src/hooks/Bonds";
import { IBondV2 } from "src/slices/BondSliceV2";
import { useAppSelector } from "src/hooks";

export function BondDataCard({ bond }: { bond: IBondV2 }) {
  const isBondLoading = useAppSelector(state => state.bondingV2.loading);

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond.displayName}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <BondLogo bond={bond} />
          <div className="bond-name">
            <Typography>{bond.displayName}</Typography>
            {bond.isLP && (
              <div>
                <Link href={bond.lpUrl} target="_blank">
                  <Typography variant="body1">
                    <Trans>Deposit LP</Trans>
                    <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                  </Typography>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Price</Trans>
          </Typography>
          <Typography className="bond-price">
            <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.displayName} bond={bond} />}</>
          </Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>ROI</Trans>
          </Typography>
          <Typography>
            {isBondLoading ? <Skeleton width="50px" /> : <DisplayBondDiscount key={bond.displayName} bond={bond} />}
          </Typography>
        </div>

        {/* <div className="data-row">
          <Typography>
            <Trans>Purchased</Trans>
          </Typography>
          <Typography>
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bond.purchased)
            )}
          </Typography>
        </div> */}
        <Link component={NavLink} to={`/bondsV2/${bond.displayName}`}>
          <Button variant="outlined" color="primary" fullWidth>
            <Typography variant="h5">
              {/* NOTE (appleseed): temporary for ONHOLD MIGRATION */}
              {/* {!bond.isBondable[networkId] ? t`Sold Out` : t`Bond ${bond.displayName}`} */}
              {t`Bond ${bond.displayName}`}
            </Typography>
          </Button>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond }: { bond: IBondV2 }) {
  // Use BondPrice as indicator of loading.
  const isBondLoading = !bond.priceUSD ?? true;
  // const isBondLoading = useSelector(state => !state.bonding[bond]?.bondPrice ?? true);

  return (
    <TableRow id={`${bond.displayName}--bond`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{bond.displayName}</Typography>
          {bond.isLP && (
            <Link color="primary" href={bond.lpUrl} target="_blank">
              <Typography variant="body1">
                <Trans>Deposit LP</Trans>
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="left">
        <Typography>
          {/* <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.name} bond={bond} />}</> */}
          $322
        </Typography>
      </TableCell>
      <TableCell align="left">
        {" "}
        {/* {isBondLoading ? <Skeleton width="50px" /> : <DisplayBondDiscount key={bond.name} bond={bond} />} */}
        6.08%
      </TableCell>
      {/* <TableCell align="right">
        {isBondLoading ? (
          <Skeleton />
        ) : (
          // new Intl.NumberFormat("en-US", {
          //   style: "currency",
          //   currency: "USD",
          //   maximumFractionDigits: 0,
          //   minimumFractionDigits: 0,
          // }).format(bond.purchased)
          "432,198"
        )}
      </TableCell> */}
      <TableCell>
        <Link component={NavLink} to={`/bonds-v2/${bond.displayName}`}>
          <Button variant="outlined" color="primary" style={{ width: "100%" }}>
            {/* NOTE (appleseed): temporary for ONHOLD MIGRATION */}
            {/* <Typography variant="h6">{!bond.isBondable[networkId] ? t`Sold Out` : t`do_bond`}</Typography> */}
            <Typography variant="h6">{t`do_bond`}</Typography>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
