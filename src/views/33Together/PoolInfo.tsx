import { useState, useEffect } from "react";
import { Box, Button, Divider, Paper, SvgIcon, Typography, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useWeb3Context, useAppSelector } from "src/hooks";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { poolTogetherUILinks } from "src/helpers/33Together";
import { t, Trans } from "@lingui/macro";

interface PoolInfoProps {
  graphLoading: boolean;
  isAccountLoading: boolean;
  poolBalance?: string;
  sohmBalance?: string;
  yourTotalAwards?: string;
  yourOdds?: string | number;
  winners?: string | number;
  totalDeposits: number;
  totalSponsorship: number;
}

export const PoolInfo = (props: PoolInfoProps) => {
  const [poolLoadedCount, setPoolLoadedCount] = useState(0);
  const { address } = useWeb3Context();
  const isPoolLoading = useAppSelector(state => state.poolData.loading ?? true);
  const networkId = useAppSelector(state => state.network.networkId);

  const creditMaturationInDays = useAppSelector(state => {
    return state.poolData && state.poolData.creditMaturationInDays;
  });

  const creditLimitPercentage = useAppSelector(state => {
    return state.poolData && state.poolData.creditLimitPercentage;
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
              <div className="data-row">
                <Typography>
                  <Trans>Your total awards</Trans>
                </Typography>
                <Typography>{props.isAccountLoading ? <Skeleton width={100} /> : props.yourTotalAwards} 33T</Typography>
              </div>
              <div className="data-row">
                <Typography>
                  <Trans>Your pool deposits</Trans>
                </Typography>
                <Typography>{props.isAccountLoading ? <Skeleton width={100} /> : props.poolBalance} 33T</Typography>
              </div>
              <div className="data-row">
                <Typography>
                  <Trans>Your odds</Trans>
                </Typography>
                <Typography>
                  {props.isAccountLoading || props.graphLoading ? (
                    <Skeleton width={50} style={{ display: "inline-block" }} />
                  ) : (
                    <Trans> 1 in {props.yourOdds}</Trans>
                  )}
                </Typography>
              </div>
              <div className="data-row">
                <Typography>
                  <Trans>Your wallet balance</Trans>
                </Typography>
                <Typography>{props.isAccountLoading ? <Skeleton width={100} /> : props.sohmBalance} sOHM</Typography>
              </div>
            </Box>
            <Divider color="secondary" />
          </>
        )}

        <Box display="flex" flexDirection="column" className="pool-data">
          <div className="data-row">
            <Typography>
              <Trans>Winners / prize period</Trans>
            </Typography>
            <Typography>{props.graphLoading ? <Skeleton width={100} /> : props.winners}</Typography>
          </div>
          <div className="data-row">
            <Typography>
              <Trans>Total Deposits</Trans>
            </Typography>
            <Typography>
              {props.graphLoading ? <Skeleton width={100} /> : props.totalDeposits.toLocaleString()} sOHM
            </Typography>
          </div>
          <div className="data-row">
            <Typography>
              <Trans>Total Sponsorship</Trans>
            </Typography>
            <Typography>
              {props.graphLoading ? <Skeleton width={100} /> : props.totalSponsorship.toLocaleString()} sOHM
            </Typography>
          </div>
          <div className="data-row">
            <Typography>
              <Trans>Yield Source</Trans>
            </Typography>
            <Typography>sOHM</Typography>
          </div>
          <div className="data-row">
            <Typography>
              <Trans>Pool owner</Trans>
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography>OlympusDAO</Typography>
            </Box>
          </div>
          <Divider color="secondary" />
          <div className="data-row">
            <Typography>
              <Trans>Early Exit Fee</Trans>
            </Typography>
            <Typography>{poolLoadedCount === 1 ? <Skeleton width={100} /> : `${creditLimitPercentage}%`}</Typography>
          </div>
          <div className="data-row">
            <Typography>
              <Trans>Exit Fee Decay Time</Trans>
            </Typography>
            <Typography>
              {poolLoadedCount === 1 ? (
                <Skeleton width={100} />
              ) : (
                `${creditMaturationInDays} day${creditMaturationInDays === 1 ? "" : "s"}`
              )}
            </Typography>
          </div>
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
