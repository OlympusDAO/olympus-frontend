import BondLogo from "../../components/BondLogo";
import { DisplayBondPrice, DisplayBondDiscount } from "../Bond/Bond";
import { Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { t, Trans } from "@lingui/macro";
import { Skeleton } from "@material-ui/lab";
import { IAllBondData } from "src/hooks/Bonds";
import { useWeb3Context } from "../../hooks/web3Context";
import { Bond, CustomBond, LPBond, NetworkID } from "src/lib/Bond";

type BondUnion = CustomBond | LPBond;
type OnChainProvider = ReturnType<typeof useWeb3Context>;

export function BondDataCard({ bond }: { bond: IAllBondData | Bond }) {
  const { chainID }: OnChainProvider = useWeb3Context();
  // Type assertion for union undefined properties
  const uBond: BondUnion | undefined = bond.isLP ? (bond as BondUnion) : undefined;
  const allBondData: IAllBondData | undefined = !(bond instanceof Bond) ? (bond as IAllBondData) : undefined;
  // Use BondPrice as indicator of loading.
  const isBondLoading = !allBondData?.bondPrice ?? true;

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond.name}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <BondLogo bond={bond} />
          <div className="bond-name">
            <Typography>{bond.displayName}</Typography>
            {bond.isLP && (
              <div>
                <Link href={uBond?.lpUrl} target="_blank">
                  <Typography variant="body1">
                    <Trans>View Contract</Trans>
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
            <>
              {isBondLoading || typeof allBondData === undefined ? (
                <Skeleton width="50px" />
              ) : (
                <DisplayBondPrice key={bond.name} bond={allBondData as IAllBondData} />
              )}
            </>
          </Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>ROI</Trans>
          </Typography>
          <Typography>
            {isBondLoading || typeof allBondData === undefined ? (
              <Skeleton width="50px" />
            ) : (
              <DisplayBondDiscount key={bond.name} bond={allBondData as IAllBondData} />
            )}
          </Typography>
        </div>

        <div className="data-row">
          <Typography>
            <Trans>Purchased</Trans>
          </Typography>
          <Typography>
            {isBondLoading || typeof allBondData === undefined ? (
              <Skeleton width="80px" />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(allBondData?.purchased as number)
            )}
          </Typography>
        </div>
        <Link component={NavLink} to={`/bonds/${bond.name}`}>
          <Button variant="outlined" color="primary" fullWidth disabled={!bond.isAvailable[chainID as NetworkID]}>
            <Typography variant="h5">
              {!bond.isAvailable[chainID as NetworkID] ? t`Sold Out` : t`Bond ${bond.displayName}`}
            </Typography>
          </Button>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond }: { bond: IAllBondData | Bond }) {
  const { chainID }: OnChainProvider = useWeb3Context();
  // Type assertion for union undefined properties
  const uBond = bond as BondUnion;
  const allBondData = bond as IAllBondData;
  // Use BondPrice as indicator of loading.
  const isBondLoading = !allBondData.bondPrice ?? true;
  // const isBondLoading = useSelector(state => !state.bonding[bond]?.bondPrice ?? true);

  return (
    <TableRow id={`${bond.name}--bond`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{allBondData.displayName}</Typography>
          {bond.isLP && (
            <Link color="primary" href={uBond.lpUrl} target="_blank">
              <Typography variant="body1">
                <Trans>View Contract</Trans>
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="left">
        <Typography>
          <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.name} bond={allBondData} />}</>
        </Typography>
      </TableCell>
      <TableCell align="left">
        {" "}
        {isBondLoading ? <Skeleton width="50px" /> : <DisplayBondDiscount key={bond.name} bond={allBondData} />}
      </TableCell>
      <TableCell align="right">
        {isBondLoading ? (
          <Skeleton />
        ) : (
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(allBondData.purchased)
        )}
      </TableCell>
      <TableCell>
        <Link component={NavLink} to={`/bonds/${bond.name}`}>
          <Button variant="outlined" color="primary" disabled={!bond.isAvailable[chainID as NetworkID]}>
            <Typography variant="h6">{!bond.isAvailable[chainID as NetworkID] ? t`Sold Out` : t`do_bond`}</Typography>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
