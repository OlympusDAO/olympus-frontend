import { useSelector } from "react-redux";
import { trim, bondName, lpURL, isBondLP, priceUnits } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";

export function BondDataCard({ bond }) {
  const isBondLoading = useSelector(state => !state.bonding[bond]?.bondPrice ?? true);
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
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

export function BondTableData({ bond }) {
  // Use BondPrice as indicator of loading.
  const isBondLoading = useSelector(state => !state.bonding[bond]?.bondPrice ?? true);

  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });

  return (
    <TableRow id={`${bond}--bond`}>
      <TableCell align="left" className="bond-name-cell">
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
      <TableCell align="center">
        <Link component={NavLink} to={`/bonds/${bond}`}>
          <Button variant="outlined" color="primary">
            <Typography variant="h6">Bond</Typography>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondTableData({ bond }) {
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });

  return (
    <TableRow id={`${bond}--claim`}>
      <TableCell align="left" className="bond-name-cell">
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
      <TableCell align="left">33 OHM</TableCell>
      <TableCell align="left">11.33 OHM</TableCell>
      <TableCell align="center">3 days 3 hrs</TableCell>
      <TableCell align="center">
        {/* <Link component={NavLink} to={`/bonds/${bond}`}> */}
        <Button variant="outlined" color="primary">
          <Typography variant="h6">Claim</Typography>
        </Button>
        {/* </Link> */}
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ bond }) {
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });

  return (
    <Box id={`${bond}--claim`} className="claim-bond-data-card bond-data-card" style={{ marginBottom: "30px" }}>
      <Box className="bond-pair">
        <BondLogo bond={bond} />
        <Box className="bond-name">
          <Typography>{bondName(bond)}</Typography>
          {isBondLP(bond) && (
            <Link href={lpURL(bond)} target="_blank">
              <Typography variant="body1">
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )}
        </Box>
      </Box>

      <div className="data-row">
        <Typography>Claimable</Typography>
        <Typography>33 OHM</Typography>
      </div>

      <div className="data-row">
        <Typography>Pending</Typography>
        <Typography>11.33 OHM</Typography>
      </div>

      <div className="data-row" style={{ marginBottom: "20px" }}>
        <Typography>Fully Vested</Typography>
        <Typography>3 days 3 hrs</Typography>
      </div>
      <Box display="flex" justifyContent="space-around" alignItems="center" className="claim-bond-card-buttons">
        <Button variant="outlined" color="primary">
          <Typography variant="h5">Claim</Typography>
        </Button>
        <Button variant="outlined" color="primary">
          <Typography variant="h5">Claim and Stake</Typography>
        </Button>
      </Box>
    </Box>
  );
}
