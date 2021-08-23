import {
  Typography,
  Box,
  Modal,
  Paper,
  SvgIcon,
  IconButton,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
} from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import "./bondSettings.scss";

interface IAdvancedSettingsProps {
  readonly open: boolean;
  readonly recipientAddress: string;
  readonly slippage: number;
  readonly handleClose: () => void;
  readonly onRecipientAddressChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  readonly onSlippageChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

function AdvancedSettings({
  open,
  handleClose,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}: IAdvancedSettingsProps) {
  return (
    <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
      <Paper className="ohm-card ohm-popover">
        <Box display="flex">
          <IconButton onClick={handleClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
          <Typography variant="h3">Hades</Typography>
        </Box>

        <Box className="card-content">
          <InputLabel htmlFor="slippage">Slippage</InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput
              id="slippage"
              value={slippage}
              onChange={onSlippageChange}
              type="number"
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
            <div className="help-text">
              <Typography variant="body2" color="textSecondary">
                Transaction may revert if price changes by more than slippage %
              </Typography>
            </div>
          </FormControl>

          <InputLabel htmlFor="recipient">Recipient Address</InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput id="recipient" value={recipientAddress} onChange={onRecipientAddressChange} type="text" />
            <div className="help-text">
              <Typography variant="body2" color="textSecondary">
                Choose recipient address. By default, this is your currently connected address
              </Typography>
            </div>
          </FormControl>
        </Box>
      </Paper>
    </Modal>
  );
}

export default AdvancedSettings;
