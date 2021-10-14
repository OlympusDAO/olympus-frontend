import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Paper,
  Typography,
  Button,
  SvgIcon,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
  Zoom,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import BondLogo from "../../components/BondLogo";
import { ReactComponent as OhmLusdImg } from "src/assets/tokens/OHM-LUSD.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { getLusdData } from "../../slices/LusdSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim } from "../../helpers";

export default function ExternalStakePool() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
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
    await dispatch(getLusdData({ address: address, provider: provider, networkID: chainID }));
  };

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
          <Typography variant="h5">Farm Pool</Typography>
        </div>
        <div className="card-content">
          {!isSmallScreen ? (
            <TableContainer className="stake-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell align="left">APY</TableCell>
                    <TableCell align="left">TVD</TableCell>
                    <TableCell align="left">Balance</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box className="ohm-pairs">
                        <BondLogo bond={{ bondIconSvg: OhmLusdImg, isLP: true }}></BondLogo>
                        <Typography>OHM-LUSD</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
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
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="secondary"
                        href="https://crucible.alchemist.wtf/reward-programs"
                        target="_blank"
                        className="stake-lp-button"
                      >
                        <Typography variant="body1">Stake in Crucible</Typography>
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
                  <BondLogo bond={{ bondIconSvg: OhmLusdImg, isLP: true }}></BondLogo>
                  <Typography gutterBottom={false}>OHM-LUSD</Typography>
                </Box>
              </div>
              <div className="pool-data">
                <div className="data-row">
                  <Typography>APY</Typography>
                  <Typography>
                    {isLusdLoading ? (
                      <Skeleton width="80px" />
                    ) : lusdData.apy === 0 ? (
                      "Coming Soon"
                    ) : (
                      trim(lusdData.apy, 1) + "%"
                    )}
                  </Typography>
                </div>
                <div className="data-row">
                  <Typography>TVD</Typography>
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
                  <Typography>Balance</Typography>
                  <Typography>
                    {isLusdLoading ? <Skeleton width="80px" /> : (trim(lusdData.balance, 2) || 0) + "LP"}
                  </Typography>
                </div>

                <Button
                  variant="outlined"
                  color="secondary"
                  href="https://crucible.alchemist.wtf/reward-programs"
                  target="_blank"
                  className="stake-lp-button"
                  fullWidth
                >
                  <Typography variant="body1">Stake in Crucible</Typography>
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
