import { useEffect, useState, ElementType } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { Box, Typography, Paper, Zoom, useTheme, makeStyles } from "@material-ui/core";
import { SecondaryButton } from "@olympusdao/component-library";
import { t, Trans } from "@lingui/macro";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3Context } from "src/hooks/web3Context";
import allPools, { fetchPoolData } from "src/helpers/AllExternalPools";
import { ExternalPoolwBalance } from "src/lib/ExternalPool";
import { Skeleton } from "@material-ui/lab";

export const useExternalPools = (address: string) => {
  const { isLoading, data } = useQuery(["externalPools", address], () => fetchPoolData(address), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: allPools,
  });
  return { isLoading, pools: data };
};

const MultiLogo = ({ icons, size = 35 }: { icons: ElementType[]; size?: number }) => (
  <>
    {icons.map((Icon, i) => (
      <Icon
        style={{
          height: size,
          width: size,
          ...(i !== 0 ? { marginLeft: -(size / 5), zIndex: 1 } : { zIndex: 2 }),
        }}
      />
    ))}
  </>
);

const useStyles = makeStyles(theme => ({
  stakePoolsWrapper: {
    display: "grid",
    gridTemplateColumns: `1.2fr 0.5fr 0.5fr 1.0fr auto`,
    gridTemplateRows: "auto",
    alignItems: "center",
  },
  stakePoolHeaderText: {
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
  },
  poolPair: {
    display: "flex !important",
    alignItems: "center",
    justifyContent: "left",
    marginBottom: "15px",
  },
  poolName: {
    marginLeft: "10px",
  },
}));

const MobileStakePool = ({ pool }: { pool: ExternalPoolwBalance; isLoading: Boolean }) => {
  const styles = useStyles();
  const { connected } = useWeb3Context();
  return (
    <Paper id={`${pool.poolName}--pool`} className="bond-data-card ohm-card">
      <div className={styles.poolPair}>
        <MultiLogo icons={pool.icons} />
        <div className={styles.poolName}>
          <Typography>{pool.poolName}</Typography>
        </div>
      </div>
      <div className="data-row">
        <Typography>
          <Trans>TVL</Trans>
        </Typography>
        <Typography>
          <>{!pool.tvl ? <Skeleton width={30} /> : pool.tvl}</>
        </Typography>
      </div>
      {connected && pool.userBalance && (
        <div className="data-row">
          <Typography>
            <Trans>Balance</Trans>
          </Typography>
          <Typography>
            <>{!pool.userBalance ? <Skeleton width={30} /> : `${pool.userBalance} LP`}</>
          </Typography>
        </div>
      )}
      {/* Pool Staking Linkouts */}
      <Box sx={{ display: "flex", flexBasis: "100px", flexGrow: 1, maxWidth: "500px" }}>
        <SecondaryButton variant="outlined" target="_blank" href={pool.href} endIcon={"arrow-up"} fullWidth>
          {`${t`Stake on`} ${pool.stakeOn}`}
        </SecondaryButton>
      </Box>
    </Paper>
  );
};

const StakePool = ({ pool, isLoading }: { pool: ExternalPoolwBalance; isLoading: Boolean }) => {
  const theme = useTheme();
  const styles = useStyles();
  const { connected } = useWeb3Context();
  return (
    <Box style={{ gap: theme.spacing(1.5) }} className={styles.stakePoolsWrapper}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <MultiLogo icons={pool.icons} />
        <Typography gutterBottom={false} style={{ lineHeight: 1.4, marginLeft: "10px" }}>
          {pool.poolName}
        </Typography>
      </Box>
      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
        {!pool.tvl ? <Skeleton width={30} /> : pool.tvl}
      </Typography>
      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
        {!pool.userBalance ? <Skeleton width={30} /> : connected && pool.userBalance ? `${pool.userBalance} LP` : ""}
      </Typography>
      <Box sx={{ display: "flex", flexBasis: "100px", flexGrow: 1 }}>
        <SecondaryButton variant="outlined" target="_blank" href={pool.href} endIcon={"arrow-up"} fullWidth>
          {`${t`Stake on`} ${pool.stakeOn}`}
        </SecondaryButton>
      </Box>
    </Box>
  );
};

export default function ExternalStakePool() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connect, connected, networkId, providerInitialized } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  // const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const theme = useTheme();
  const styles = useStyles();
  const allStakePools = useExternalPools(address);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked && providerInitialized) {
      // view specific redux actions can be dispatched here
    }
  }, [walletChecked, networkId, providerInitialized, address, provider]);

  return (
    <Zoom in={true}>
      {isSmallScreen ? (
        <>
          {allStakePools?.pools?.map(pool => (
            <MobileStakePool pool={pool} isLoading={allStakePools?.isLoading} />
          ))}
        </>
      ) : (
        <Paper className={`ohm-card secondary`}>
          <div className="card-header">
            <Typography variant="h5">
              <Trans>Farm Pool</Trans>
            </Typography>
          </div>
          <Box className={styles.stakePoolsWrapper} style={{ gap: theme.spacing(1.5), marginBottom: "0.5rem" }}>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText} style={{ marginLeft: "75px" }}>
              Asset
            </Typography>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText}>
              TVL
            </Typography>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText}>
              {connected && `Balance`}
            </Typography>
          </Box>
          {allStakePools?.pools?.map(pool => (
            <StakePool pool={pool} isLoading={allStakePools?.isLoading} />
          ))}
        </Paper>
      )}
    </Zoom>
  );
}
