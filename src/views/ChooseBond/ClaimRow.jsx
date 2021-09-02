import { useEffect } from "react";
import { bondName, lpURL, isBondLP, shorten, trim, secondsUntilBlock, prettifySeconds } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Box, Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";

export function ClaimBondTableData({ bond }) {
  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  useEffect(() => {
    console.log(bond);
  }, []);

  return (
    <TableRow id={`${bond[0]}--claim`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{bondName(bond[0])}</Typography>
          {isBondLP(bond[0]) && (
            <Link color="primary" href={lpURL(bond[1])} target="_blank">
              <Typography variant="body1">
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="left">{bond[1].interestDue}</TableCell>
      <TableCell align="left">need data</TableCell>
      <TableCell align="center">{bond[1].bondMaturationBlock}</TableCell>
      <TableCell align="center">
        {/* Need to add button action */}
        <Button variant="outlined" color="primary">
          <Typography variant="h6">Claim</Typography>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ bond }) {
  return (
    <Box id={`${bond[0]}--claim`} className="claim-bond-data-card bond-data-card" style={{ marginBottom: "30px" }}>
      <Box className="bond-pair">
        <BondLogo bond={bond} />
        <Box className="bond-name">
          <Typography>{bondName(bond[0])}</Typography>
          {isBondLP(bond[0]) && (
            <Link href={lpURL(bond[1])} target="_blank">
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
        <Typography>{bond[1].pendingPayout}</Typography>
      </div>

      <div className="data-row">
        <Typography>Pending</Typography>
        <Typography>need data</Typography>
      </div>

      <div className="data-row" style={{ marginBottom: "20px" }}>
        <Typography>Fully Vested</Typography>
        <Typography>{bond[1].bondMaturationBlock}</Typography>
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
