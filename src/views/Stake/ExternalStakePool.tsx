import { useEffect, useState, ElementType } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, Paper, SvgIcon, withStyles, Typography, Zoom, useTheme, makeStyles } from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import allPools from "src/helpers/AllExternalPools";
import { ExternalPool } from "src/lib/ExternalPool";

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
  stakeOnButton: {
    padding: theme.spacing(1),
    maxHeight: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stakePoolsWrapper: {
    display: "grid",
    gridTemplateColumns: `1.5fr 0.5fr 0.5fr 0.5fr 1.5fr auto`,
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

const MobileStakePool = ({ pool }: { pool: ExternalPool }) => {
  const styles = useStyles();
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
          <Trans>APY</Trans>
        </Typography>
        <Typography className="bond-price">
          <>{pool.apy}</>
        </Typography>
      </div>
      <div className="data-row">
        <Typography>
          <Trans>TVL</Trans>
        </Typography>
        <Typography>
          <>TVL amount in Dollars</>
        </Typography>
      </div>
      <div className="data-row">
        <Typography>
          <Trans>Balance</Trans>
        </Typography>
        <Typography>
          <>10.0LP</>
        </Typography>
      </div>
      {/* Pool Staking Linkouts */}
      <Box sx={{ display: "flex", flexBasis: "100px", flexGrow: 1, maxWidth: "500px" }}>
        <Button
          className={styles.stakeOnButton}
          variant="outlined"
          color="secondary"
          target="_blank"
          href={pool.href}
          fullWidth
        >
          <Typography variant="body1">{`${t`Stake on`} ${pool.stakeOn}`}</Typography>
          <SvgIcon
            component={ArrowUp}
            style={{
              position: "absolute",
              right: 5,
              height: `20px`,
              width: `20px`,
              verticalAlign: "middle",
            }}
          />
        </Button>
      </Box>
    </Paper>
  );
};

const StakePool = ({ pool }: { pool: ExternalPool }) => {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <Box style={{ gap: theme.spacing(1.5) }} className={styles.stakePoolsWrapper}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <MultiLogo icons={pool.icons} />
        <Typography gutterBottom={false} style={{ lineHeight: 1.4, marginLeft: "10px" }}>
          {pool.poolName}
        </Typography>
      </Box>
      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
        {pool.apy}
      </Typography>
      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
        $624,829
      </Typography>
      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
        10.0LP
      </Typography>
      <Box sx={{ display: "flex", flexBasis: "100px", flexGrow: 1, maxWidth: "500px" }}>
        <Button
          className={styles.stakeOnButton}
          variant="outlined"
          color="secondary"
          target="_blank"
          href={pool.href}
          fullWidth
        >
          <Typography variant="body1">{`${t`Stake on`} ${pool.stakeOn}`}</Typography>
          <SvgIcon
            component={ArrowUp}
            style={{
              position: "absolute",
              right: 5,
              height: `20px`,
              width: `20px`,
              verticalAlign: "middle",
            }}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default function ExternalStakePool() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connect, networkId, providerInitialized } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  // const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const theme = useTheme();
  const styles = useStyles();

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
          {allPools.map(pool => (
            <MobileStakePool pool={pool} />
          ))}
        </>
      ) : (
        <Paper className={`ohm-card secondary`}>
          <div className="card-header">
            <Typography variant="h5">
              <Trans>Farm Pool</Trans>
            </Typography>
          </div>
          <Box className={styles.stakePoolsWrapper} style={{ marginBottom: "0.5rem" }}>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText} style={{ marginLeft: "93px" }}>
              Asset
            </Typography>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText}>
              APY
            </Typography>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText}>
              TVD
            </Typography>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText}>
              Balance
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(4), padding: "16px" }}>
            {allPools.map(pool => (
              <StakePool pool={pool} />
            ))}
          </Box>
        </Paper>
      )}
    </Zoom>
  );
}
