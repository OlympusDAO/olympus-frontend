import { useEffect, useState, ElementType } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, Paper, SvgIcon, withStyles, Typography, Zoom, useTheme, makeStyles } from "@material-ui/core";
import { t, Trans } from "@lingui/macro";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as avaxImage } from "src/assets/tokens/AVAX.svg";
import { ReactComponent as gOhmImage } from "src/assets/tokens/token_wsOHM.svg";
import { ReactComponent as wEthImage } from "src/assets/tokens/wETH.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import { useAppSelector } from "../../hooks";

interface StakePoolProps {
  poolName: string;
  icons: ElementType[];
  stakeOn: string;
  href: string;
  // apy: string;
}

const MultiLogo = ({ icons, size = 35 }: { icons: ElementType[]; size?: number }) => (
  <>
    {icons.map((Icon, i) => (
      <Icon style={{ height: size, width: size, ...(i !== 0 && { marginLeft: -(size / 3) }) }} />
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
}));

const StakePool = ({ poolName, icons, stakeOn, href }: StakePoolProps) => {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}
      style={{ gap: theme.spacing(1.5) }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexBasis: "300px", flexGrow: 2 }}>
        <MultiLogo icons={icons} />
        <Box width="16px" />
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {poolName} {/*<br /> <span style={{ color: theme.palette.text.secondary }}>APY: {apy}</span>*/}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexBasis: "200px", flexGrow: 1, maxWidth: "500px" }}>
        <Button
          className={styles.stakeOnButton}
          variant="outlined"
          color="secondary"
          target="_blank"
          href={href}
          fullWidth
        >
          <Typography variant="body1">{`${t`Stake on`} ${stakeOn}`}</Typography>
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
  const { provider, hasCachedProvider, address, connect, networkId } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  // const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const theme = useTheme();

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
    if (walletChecked && networkId !== -1) {
      // view specific redux actions can be dispatched here
    }
  }, [walletChecked, networkId, address, provider]);

  return (
    <Zoom in={true}>
      <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
        <div className="card-header">
          <Typography variant="h5">
            <Trans>Farm Pool</Trans>
          </Typography>
        </div>
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          style={{ gap: theme.spacing(4) /* material says 'gap' does not exist 😡 */ }}
        >
          <StakePool
            poolName="gOHM-AVAX"
            icons={[gOhmImage, avaxImage]}
            stakeOn="Trader Joe"
            // apy={"11.08% + 28.51%"}
            href="https://traderjoexyz.com/#/farm/0xB674f93952F02F2538214D4572Aa47F262e990Ff-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00"
          />
          <StakePool
            poolName="gOHM-AVAX"
            icons={[gOhmImage, avaxImage]}
            stakeOn="Pangolin"
            // apy={"18.00% + 68.00%"}
            href="https://app.pangolin.exchange/#/png/0x321E7092a180BB43555132ec53AaA65a5bF84251/AVAX/2"
          />
          <StakePool
            poolName="gOHM-wETH"
            icons={[gOhmImage, wEthImage]}
            stakeOn="Sushi (Arbitrum)"
            // apy={"43.99% + 4.65%"}
            href="https://app.sushi.com/farm?filter=2x"
          />
          <StakePool
            poolName="gOHM-wETH"
            icons={[gOhmImage, wEthImage]}
            stakeOn="Sushi (Polygon)"
            // apy={"62.98% + 10.90%"}
            href="https://app.sushi.com/farm?filter=2x"
          />
          {/* <StakePool
            poolName="gOHM-FTM"
            icons={[gOhmImage, ftmImage]}
            stakeOn="SpiritSwap"
            apy={"10031"}
            href="https://swap.spiritswap.finance/#/exchange/swap/0x91fa20244Fb509e8289CA630E5db3E9166233FDc"
          /> */}
        </Box>
      </Paper>
    </Zoom>
  );
}
