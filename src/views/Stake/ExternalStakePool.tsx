import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import { Trans } from "@lingui/macro";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import avaxImage from "src/assets/tokens/avax.png";
import gOhmImage from "src/assets/tokens/gohm.png";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { getLusdData } from "../../slices/LusdSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import MultiLogo from "src/components/MultiLogo";
import { useAppSelector } from "../../hooks";

const avatarStyle = { height: "35px", width: "35px", marginInline: "-4px", marginTop: "16px" };

export default function ExternalStakePool() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connect } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

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
      dispatch(getLusdData({ address, provider, networkID: networkId }));
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
        <div className="card-content">
          {!isSmallScreen ? (
            <TableContainer className="stake-table">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box className="ohm-pairs">
                        <MultiLogo images={[gOhmImage, avaxImage]} avatarStyleOverride={avatarStyle} />
                        <Box width="16px" />
                        <Typography>gOHM-AVAX</Typography>
                      </Box>
                    </TableCell>
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
