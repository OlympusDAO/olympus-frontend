import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Paper,
  Typography,
  Button,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
  Zoom,
} from "@material-ui/core";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3Context } from "src/hooks/web3Context";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import { DirectAddRecipientModal } from "./DirectAddRecipientModal";

export default function YieldDirector() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

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
      //   loadLusdData();
    }
  }, [walletChecked]);

  return (
    <Zoom in={true}>
      <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
        <div className="card-header">
          <Typography variant="h5">Yield Director</Typography>
          <Button
            variant="outlined"
            color="secondary"
            className="stake-lp-button"
            onClick={() => setIsModalHidden(false)}
            disabled={!address}
          >
            <Typography variant="body1">Add Recipient</Typography>
          </Button>
        </div>
        <DirectAddRecipientModal isModalHidden={isModalHidden} setIsModalHidden={() => setIsModalHidden(true)} />
        <div className="card-content">
          <TableContainer className="stake-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Recipient</TableCell>
                  <TableCell align="left">
                    % of Total <InfoTooltip message="etc" />
                  </TableCell>
                  <TableCell align="left">
                    Total Yield <InfoTooltip message="etc" />
                  </TableCell>
                  <TableCell align="left">
                    Balance <InfoTooltip message="etc" />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>Recipient 1</TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
    </Zoom>
  );
}
