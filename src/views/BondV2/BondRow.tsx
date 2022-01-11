import BondLogo from "../../components/BondLogo";
import { DisplayBondPrice, DisplayBondDiscount } from "./BondV2";
import { Box, Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { t, Trans } from "@lingui/macro";
import { Skeleton } from "@material-ui/lab";
import { IBondV2 } from "src/slices/BondSliceV2";
import { useAppSelector } from "src/hooks";

export function BondDataCard({ bond }: { bond: IBondV2 }) {
  const isBondLoading = useAppSelector(state => state.bondingV2.loading);

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond.index}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <BondLogo bond={bond} />
          <div className="bond-name">
            <Typography>{bond.displayName}</Typography>
            {bond.isLP && (
              <div>
                <Link href={bond.lpUrl} target="_blank">
                  <Typography variant="body1">
                    <Trans>Get LP</Trans>
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
            <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.index} bond={bond} />}</>
          </Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>ROI</Trans>
          </Typography>
          <Typography>
            {isBondLoading ? <Skeleton width="50px" /> : <DisplayBondDiscount key={bond.index} bond={bond} />}
          </Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Duration</Trans>
          </Typography>
          <Typography>{isBondLoading ? <Skeleton width="50px" /> : bond.duration}</Typography>
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
        <Link component={NavLink} to={`/bonds/${bond.index}`}>
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
    <TableRow id={`${bond.index}--bond`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{bond.displayName}</Typography>
          {bond.isLP && (
            <Link color="primary" href={bond.lpUrl} target="_blank">
              <Typography variant="body1">
                <Trans>Get LP</Trans>
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )}
          {/* <Typography>{bond.fixedTerm ? t`Fixed Term` : t`Fixed Expiration`}</Typography> */}
        </div>
      </TableCell>
      <TableCell align="left">
        <Typography>
          <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.index} bond={bond} />}</>
        </Typography>
      </TableCell>
      <TableCell align="left">
        {isBondLoading ? <Skeleton width="50px" /> : <DisplayBondDiscount key={bond.index} bond={bond} />}
      </TableCell>
      <TableCell align="left">{isBondLoading ? <Skeleton /> : bond.duration}</TableCell>
      <TableCell>
        <Link component={NavLink} to={`/bonds/${bond.index}`}>
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
