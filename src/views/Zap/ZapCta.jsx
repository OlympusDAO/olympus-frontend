import { Box, Button, Paper, Typography, Grid, SvgIcon, Link } from "@material-ui/core";
import "./zap.scss";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import HeaderLogo from "./HeaderLogo";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  subHeader: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  buttonBox: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
}));

function ZapCta({ tokens }) {
  const classes = useStyles();
  return (
    <>
      <Paper className="ohm-card" id="olyzaps-cta">
        <Grid container display="flex" className="cta-box" wrap>
          <Grid item xs={5} sm={3} className="icons-box">
            <HeaderLogo images={tokens} />
          </Grid>
          <Grid item xs={7} sm={5}>
            <Box alignItems="center" display="flex" flexDirection="column">
              <Typography color="textPrimary" align="center" className="cta-header">
                Zap with more assets and stake <strong>OHM</strong>
              </Typography>
              <Typography
                color="textPrimary"
                align="center"
                className="cta-subheader"
                classes={{ root: classes.subHeader }}
              >
                All-in-One contract to save gas fees
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} className="button-box" classes={{ root: classes.buttonBox }}>
            <Link component={NavLink} to="/zap">
              <Button component="div" variant="outlined" color="secondary" className="learn-more-button">
                <Typography variant="body1">Swap into sOHM</Typography>
                <SvgIcon component={ArrowUp} color="primary" />
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default ZapCta;
