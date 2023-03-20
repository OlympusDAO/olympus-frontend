import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataRow, InfoTooltip, Paper, PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { prettifySeconds } from "src/helpers/timeUtil";
import { IWarmupBalances, useWarmupClaim, useWarmupDate } from "src/hooks/useWarmupInfo";
import { formatBalance } from "src/views/Stake/components/StakeArea/components/StakeBalances";
import { useClaimToken } from "src/views/Stake/components/StakeArea/components/StakeInputArea/hooks/useClaimToken";
import { useForfeitToken } from "src/views/Stake/components/StakeArea/components/StakeInputArea/hooks/useForfeitToken";
import { useAccount } from "wagmi";

const PREFIX = "ExternalStakePools";

const classes = {
  stakePoolsWrapper: `${PREFIX}-stakePoolsWrapper`,
  stakePoolHeaderText: `${PREFIX}-stakePoolHeaderText`,
  poolPair: `${PREFIX}-poolPair`,
  poolName: `${PREFIX}-poolName`,
};

const StyledTableHeader = styled(TableHead)(({ theme }) => ({
  [`&.${classes.stakePoolHeaderText}`]: {
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
  },
}));

const StyledPoolInfo = styled("div")(() => ({
  [`&.${classes.poolPair}`]: {
    display: "flex !important",
    alignItems: "center",
    justifyContent: "left",
    marginBottom: "15px",
  },

  [`& .${classes.poolName}`]: {
    marginLeft: "10px",
  },
}));

export const ClaimsArea = () => {
  const { isConnected } = useAccount();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const { data: claim } = useWarmupClaim();
  const { data: warmupDate, isClaimable } = useWarmupDate();

  if (!isConnected || !claim || claim?.gohm.eq("0")) return <></>;
  const warmupTooltip = `Your claim earns rebases during warmup. You can emergency withdraw, but this forfeits the rebases`;

  return (
    <>
      {isSmallScreen ? (
        <Table>
          <Box display="flex" justifyContent="start" mt="42px">
            <Typography fontSize="24px" textAlign="left" fontWeight={600}>
              Your active gOHM claim{" "}
            </Typography>
            <Box>
              <InfoTooltip message={warmupTooltip} />
            </Box>
          </Box>
          <ActiveClaims isSmallScreen={isSmallScreen} claim={claim} warmupDate={warmupDate} isClaimable={isClaimable} />
        </Table>
      ) : (
        <Paper headerText={`Your active gOHM claim`} tooltip={warmupTooltip}>
          <Table>
            <StyledTableHeader className={classes.stakePoolHeaderText}>
              <TableRow>
                <TableCell style={{ width: "200px", padding: "8px 0" }}>Asset</TableCell>

                <TableCell style={{ width: "200px", padding: "8px 0" }}>Amount</TableCell>

                <TableCell style={{ width: "150px", padding: "8px 0" }}>Claimable In</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </StyledTableHeader>
            <ActiveClaims
              isSmallScreen={isSmallScreen}
              claim={claim}
              warmupDate={warmupDate}
              isClaimable={isClaimable}
            />
          </Table>
        </Paper>
      )}
    </>
  );
};

const ActiveClaims = ({
  isSmallScreen,
  claim,
  warmupDate,
  isClaimable,
}: {
  isSmallScreen: boolean;
  claim?: IWarmupBalances;
  warmupDate?: Date;
  isClaimable?: boolean;
}) => (
  <TableBody>
    {isSmallScreen ? (
      <MobileClaimInfo claim={claim} warmupDate={warmupDate} isClaimable={isClaimable} />
    ) : (
      <ClaimInfo claim={claim} warmupDate={warmupDate} isClaimable={isClaimable} />
    )}
  </TableBody>
);

const ClaimInfo = ({
  claim,
  warmupDate,
  isClaimable,
}: {
  claim?: IWarmupBalances;
  warmupDate?: Date;
  isClaimable?: boolean;
}) => {
  return (
    <TableRow>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
          <Token key={"gOHM"} name={"gOHM"} />
          <Box marginLeft="14px" marginRight="10px">
            <Typography>{`gOHM`}</Typography>
          </Box>
          {/* <Token name={NetworkId[props.pool.networkID] as OHMTokenProps["name"]} style={{ fontSize: "15px" }} /> */}
        </Box>
      </TableCell>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {!claim?.gohm ? <Skeleton width={60} /> : `${formatBalance(claim?.gohm)} gOHM`}
        </Typography>
      </TableCell>
      <TableCell style={{ padding: "8px 8px 8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {!warmupDate ? (
            <Skeleton width={60} />
          ) : isClaimable ? (
            "0 seconds"
          ) : (
            prettifySeconds((warmupDate.getTime() - new Date().getTime()) / 1000)
          )}
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <ActionButtons isClaimable={isClaimable} />
      </TableCell>
    </TableRow>
  );
};

const MobileClaimInfo = ({
  claim,
  warmupDate,
  isClaimable,
}: {
  claim?: IWarmupBalances;
  warmupDate?: Date;
  isClaimable?: boolean;
}) => {
  // const userBalances = useStakePoolBalance(props.pool);
  // const userBalance = userBalances[props.pool.networkID].data;

  return (
    <Box mt="42px">
      {/* StyledPoolInfo */}
      <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
        <Token key={"gOHM"} name={"gOHM"} />
        <Box marginLeft="14px" marginRight="10px">
          <Typography>{`gOHM`}</Typography>
        </Box>
        {/* <Token name={NetworkId[props.pool.networkID] as OHMTokenProps["name"]} style={{ fontSize: "15px" }} /> */}
      </Box>

      <DataRow
        title={`Amount`}
        isLoading={!claim?.gohm}
        balance={claim?.gohm ? formatBalance(claim?.gohm) : undefined}
      />
      <DataRow
        title={`Claimable In`}
        isLoading={!warmupDate}
        balance={
          !warmupDate
            ? undefined
            : isClaimable
            ? "0 seconds"
            : prettifySeconds((warmupDate.getTime() - new Date().getTime()) / 1000)
        }
      />

      <ActionButtons isClaimable={isClaimable} />
    </Box>
  );
};

const ActionButtons = ({ isClaimable = false }: { isClaimable?: boolean }) => {
  const claimMutation = useClaimToken();
  const forfeitMutation = useForfeitToken();

  const isForfeitable = !isClaimable;
  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
      <SecondaryButton
        loading={forfeitMutation.isLoading}
        sx={{ flexGrow: 1 }}
        onClick={() => forfeitMutation.mutate()}
        disabled={forfeitMutation.isLoading || !isForfeitable}
      >
        {forfeitMutation.isLoading ? `Withdrawing` : `Emergency Withdraw`}
      </SecondaryButton>
      <PrimaryButton
        loading={claimMutation.isLoading}
        sx={{ flexGrow: 1 }}
        onClick={() => claimMutation.mutate({ toToken: "gOHM" })}
        disabled={claimMutation.isLoading || !isClaimable}
      >
        {claimMutation.isLoading ? `Claiming` : `Claim`}
      </PrimaryButton>
    </Box>
  );
};
