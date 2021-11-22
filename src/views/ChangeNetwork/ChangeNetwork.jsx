import { Backdrop, Fade, Grid, Link, Paper, SvgIcon, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import "./changenetwork.scss";
import useEscape from "../../hooks/useEscape";
import Button from "@material-ui/core/Button";
import { useWeb3Context } from "../../hooks/web3Context";
import arbitrum from "../../assets/arbitrum.png";
import ethereum from "../../assets/tokens/wETH.svg";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchNetwork } from "../../slices/NetworkSlice";
import { NetworkID } from "../../lib/Bond";

function ChangeNetwork() {
  const dispatch = useDispatch();
  const { provider } = useWeb3Context();
  const networkName = useSelector(state => state.network.networkName);
  const history = useHistory();

  const handleClose = () => {
    history.goBack();
  };

  const handleSwitchChain = id => {
    return () => {
      dispatch(switchNetwork({ provider: provider, networkId: id }));
      handleClose();
    };
  };

  useEscape(() => {
    handleClose();
  });

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container id="change-network-view">
        <Backdrop open={true}>
          <Fade in={true}>
            <Paper className="ohm-card ohm-modal">
              <Grid container className="grid-container">
                <Grid className="grid-header">
                  <Grid>
                    <Link onClick={handleClose}>
                      <SvgIcon color="primary" component={XIcon} />
                    </Link>
                  </Grid>
                  <Grid className="grid-header-title" xs={10}>
                    <Typography variant="h5">Select a Network</Typography>
                  </Grid>
                  <Grid />
                </Grid>

                <Grid className="grid-message">
                  {networkName !== "Unsupported Chain!" ? (
                    <Typography className="grid-message-typography">
                      You are currently connected to the&nbsp;
                      <Typography className="chain-highlight">{networkName}</Typography>
                      &nbsp;network.
                    </Typography>
                  ) : (
                    <Typography className="grid-message-typography">
                      You are connected to an unsupported network. Please select a network from the list below.
                    </Typography>
                  )}
                </Grid>

                <Grid className="grid-buttons">
                  <Grid className={networkName === "Ethereum" ? "grid-button current" : "grid-button"}>
                    <Button fullWidth fullHeight onClick={handleSwitchChain(NetworkID.Mainnet)}>
                      <Grid className="grid-button-content">
                        <img className="grid-button-icon" src={ethereum} alt="Ethereum Logo" />
                      </Grid>
                      <Grid className="grid-button-content right">
                        <Typography className={networkName === "Ethereum" ? "current" : ""}>Ethereum</Typography>
                      </Grid>
                    </Button>
                  </Grid>

                  <Grid className={networkName === "Arbitrum" ? "grid-button current" : "grid-button"}>
                    <Button fullWidth fullHeight onClick={handleSwitchChain(NetworkID.Arbitrum)}>
                      <Grid className="grid-button-content">
                        <img className="grid-button-icon" src={arbitrum} alt="Arbitrum Logo" />
                      </Grid>
                      <Grid className="grid-button-content grid-button-text">
                        <Typography className={networkName === "Arbitrum" ? "current" : ""}>Arbitrum</Typography>
                      </Grid>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

export default ChangeNetwork;
