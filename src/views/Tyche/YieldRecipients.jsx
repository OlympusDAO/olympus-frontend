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

export default function YieldRecipients() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);

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

  // TODO add fetching of yield directions

  return (
    <div className="card-content">
      <TableContainer className="stake-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recipient</TableCell>
              <TableCell align="left">
                Deposit
                <InfoTooltip message="The amount of sOHM deposited" />
              </TableCell>
              <TableCell align="left">
                Yield
                <InfoTooltip message="The amount of yield (in sOHM) directed to the recipient" />
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>Recipient 1</TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="right" width="10%" padding="none">
                {" "}
                <Button
                  variant="outlined"
                  color="secondary"
                  className="stake-lp-button"
                  onClick={() => setIsModalHidden(false)}
                  disabled={!address}
                >
                  <Typography variant="body1">Edit</Typography>
                </Button>
              </TableCell>
              <TableCell align="right" width="10%" padding="none">
                {" "}
                <Button
                  variant="outlined"
                  color="secondary"
                  className="stake-lp-button"
                  onClick={() => setIsModalHidden(false)}
                  disabled={!address}
                >
                  <Typography variant="body1">Stop</Typography>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
