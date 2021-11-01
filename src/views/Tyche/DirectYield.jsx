import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Paper, Typography, Button, Zoom } from "@material-ui/core";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3Context } from "src/hooks/web3Context";
import { changeGive } from "../../slices/StreamThunk";
import { RecipientModal } from "./RecipientModal";
import YieldRecipients from "./YieldRecipients";

export default function YieldDirector() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddRecipient = async (walletAddress, depositAmount, depositAmountDiff) => {
    if (isNaN(depositAmount) || depositAmount === 0 || depositAmount === "" || depositAmountDiff === 0) {
      return dispatch(error("Please enter a value!"));
    }

    await dispatch(
      changeGive({
        action: "give",
        value: depositAmount.toString(),
        recipient: walletAddress,
        provider,
        address,
        networkID: chainID,
      }),
    );

    setIsModalOpen(false);
  };

  return (
    <Zoom in={true}>
      <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
        <div className="card-header">
          <Typography variant="h5">Yield Director</Typography>
          <Button
            variant="outlined"
            color="secondary"
            className="stake-lp-button"
            onClick={() => handleAddButtonClick()}
            disabled={!address}
          >
            <Typography variant="body1">Add Recipient</Typography>
          </Button>
        </div>
        <RecipientModal isModalOpen={isModalOpen} callbackFunc={handleAddRecipient} cancelFunc={handleModalCancel} />
        <YieldRecipients />
      </Paper>
    </Zoom>
  );
}
