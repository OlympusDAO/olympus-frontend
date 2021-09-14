import { Backdrop, Fade, Grid, Link, Paper, SvgIcon, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import "./changenetwork.scss";
import useEscape from "../../hooks/useEscape";

function ChangeNetwork() {
  const history = useHistory();

  const handleClose = () => {
    history.goBack();
    history.push("/network");
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
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

export default ChangeNetwork;
