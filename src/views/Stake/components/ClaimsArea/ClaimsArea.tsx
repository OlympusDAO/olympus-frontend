import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataRow, Paper, PrimaryButton, SecondaryButton, Token } from "@olympusdao/component-library";
import { prettifySeconds } from "src/helpers/timeUtil";
import { IWarmupBalances, useWarmupClaim } from "src/hooks/useWarmupInfo";
import { useNextWarmupDate } from "src/views/Stake/components/StakeArea/components/RebaseTimer/hooks/useNextRebaseDate";
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
  const { data: warmupDate } = useNextWarmupDate();

  // if (!isConnected || !claim || claim?.gohm.eq("0")) return <></>;

  return (
    <>
      {isSmallScreen ? (
        <Table>
          <Box display="flex" justifyContent="start" mt="42px">
            <Typography fontSize="24px" textAlign="left" fontWeight={600}>
              Your active gOHM claim
            </Typography>
          </Box>
          <ActiveClaims isSmallScreen={isSmallScreen} claim={claim} warmupDate={warmupDate} />
        </Table>
      ) : (
        <Paper headerText={`Your active gOHM claim`}>
          <Table>
            <StyledTableHeader className={classes.stakePoolHeaderText}>
              <TableRow>
                <TableCell style={{ width: "250px", padding: "8px 0" }}>Asset</TableCell>

                <TableCell style={{ width: isConnected ? "100px" : "150px", padding: "8px 0" }}>Amount</TableCell>

                <TableCell style={{ width: isConnected ? "100px" : "150px", padding: "8px 0" }}>Claimable In</TableCell>
              </TableRow>
            </StyledTableHeader>
            <ActiveClaims isSmallScreen={isSmallScreen} claim={claim} warmupDate={warmupDate} />
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
}: {
  isSmallScreen: boolean;
  claim?: IWarmupBalances;
  warmupDate?: Date;
}) => (
  <TableBody>
    {isSmallScreen ? (
      <MobileClaimInfo claim={claim} warmupDate={warmupDate} />
    ) : (
      <ClaimInfo claim={claim} warmupDate={warmupDate} />
    )}
  </TableBody>
);

const ClaimInfo = ({ claim, warmupDate }: { claim?: IWarmupBalances; warmupDate?: Date }) => {
  const { isConnected } = useAccount();
  const claimMutation = useClaimToken();
  const forfeitMutation = useForfeitToken();
  // const userBalances = useStakePoolBalance(props.pool);
  // const userBalance = userBalances[props.pool.networkID].data;
  // const ToolTipContent = () => (
  //   <>
  //     <Typography pb={"5px"}>Mint and Sync Pool</Typography>
  //     <Link href="https://olympusdao.medium.com/mint-sync-ffde42a72c23" target="_blank">
  //       Learn More
  //     </Link>
  //   </>
  // );
  return (
    <TableRow>
      <TableCell style={{ padding: "8px 0" }}>
        <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
          <Token key={"gOHM"} name={"gOHM"} />
          <Box marginLeft="14px" marginRight="10px">
            <Typography>{`gOHM`}</Typography>
          </Box>
          {/* <Token name={NetworkId[props.pool.networkID] as OHMTokenProps["name"]} style={{ fontSize: "15px" }} /> */}
        </Box>
      </TableCell>
      <TableCell style={{ padding: "8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {!claim?.gohm ? <Skeleton width={60} /> : `${formatBalance(claim?.gohm)} gOHM`}
        </Typography>
      </TableCell>
      <TableCell style={{ padding: "8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {!warmupDate ? (
            <Skeleton width={60} />
          ) : (
            prettifySeconds((warmupDate.getTime() - new Date().getTime()) / 1000)
          )}
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <SecondaryButton
          loading={forfeitMutation.isLoading}
          className=""
          onClick={() => forfeitMutation.mutate()}
          disabled={forfeitMutation.isLoading}
        >
          {forfeitMutation.isLoading ? `Forfeiting` : `Forfeit`}
        </SecondaryButton>
        <PrimaryButton
          loading={claimMutation.isLoading}
          className=""
          onClick={() => claimMutation.mutate({ toToken: "gOHM" })}
          disabled={claimMutation.isLoading}
        >
          {claimMutation.isLoading ? `Claiming` : `Claim`}
        </PrimaryButton>
      </TableCell>
    </TableRow>
  );
};

const MobileClaimInfo = ({ claim, warmupDate }: { claim?: IWarmupBalances; warmupDate?: Date }) => {
  // const userBalances = useStakePoolBalance(props.pool);
  // const userBalance = userBalances[props.pool.networkID].data;
  const claimMutation = useClaimToken();
  const forfeitMutation = useForfeitToken();
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
        balance={warmupDate ? `${prettifySeconds((warmupDate.getTime() - new Date().getTime()) / 1000)}` : undefined}
      />

      <SecondaryButton
        loading={forfeitMutation.isLoading}
        className=""
        onClick={() => forfeitMutation.mutate()}
        disabled={forfeitMutation.isLoading}
      >
        {forfeitMutation.isLoading ? `Forfeiting` : `Forfeit`}
      </SecondaryButton>
      <PrimaryButton
        loading={claimMutation.isLoading}
        className=""
        onClick={() => claimMutation.mutate({ toToken: "gOHM" })}
        disabled={claimMutation.isLoading}
      >
        {claimMutation.isLoading ? `Claiming` : `Claim`}
      </PrimaryButton>
    </Box>
  );
};
