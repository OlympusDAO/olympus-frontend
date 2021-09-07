// import { OhmDataLoading } from '../../components/Loading/OhmDataLoading'
import { Box, CircularProgress, Divider, Paper, SvgIcon, Typography, Zoom } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import PropTypes from "prop-types";

import { useWeb3Context } from "../../hooks";

export const PoolInfo = props => {
  const { address } = useWeb3Context();

  if (props.loading) {
    return <CircularProgress />;
  }

  // TODO: add user pool data rows
  return (
    <Zoom in={true}>
      <Paper className="ohm-card">
        <div className="card-header">
          <Typography variant="h5">Prize Pool Info</Typography>
        </div>

        {address && (
          <>
            <Box display="flex" flexDirection="column" className="user-pool-data">
              <div className="data-row">
                <Typography>Your deposits</Typography>
                <Typography>{props.poolBalance}</Typography>
              </div>
              <div className="data-row">
                <Typography>Your wallet balance</Typography>
                <Typography>{props.sohmBalance}</Typography>
              </div>
              <div className="data-row">
                <Typography>Your odds</Typography>
                <Typography>1 in {props.yourOdds}</Typography>
              </div>
            </Box>
            <Divider color="secondary" />
          </>
        )}

        <Box display="flex" flexDirection="column" className="pool-data">
          <div className="data-row">
            <Typography>Winners / prize period</Typography>
            <Typography>{props.winners}</Typography>
          </div>
          <div className="data-row">
            <Typography>Total Deposits</Typography>
            <Typography>{props.totalDeposits.toLocaleString()} sOHM</Typography>
          </div>
          <div className="data-row">
            <Typography>Total Sponsorship</Typography>
            <Typography>{props.totalSponsorship.toLocaleString()} sOHM</Typography>
          </div>
          <div className="data-row">
            <Typography>Yield Source</Typography>
            <Typography>sOHM</Typography>
          </div>
          <div className="data-row">
            <Typography>Pool owner</Typography>
            <Box display="flex" alignItems="center">
              <Typography>OlympusDAO</Typography>
              <Link to={"/33-together"} target="_blank" style={{ marginLeft: "3px" }}>
                <SvgIcon component={ArrowUp} fontSize="small" />
              </Link>
            </Box>
          </div>
        </Box>
      </Paper>
    </Zoom>
  );
};

PoolInfo.propTypes = {
  loading: PropTypes.bool.isRequired,
  poolBalance: PropTypes.number,
  sohmBalance: PropTypes.number,
  yourOdds: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  winners: PropTypes.number,
  totalDeposits: PropTypes.number,
  totalSponsorship: PropTypes.number,
};
