import { t, Trans } from "@lingui/macro";
import { Box, Divider, Typography, Zoom } from "@material-ui/core";
import { DataRow, Paper, SecondaryButton } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { poolTogetherUILinks } from "src/helpers/33Together";
import { useAppSelector, useWeb3Context } from "src/hooks";

interface PoolInfoProps {
  graphLoading: boolean;
  isAccountLoading: boolean;
  poolBalance?: string;
  sohmBalance?: string;
  yourTotalAwards?: string;
  yourOdds?: string | number;
  winners: string | number;
  totalDeposits: number;
  totalSponsorship: number;
}

export const PoolInfo = (props: PoolInfoProps) => {
  const [poolLoadedCount, setPoolLoadedCount] = useState(0);
  const { address, networkId } = useWeb3Context();
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
      <Paper headerText={t`Prize Pool Info`}>
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
          <DataRow
            title={t`Winners / prize period`}
            balance={props.winners.toString()}
            isLoading={props.graphLoading}
          />
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

        <Box display="flex" flexDirection="row" justifyContent="center" m={"12px 0"}>
          <Typography>
            <Trans>Something not right, fren? Check Pool Together's UI below.</Trans>
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center">
          <SecondaryButton href={poolTogetherUILinks(networkId)[0]}>
            <Trans>sOHM Prize Pool</Trans>
          </SecondaryButton>
          <div className="marginedBtn">
            <SecondaryButton href={poolTogetherUILinks(networkId)[1]}>
              <Trans>sOHM Pool Details</Trans>
            </SecondaryButton>
          </div>
        </Box>
      </Paper>
    </Zoom>
  );
};
