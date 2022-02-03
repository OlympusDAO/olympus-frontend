import "./ChooseBond.scss";

import { t, Trans } from "@lingui/macro";
import { Button, Link, Paper, Slide, SvgIcon, TableCell, TableRow, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { NetworkId } from "src/constants";
import { IAllBondData } from "src/hooks/Bonds";
import { Bond, CustomBond, LPBond } from "src/lib/Bond";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { useWeb3Context } from "../../hooks";
import { DisplayBondDiscount, DisplayBondPrice } from "../Bond/Bond";

type BondUnion = CustomBond | LPBond;

export function BondDataCard({ bond }: { bond: IAllBondData | Bond }) {
  const { networkId } = useWeb3Context();
  const uBond = bond as BondUnion;
  const allBondData = bond as IAllBondData;
  // Use BondPrice as indicator of loading.
  const isBondLoading = !allBondData?.bondPrice ?? true;

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond.name}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <TokenStack tokens={bond.bondIconSvg} />
          <div className="bond-name">
            <Typography>{bond.displayName}</Typography>
            {bond.isLP && (
              <div>
                <Link href={uBond?.lpUrl} target="_blank">
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
            <>
              {isBondLoading ? (
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
            {isBondLoading ? (
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
            {isBondLoading ? (
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
        <Link component={NavLink} to={`/bonds-v1/${bond.name}`}>
          <Button variant="outlined" color="primary" fullWidth disabled={!bond.isBondable[networkId as NetworkId]}>
            <Typography variant="h5">
              {/* NOTE (appleseed): temporary for ONHOLD MIGRATION */}
              {/* {!bond.isBondable[networkId] ? t`Sold Out` : t`Bond ${bond.displayName}`} */}
              {bond.isLOLable[networkId as NetworkId] ? bond.LOLmessage : t`Bond ${bond.displayName}`}
            </Typography>
          </Button>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond }: { bond: Bond }) {
  const uBond = bond as BondUnion;
  const allBondData = bond as IAllBondData;
  const { networkId } = useWeb3Context();
  // Use BondPrice as indicator of loading.
  const isBondLoading = !allBondData.bondPrice ?? true;
  // const isBondLoading = useSelector(state => !state.bonding[bond]?.bondPrice ?? true);

  return (
    <TableRow id={`${bond.name}--bond`}>
      <TableCell align="left" className="bond-name-cell">
        <TokenStack tokens={bond.bondIconSvg} />
        <div className="bond-name">
          <Typography variant="body1">{allBondData.displayName}</Typography>
          {bond.isLP && (
            <Link color="primary" href={uBond.lpUrl} target="_blank">
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
        <Link component={NavLink} to={`/bonds-v1/${bond.name}`}>
          <Button
            variant="outlined"
            color="primary"
            disabled={!bond.isBondable[networkId as NetworkId]}
            style={{ width: "100%" }}
          >
            {/* NOTE (appleseed): temporary for ONHOLD MIGRATION */}
            {/* <Typography variant="h6">{!bond.isBondable[networkId] ? t`Sold Out` : t`do_bond`}</Typography> */}
            <Typography variant="h6">
              {bond.isLOLable[networkId as NetworkId] ? bond.LOLmessage : t`do_bond`}
            </Typography>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
