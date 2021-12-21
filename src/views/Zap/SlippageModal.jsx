import { Trans } from "@lingui/macro";
import {
  Box,
  Button,
  DialogTitle,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
  CircularProgress,
  Dialog,
  List,
  Paper,
  SvgIcon,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { trim } from "src/helpers";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";

function SlippageModal(handleClose, modalOpen, currentSlippage, setCustomSlippage, zapperCredit) {
  const [proposedSlippage, setProposedSlippage] = useState(currentSlippage);
  const [errorState, setErrorState] = useState(null);
  const handleChangeProposedSlippage = slippage => {
    try {
      const slippageNumber = Number(slippage);
      if (100 > slippageNumber > 0) {
        setProposedSlippage(slippage);
        if (slippageNumber < 1) {
          setErrorState("Lower slippage than recommended may cause transaction to fail");
        } else {
          setErrorState(null);
        }
      } else {
        setErrorState("Slippage must be between 0 and 100");
      }
    } catch (e) {
      console.error(e);
      setErrorState("Enter a valid slippage percentage");
    }
  };
  useEffect(() => handleChangeProposedSlippage(currentSlippage), [modalOpen]);
  const presetSlippageOptions = ["2.0", "3.0", "4.0"];
  return (
    <Dialog onClose={handleClose} open={modalOpen} fullWidth maxWidth="xs" id="zap-select-token-modal">
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Button onClick={handleClose}>
            <SvgIcon component={XIcon} color="primary" />
          </Button>
          <Box paddingRight={6}>
            <Typography id="migration-modal-title" variant="h6" component="h2">
              <Trans>Adjust Slippage</Trans>
            </Typography>
          </Box>
          <Box />
        </Box>
      </DialogTitle>
      <Box paddingX="36px" paddingBottom="36px">
        <Typography color="textSecondary">
          <Trans>Important: Recommended slippage is 2-3% to avoid a failed transaction.</Trans>
        </Typography>
      </Box>
      <Box paddingX="64px" paddingBottom="16px">
        {/* <Paper style={{ maxHeight: 300, overflow: "auto", borderRadius: 10 }}> */}
        <FormControl className="slippage-input" variant="outlined" color="primary" size="sm">
          <OutlinedInput
            id="zap-amount-input"
            type="number"
            placeholder="Enter Slippage Tolerance"
            // className="slippage-input"
            value={proposedSlippage}
            onChange={e => handleChangeProposedSlippage(e.target.value)}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
          />
        </FormControl>

        <Box display="flex" flexDirection="row" justifyContent="space-between">
          {presetSlippageOptions.map(slippage => (
            <Button variant="outlined" onClick={() => handleChangeProposedSlippage(slippage)}>
              <Typography>{`${slippage}%`}</Typography>
            </Button>
          ))}
        </Box>
        <Box paddingY="16px">{errorState ? <Typography color="red">{errorState}</Typography> : null}</Box>
        <Box display="flex" justifyContent={"center"}>
          <Button
            variant="contained"
            color="primary"
            disabled={errorState != null}
            onClick={() => {
              if (errorState != null) {
                return;
              }
              setCustomSlippage(trim(proposedSlippage, 1));
              handleClose();
            }}
          >
            <Typography>Adjust Slippage</Typography>
          </Button>
        </Box>
        {/* </Paper> */}
        {zapperCredit}
      </Box>
    </Dialog>
  );
}

export default SlippageModal;
