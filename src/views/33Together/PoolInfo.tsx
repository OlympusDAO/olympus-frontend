import { useState, useEffect } from "react";
import { Box, Button, Divider, Paper, SvgIcon, Typography, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useWeb3Context, useAppSelector } from "src/hooks";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { poolTogetherUILinks } from "src/helpers/33Together";

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
  const { address, chainID } = useWeb3Context();
  const isPoolLoading = useAppSelector(state => state.poolData.loading ?? true);

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
          <Typography variant="h5">Prize Pool Info</Typography>
        </div>

        {address && (
          <>
            <Box display="flex" flexDirection="column" className="user-pool-data">
              <div className="data-row">
                <Typography>Your total awards</Typography>
                <Typography>{props.isAccountLoading ? <Skeleton width={100} /> : props.yourTotalAwards} 33T</Typography>
              </div>
              <div className="data-row">
                <Typography>Your pool deposits</Typography>
                <Typography>{props.isAccountLoading ? <Skeleton width={100} /> : props.poolBalance} 33T</Typography>
              </div>
              <div className="data-row">
                <Typography>Your odds</Typography>
                <Typography>
                  1 in{" "}
                  {props.isAccountLoading || props.graphLoading ? (
                    <Skeleton width={50} style={{ display: "inline-block" }} />
                  ) : (
                    props.yourOdds
                  )}
                </Typography>
              </div>
              <div className="data-row">
                <Typography>Your wallet balance</Typography>
                <Typography>{props.isAccountLoading ? <Skeleton width={100} /> : props.sohmBalance} sOHM</Typography>
              </div>
            </Box>
            <Divider color="secondary" />
          </>
        )}

        <Box display="flex" flexDirection="column" className="pool-data">
          <div className="data-row">
            <Typography>Winners / prize period</Typography>
            <Typography>{props.graphLoading ? <Skeleton width={100} /> : props.winners}</Typography>
          </div>
          <div className="data-row">
            <Typography>Total Deposits</Typography>
            <Typography>
              {props.graphLoading ? <Skeleton width={100} /> : props.totalDeposits.toLocaleString()} sOHM
            </Typography>
          </div>
          <div className="data-row">
            <Typography>Total Sponsorship</Typography>
            <Typography>
              {props.graphLoading ? <Skeleton width={100} /> : props.totalSponsorship.toLocaleString()} sOHM
            </Typography>
          </div>
          <div className="data-row">
            <Typography>Yield Source</Typography>
            <Typography>sOHM</Typography>
          </div>
          <div className="data-row">
            <Typography>Pool owner</Typography>
            <Box display="flex" alignItems="center">
              <Typography>OlympusDAO</Typography>
            </Box>
          </div>
          <Divider color="secondary" />
          <div className="data-row">
            <Typography>Early Exit Fee</Typography>
            <Typography>{poolLoadedCount === 1 ? <Skeleton width={100} /> : `${creditLimitPercentage}%`}</Typography>
          </div>
          <div className="data-row">
            <Typography>Exit Fee Decay Time</Typography>
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
          <Typography>Something not right, fren? Check Pool Together's UI below.</Typography>
        </div>
        <div className="data-row-centered">
          <div className="marginedBtn">
            <Button variant="outlined" color="secondary" href={poolTogetherUILinks(chainID)[0]} target="_blank">
              <Typography variant="body1">sOHM Prize Pool&nbsp;</Typography>
              <SvgIcon component={ArrowUp} color="primary" />
            </Button>
          </div>
          <div className="marginedBtn">
            <Button variant="outlined" color="secondary" href={poolTogetherUILinks(chainID)[1]} target="_blank">
              <Typography variant="body1">sOHM Pool Details&nbsp;</Typography>
              <SvgIcon component={ArrowUp} color="primary" />
            </Button>
          </div>
        </div>
      </Paper>
    </Zoom>
  );
};
