import { useEffect } from "react";
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
import OhmLusdImg from "src/assets/tokens/OHM-LUSD.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { getLusdData } from "../../slices/LusdSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim } from "../../helpers";

export default function ExternalStakePool() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

  const isLusdLoading = useSelector(state => state.lusdData.loading);
  const lusdData = useSelector(state => {
    return state.lusdData;
  });

  const loadLusdData = async () => {
    await dispatch(getLusdData({ address: address, provider: provider, networkID: chainID }));
  };

  useEffect(() => {
    loadLusdData();
  }, [provider]);

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
                    <TableCell align="left">APR</TableCell>
                    <TableCell align="left">TVL</TableCell>
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
                      {isLusdLoading ? <Skeleton width="80px" /> : trim(lusdData.apy, 1) + "%"}
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
                      {isLusdLoading ? <Skeleton width="80px" /> : (trim(lusdData.balance, 2) || 0) + "LP"}
                    </TableCell>
                    <TableCell align="center">
                      {/* TODO (appleseed-lusd): update link to permanent farm */}
                      <Button
                        variant="outlined"
                        color="secondary"
                        href="https://app.pickle.finance/farms"
                        target="_blank"
                        className="stake-lp-button"
                      >
                        <Typography variant="body1">Stake on Pickle</Typography>
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
                  <Typography>APR</Typography>
                  <Typography>{isLusdLoading ? <Skeleton width="80px" /> : trim(lusdData.apy, 1) + "%"}</Typography>
                </div>
                <div className="data-row">
                  <Typography>TVL</Typography>
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

                {/* TODO (appleseed-lusd): update link to permanent farm */}
                <Button
                  variant="outlined"
                  color="secondary"
                  href="https://app.pickle.finance/farms"
                  target="_blank"
                  className="stake-lp-button"
                  fullWidth
                >
                  <Typography variant="body1">Stake on Pickle</Typography>
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
