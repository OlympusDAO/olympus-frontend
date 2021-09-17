import { Backdrop, Fade, Grid, Link, Paper, SvgIcon, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import "./changenetwork.scss";
import useEscape from "../../hooks/useEscape";
import Button from "@material-ui/core/Button";
import { useWeb3Context } from "../../hooks/web3Context";
import { useEffect, useState } from "react";
import arbitrum from "../../assets/arbitrum.png";
import ethereum from "../../assets/ethereum.png";

function ChangeNetwork() {
  const { switchChain, chainName } = useWeb3Context();
  const history = useHistory();
  const [message, setMessage] = useState("");

  useEffect(() => {
    let newMessage = "";
    if (chainName !== "Unsupported Chain!") {
      newMessage = "You are currently on the " + chainName + " network.";
    } else {
      newMessage = "You are connected to an unsupported network. Please select a network from the list below.";
    }
    setMessage(newMessage);
  }, [chainName]);

  const handleClose = () => {
    history.goBack();
    history.push("/network");
  };

  const handleSwitchChain = id => {
    return () => {
      switchChain(id);
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
                <Grid className="grid-header" item xs={12}>
                  <Grid className="grid-header-content">
                    <Link styles="button" onClick={handleClose}>
                      <SvgIcon color="primary" component={XIcon} />
                    </Link>
                  </Grid>
                  <Grid className="grid-header-content">
                    <Typography variant="h5">Select a Network</Typography>
                  </Grid>
                  <Grid />
                </Grid>

                <Grid className="grid-message">
                  {chainName !== "Unsupported Chain!" ? (
                    <Typography className="grid-message-typography">
                      You are currently on the&nbsp;
                      <Typography className="chain-highlight">{chainName}</Typography>
                      &nbsp;network.
                    </Typography>
                  ) : (
                    <Typography className="grid-message-typography">
                      You are connected to an unsupported network. Please select a network from the list below.
                    </Typography>
                  )}
                </Grid>

                <Grid className="grid-buttons">
                  <Grid className={chainName === "Ethereum" ? "grid-button current" : "grid-button"}>
                    <Button fullWidth fullHeight onClick={handleSwitchChain(1)}>
                      <Grid className="grid-button-content">
                        <img className="grid-button-icon" src={ethereum} alt="Ethereum Logo" />
                      </Grid>
                      <Grid className="grid-button-content right">
                        <Typography>Ethereum</Typography>
                      </Grid>
                    </Button>
                  </Grid>

                  <Grid className={chainName === "Arbitrum" ? "grid-button current" : "grid-button"}>
                    <Button fullWidth fullHeight onClick={handleSwitchChain(42161)}>
                      <Grid className="grid-button-content">
                        <img className="grid-button-icon" src={arbitrum} alt="Arbitrum Logo" />
                      </Grid>
                      <Grid className="grid-button-content grid-button-text">
                        <Typography>Arbitrum</Typography>
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
