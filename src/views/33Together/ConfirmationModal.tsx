import { Backdrop, Box, Button, Fade, Modal, Paper, SvgIcon, Typography, useTheme } from "@material-ui/core";
import ArrowForwardOutlinedIcon from "@material-ui/icons/ArrowForwardOutlined";

import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";
import { ReactComponent as sOhmTokenImg } from "../../assets/tokens/token_sOHM.svg";

interface IConfirmationModalProps {
  readonly quantity: number;
  readonly show: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => void;
}

export const ConfirmationModal = (props: IConfirmationModalProps) => {
  const theme = useTheme();
  return (
    <Modal open={props.show} onClose={props.onClose}>
      <Fade in={true}>
        <Backdrop open>
          <Paper className="ohm-card ohm-modal" style={{ maxWidth: "450px" }}>
            <Button style={{ alignSelf: "flex-start" }}>
              <SvgIcon component={XIcon} color="primary" onClick={props.onClose} />
            </Button>
            <Box className="card-content pool-deposit-confirmation">
              <Typography variant="h4">Confirm Deposit</Typography>
              <Box display="flex" className="swap-icons">
                <Box className="pool-deposit-confirmation">
                  <SvgIcon component={sOhmTokenImg} viewBox="0 0 100 100" className="swap-icon-size" />
                </Box>
                <SvgIcon component={ArrowForwardOutlinedIcon} viewBox="-12 -22 48 48" className="swap-icon-size" />
                <Box className="pool-deposit-confirmation">
                  <SvgIcon component={t33TokenImg} viewBox="0 0 1000 1000" className="swap-icon-size" />
                </Box>
              </Box>
              <Typography variant="body2" className="info-text">
                You're depositing <strong>{props.quantity} sOhm </strong>in the
                <strong> (3, 3) Together Pool </strong>
              </Typography>
              <Typography variant="h6" className="header" style={{ color: (theme.palette as any).highlight }}>
                Please Note:
              </Typography>
              <Typography variant="body2" className="info-text">
                <em>
                  By entering the 3,3 Together Pool, you understand that you will <strong>not</strong> receive your
                  normal sOHM rebase reward and that it will instead go directly into funding the prize pool.
                </em>
              </Typography>
              <Typography variant="body2" className="info-text">
                <strong>Additionally, there is a 3% early exit fee for withdrawing in under 6 days.</strong>
              </Typography>
              <Button variant="contained" color="primary" className="confirm-btn" onClick={props.onSubmit}>
                Confirm
              </Button>
            </Box>
          </Paper>
        </Backdrop>
      </Fade>
    </Modal>
  );
};
