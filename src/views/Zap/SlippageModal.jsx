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
} from "@material-ui/core";
import { useState } from "react";
import { trim } from "src/helpers";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";

function SlippageModal(handleClose, modalOpen, currentSlippage, setCustomSlippage, zapperCredit) {
  const [proposedSlippage, setProposedSlippage] = useState(currentSlippage);
  return (
    <Dialog onClose={handleClose} open={modalOpen} keepMounted fullWidth maxWidth="xs" id="zap-select-token-modal">
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
      <Box paddingX="36px" paddingBottom="36px" paddingTop="12px">
        {/* <Paper style={{ maxHeight: 300, overflow: "auto", borderRadius: 10 }}> */}
        <FormControl className="zap-input" variant="outlined" color="primary">
          <InputLabel htmlFor="amount-input"></InputLabel>
          <OutlinedInput
            id="zap-amount-input"
            type="number"
            placeholder="Enter Amount"
            className="zap-input"
            value={proposedSlippage}
            onChange={e => setProposedSlippage(e.target.value)}
          />
        </FormControl>
        {/* </Paper> */}
        {zapperCredit}
      </Box>
    </Dialog>
  );
}

export default SlippageModal;
