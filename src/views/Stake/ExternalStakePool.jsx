import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { Skeleton } from "@material-ui/lab";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import BondLogo from "../../components/BondLogo";
import avaxImage from "src/assets/tokens/avax.png";
import gOhmImage from "src/assets/tokens/gohm.png";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { getLusdData } from "../../slices/LusdSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim } from "../../helpers";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import MultiLogo from "src/components/MultiLogo";

export default function ExternalStakePool() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connect } = useWeb3Context();
  const networkId = useSelector(state => state.network.networkId);
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

  const isLusdLoading = useSelector(state => state.lusdData.loading);
  const lusdData = useSelector(state => {
    return state.lusdData;
  });

  const ohmLusdReserveBalance = useSelector(state => {
    return state.account && state.account.bonds?.ohm_lusd_lp?.balance;
  });

  const loadLusdData = async () => {
    await dispatch(getLusdData({ address: address, provider: provider, networkID: networkId }));
  };

  const avatarStyle = { height: "35px", width: "35px", marginInline: "-4px", marginTop: "16px" };

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
    if (walletChecked) {
      loadLusdData();
    }
  }, [walletChecked]);

  return (
    <Zoom in={true}>
      <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
        <div className="card-header">
          <Typography variant="h5">
            <Trans>Farm Pool</Trans>
          </Typography>
        </div>
        <div className="card-content">
          {!isSmallScreen ? (
            <TableContainer className="stake-table">
              <Table>
                {/* <TableHead>
                  <TableRow>
                    <TableCell>
                      <Trans>Asset</Trans>
                    </TableCell>
                    <TableCell align="left">
                      <Trans>APY</Trans>
                    </TableCell>
                    <TableCell align="left">
                      <Trans>TVD</Trans>
                      <InfoTooltip>
                        <Trans>Total Value Deposited</Trans>
                      </InfoTooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Trans>Balance</Trans>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead> */}

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box className="ohm-pairs">
                        {/* <BondLogo bond={{ bondIconSvg: OhmLusdImg, isLP: true }}></BondLogo> */}
                        <MultiLogo images={[gOhmImage, avaxImage]} avatarStyleOverride={avatarStyle} />
                        <Box width="16px" />
                        <Typography>gOHM-AVAX</Typography>
                      </Box>
                    </TableCell>
                    {/* <TableCell align="left">
                      {isLusdLoading ? (
                        <Skeleton width="80px" />
                      ) : lusdData.apy === 0 ? (
                        "Coming Soon"
                      ) : (
                        trim(lusdData.apy, 1) + "%"
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {isLusdLoading ? (
                        <Skeleton width="80px" />
                      ) : (
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        }).format(lusdData.tvl)
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {isLusdLoading ? <Skeleton width="80px" /> : (trim(ohmLusdReserveBalance, 2) || 0) + " SLP"}
                    </TableCell> */}
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="secondary"
                        href="https://traderjoexyz.com/#/pool/0x321e7092a180bb43555132ec53aaa65a5bf84251/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
                        target="_blank"
                        className="stake-lp-button"
                      >
                        <Typography variant="body1">
                          <Trans>Stake on Trader Joe</Trans>
                        </Typography>
                        <SvgIcon component={ArrowUp} color="primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="stake-pool">
              <div className={`pool-card-top-row ${isMobileScreen && "small"}`}>
                <Box className="ohm-pairs">
                  <MultiLogo images={[gOhmImage, avaxImage]} avatarStyleOverride={avatarStyle} />
                  <Box width="16px" />
                  <Typography gutterBottom={false}>gOHM-AVAX</Typography>
                </Box>
              </div>
              <div className="pool-data">
                {/* <div className="data-row">
                  <Typography>APY</Typography>
                  <Typography>
                    {isLusdLoading ? (
                      <Skeleton width="80px" />
                    ) : lusdData.apy === 0 ? (
                      t`Coming Soon`
                    ) : (
                      trim(lusdData.apy, 1) + "%"
                    )}
                  </Typography>
                </div>
                <div className="data-row">
                  <Typography>
                    <Trans>TVD</Trans>
                    <InfoTooltip>
                      <Trans>Total Value Deposited</Trans>
                    </InfoTooltip>
                  </Typography>
                  <Typography>
                    {isLusdLoading ? (
                      <Skeleton width="80px" />
                    ) : (
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(lusdData.tvl)
                    )}
                  </Typography>
                </div>
                <div className="data-row">
                  <Typography>
                    <Trans>Balance</Trans>
                  </Typography>
                  <Typography>
                    {isLusdLoading ? <Skeleton width="80px" /> : (trim(lusdData.balance, 2) || 0) + "LP"}
                  </Typography>
                </div> */}

                <Button
                  variant="outlined"
                  color="secondary"
                  href="https://traderjoexyz.com/#/pool/0x321e7092a180bb43555132ec53aaa65a5bf84251/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
                  target="_blank"
                  className="stake-lp-button"
                  fullWidth
                >
                  <Typography variant="body1">
                    <Trans>Stake on Trader Joe</Trans>
                  </Typography>
                  <SvgIcon component={ArrowUp} color="primary" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Paper>
    </Zoom>
  );
}
