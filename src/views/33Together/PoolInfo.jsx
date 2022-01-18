import { useState, useEffect } from "react";
import { Box, Button, Divider, Paper, SvgIcon, Typography, Zoom } from "@material-ui/core";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Skeleton } from "@material-ui/lab";
import { t, Trans } from "@lingui/macro";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { useWeb3Context } from "../../hooks";
import { poolTogetherUILinks } from "../../helpers/33Together";
import { DataRow } from "@olympusdao/component-library";

export const PoolInfo = props => {
  const [poolLoadedCount, setPoolLoadedCount] = useState(0);
  const { address, networkId } = useWeb3Context();
  const isPoolLoading = useSelector(state => state.poolData.loading ?? true);

  const creditMaturationInDays = useSelector(state => {
    return state.poolData && parseFloat(state.poolData.creditMaturationInDays);
  });

  const creditLimitPercentage = useSelector(state => {
    return state.poolData && parseFloat(state.poolData.creditLimitPercentage);
  });

  // this useEffect is to prevent flashing `Early Exit Fee` & `Exit Fee Decay Time`...
  // ... on every poolData load, which occurs during Award Period polling.
  useEffect(() => {
    // will be 1 on intial load
    if (poolLoadedCount < 2 && isPoolLoading === false) {
      setPoolLoadedCount(prev => prev + 1);
    }
  }, [isPoolLoading]);

  return (
    <Zoom in={true}>
      <Paper className="ohm-card">
        <div className="card-header">
          <Typography variant="h5">
            <Trans>Prize Pool Info</Trans>
          </Typography>
        </div>

        {address && (
          <>
            <Box display="flex" flexDirection="column" className="user-pool-data">
              <DataRow
                title={t`Your total awards`}
                balance={`${props.yourTotalAwards} 33T`}
                isLoading={props.isAccountLoading}
              />
              <DataRow
                title={t`Your pool deposits`}
                balance={`${props.poolBalance} 33T`}
                isLoading={props.isAccountLoading}
              />
              <DataRow
                title={t`Your odds`}
                balance={`1 in ${props.yourOdds}`}
                isLoading={props.isAccountLoading || props.graphLoading}
              />
              <DataRow
                title={t`Your wallet balance`}
                balance={`${props.sohmBalance} sOHM`}
                isLoading={props.isAccountLoading || props.graphLoading}
              />
            </Box>
            <Divider color="secondary" />
          </>
        )}

        <Box display="flex" flexDirection="column" className="pool-data">
          <DataRow title={t`Winners / prize period`} balance={props.winners} isLoading={props.graphLoading} />
          <DataRow
            title={t`Total Deposits`}
            balance={`${props.totalDeposits.toLocaleString()} sOHM`}
            isLoading={props.graphLoading}
          />
          <DataRow
            title={t`Total Sponsorship`}
            balance={`${props.totalSponsorship.toLocaleString()} sOHM`}
            isLoading={props.graphLoading}
          />
          <DataRow title={t`Yield Source`} balance="sOHM" />
          <DataRow title={t`Pool owner`} balance="OlympusDAO" />
          <Divider color="secondary" />
          <DataRow title={t`Early Exit Fee`} balance={`${creditLimitPercentage}%`} isLoading={poolLoadedCount === 1} />
          <DataRow
            title={t`Exit Fee Decay Time`}
            balance={`${creditMaturationInDays} day${creditMaturationInDays === 1 ? "" : "s"}`}
            isLoading={poolLoadedCount === 1}
          />
        </Box>
        <Divider color="secondary" />

        <div className="data-row-centered">
          <Typography>
            <Trans>Something not right, fren? Check Pool Together's UI below.</Trans>
          </Typography>
        </div>
        <div className="data-row-centered">
          <div className="marginedBtn">
            <Button variant="outlined" color="secondary" href={poolTogetherUILinks(networkId)[0]} target="_blank">
              <Typography variant="body1">
                <Trans>sOHM Prize Pool</Trans>&nbsp;
              </Typography>
              <SvgIcon component={ArrowUp} color="primary" />
            </Button>
          </div>
          <div className="marginedBtn">
            <Button variant="outlined" color="secondary" href={poolTogetherUILinks(networkId)[1]} target="_blank">
              <Typography variant="body1">
                <Trans>sOHM Pool Details</Trans>&nbsp;
              </Typography>
              <SvgIcon component={ArrowUp} color="primary" />
            </Button>
          </div>
        </div>
      </Paper>
    </Zoom>
  );
};

PoolInfo.propTypes = {
  graphLoading: PropTypes.bool.isRequired,
  isAccountLoading: PropTypes.bool.isRequired,
  poolBalance: PropTypes.string,
  sohmBalance: PropTypes.string,
  yourTotalAwards: PropTypes.string,
  yourOdds: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  winners: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalDeposits: PropTypes.number,
  totalSponsorship: PropTypes.number,
};
