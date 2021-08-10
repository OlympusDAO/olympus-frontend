import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, SvgIcon, Typography, Popper, Paper, Divider, Link, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/v1.2/arrow-up.svg";
import { ReactComponent as CaretDownIcon } from "../../assets/icons/v1.2/caret-down.svg";
import { useWeb3Context } from "src/hooks/web3Context";

function ConnectMenu({ theme }) {
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
    clickFunc = handleClick;
  }

  const open = Boolean(anchorEl);
  const id = open ? "ohm-popper-pending" : undefined;

  const primaryColor = theme === "light" ? "#49A1F2" : "#F8CC82";
  const buttonStyles =
    "pending-txn-container" + (isHovering && pendingTransactions.length > 0 ? " hovered-button" : "");

  const getEtherscanUrl = txnHash => {
    return chainID === 4 ? "https://rinkeby.etherscan.io/tx/" + txnHash : "https://etherscan.io/tx/" + txnHash;
  };

  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <div className="wallet-menu" id="wallet-menu">
      <Button
        className={buttonStyles}
        variant="contained"
        color="secondary"
        size="large"
        style={pendingTransactions.length > 0 ? { color: primaryColor } : {}}
        onClick={clickFunc}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        key={1}
      >
        {buttonText}
        {pendingTransactions.length > 0 && (
          <Slide direction="left" in={isHovering} {...{ timeout: 333 }}>
            <SvgIcon className="caret-down" component={CaretDownIcon} htmlColor={primaryColor} />
          </Slide>
        )}
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
        <Paper className="ohm-menu" elevation={1}>
          {pendingTransactions.map(x => (
            <Link key={x.txnHash} href={getEtherscanUrl(x.txnHash)} color="primary" target="_blank" rel="noreferrer">
              <div className="pending-txn-container">
                <Typography style={{ color: primaryColor }}>{x.text}</Typography>
                <SvgIcon component={ArrowUpIcon} htmlColor={primaryColor} />
              </div>
            </Link>
          ))}
          <Box className="add-tokens">
            <Divider color="secondary" />
            <Button variant="text" color="secondary" onClick={disconnect}>
              <Typography>Disconnect</Typography>
            </Button>
          </Box>
        </Paper>
      </Popper>
    </div>
  );
}

export default ConnectMenu;
