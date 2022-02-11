import { Box, Button, Typography, useTheme } from "@material-ui/core";
import { Icon, Modal, Token } from "@olympusdao/component-library";
interface IConfirmationModalProps {
  readonly quantity: number;
  readonly show: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => void;
}

export const ConfirmationModal = (props: IConfirmationModalProps) => {
  const theme = useTheme();
  return (
    <Modal open={props.show} onClose={props.onClose} maxWidth="450px" minHeight="450px">
      <>
        <Box className="card-content pool-deposit-confirmation">
          <Typography variant="h4">Confirm Deposit</Typography>
          <Box display="flex" className="swap-icons">
            <Box className="pool-deposit-confirmation">
              <Token name="sOHM" style={{ fontSize: "56px" }} />
            </Box>
            <Box pl={"30px"}>
              <Icon name="arrow-right" style={{ fontSize: "3.2rem" }} viewBox="12 -4 20 20" />
            </Box>
            <Box className="pool-deposit-confirmation">
              <Token name="33T" style={{ fontSize: "56px" }} />
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
              By entering the 3,3 Together Pool, you understand that you will <strong>not</strong> receive your normal
              sOHM rebase reward and that it will instead go directly into funding the prize pool.
            </em>
          </Typography>
          <Typography variant="body2" className="info-text">
            <strong>Additionally, there is a 3% early exit fee for withdrawing in under 6 days.</strong>
          </Typography>
          <Button variant="contained" color="primary" className="confirm-btn" onClick={props.onSubmit}>
            Confirm
          </Button>
        </Box>
      </>
    </Modal>
  );
};
