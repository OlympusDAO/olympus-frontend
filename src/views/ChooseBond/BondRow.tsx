import { trim, bondName, lpURL, isBondLP, getTokenImage } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { useAppSelector } from "src/hooks";
import { Skeleton } from "@material-ui/lab";

function priceUnits(bond: string) {
  if (bond.indexOf("frax") >= 0) return <img src={`${getTokenImage("frax")}`} width="15px" height="15px" />;
  else return <img src={`${getTokenImage("dai")}`} width="15px" height="15px" />;
}

export function BondDataCard({ bond }: { bond: string }) {
  const isBondLoading = useAppSelector(state => (state.bonding && state.bonding[bond]?.loading) ?? true);
  const bondPrice = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].bondPrice) || 0;
  });
  const bondDiscount = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].bondDiscount) || 0;
  });
  const bondPurchased = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].purchased) || 0;
  });

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <BondLogo bond={bond} />
          <div className="bond-name">
            <Typography>{bondName(bond)}</Typography>
            {isBondLP(bond) && (
              <div>
                <Link href={lpURL(bond)} target="_blank">
                  <Typography variant="body1">
                    View Contract
                    <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                  </Typography>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="data-row">
          <Typography>Price</Typography>
          <Typography className="bond-price">
            <>
              {priceUnits(bond)} {isBondLoading ? <Skeleton width="50px" /> : trim(bondPrice, 2)}
            </>
          </Typography>
        </div>

        <div className="data-row">
          <Typography>ROI</Typography>
          <Typography>{isBondLoading ? <Skeleton width="50px" /> : `${trim(bondDiscount * 100, 2)}%`}</Typography>
        </div>

        <div className="data-row">
          <Typography>Purchased</Typography>
          <Typography>
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bondPurchased)
            )}
          </Typography>
        </div>
        <Link component={NavLink} to={`/bonds/${bond}`}>
          <Button variant="outlined" color="primary" fullWidth>
            <Typography variant="h5">Bond {bondName(bond)}</Typography>
          </Button>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond }: { bond: string }) {
  const isBondLoading = useAppSelector(state => (state.bonding && state.bonding[bond]?.loading) ?? true);
  const bondPrice = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].bondPrice) || 0;
  });
  const bondDiscount = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].bondDiscount) || 0;
  });
  const bondPurchased = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].purchased) || 0;
  });

  return (
    <TableRow id={`${bond}--bond`}>
      <TableCell align="left">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{bondName(bond)}</Typography>
          {isBondLP(bond) && (
            <Link color="primary" href={lpURL(bond)} target="_blank">
              <Typography variant="body1">
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="center">
        <Typography>
          <>
            <span className="currency-icon">{priceUnits(bond)}</span>{" "}
            {isBondLoading ? <Skeleton width="50px" /> : trim(bondPrice, 2)}
          </>
        </Typography>
      </TableCell>
      <TableCell align="right">{isBondLoading ? <Skeleton /> : `${trim(bondDiscount * 100, 2)}%`}</TableCell>
      <TableCell align="right">
        {isBondLoading ? (
          <Skeleton />
        ) : (
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(bondPurchased)
        )}
      </TableCell>
      <TableCell>
        <Link component={NavLink} to={`/bonds/${bond}`}>
          <Button variant="outlined" color="primary">
            <Typography variant="h6">Bond</Typography>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
