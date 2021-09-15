import { Backdrop, Box, Fade, Grid, Link, Paper, SvgIcon, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import "./changenetwork.scss";
import useEscape from "../../hooks/useEscape";
import Button from "@material-ui/core/Button";
import { useWeb3Context } from "../../hooks/web3Context";
import { useEffect, useState } from "react";
import ethereum from "../../assets/ethereum.jpg";
import arbitrum from "../../assets/arbitrum.jpg";

function ChangeNetwork() {
  const { switchChain, chainName } = useWeb3Context();
  const history = useHistory();
  const [message, setMessage] = useState("");

  useEffect(() => {
    let newMessage = "";
    if (chainName !== "Unsupported Chain!") {
      newMessage = "You are currently connected to the " + chainName + " network.";
    } else {
      newMessage = "You are connected to an unsupported network. Please select a chain from the list below.";
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
              <div className="change-network-header">
                <Link styles="button" onClick={handleClose}>
                  <SvgIcon color="primary" component={XIcon} />
                </Link>

                <div className="change-network-header-name">
                  <Typography variant="h5">Change Network</Typography>
                </div>

                <div />
              </div>

              <Grid container spacing={2} className="grid-container">
                <Grid item xs={12} justifyContent="center">
                  <Typography variant="h6" align="center">
                    {message}
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Button
                    className="grid-button"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleSwitchChain(1)}
                  >
                    <Grid item xs={3} className="grid-button-content">
                      <img src={ethereum} alt="Ethereum Logo" />
                    </Grid>
                    <Grid item xs={9} className="grid-button-content">
                      <Typography>Ethereum</Typography>
                    </Grid>
                  </Button>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Button
                    className="grid-button"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleSwitchChain(42161)}
                  >
                    <Grid item xs={3} className="grid-button-content">
                      <img src={arbitrum} alt="Arbitrum Logo" />
                    </Grid>
                    <Grid item xs={9} className="grid-button-content">
                      <Typography>Arbitrum</Typography>
                    </Grid>
                  </Button>
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
