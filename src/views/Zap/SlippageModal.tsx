import { Trans } from "@lingui/macro";
import { Box, Dialog, DialogTitle, FormControl, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Input, PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { SetStateAction, useEffect, useState } from "react";
import { trim } from "src/helpers";

const PREFIX = "SlippageModal";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.root}`]: {
    [theme.breakpoints.down("md")]: {
      paddingInline: "16px",
    },
    [theme.breakpoints.up("sm")]: {
      paddingInline: "64px",
    },
  },
}));

function SlippageModal(
  handleClose: () => void,
  modalOpen: boolean,
  currentSlippage: string,
  setCustomSlippage: { (value: SetStateAction<string>): void; (arg0: string): void },
  zapperCredit: JSX.Element,
) {
  const [proposedSlippage, setProposedSlippage] = useState(currentSlippage);
  const [errorState, setErrorState] = useState<string | null>(null);
  const handleChangeProposedSlippage = (slippage: string) => {
    try {
      const slippageNumber = Number(slippage);
      setProposedSlippage(slippage);
      if (100 > slippageNumber && slippageNumber > 0) {
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
    <StyledDialog
      onClose={handleClose}
      open={modalOpen}
      fullWidth
      maxWidth="xs"
      id="zap-select-token-modal"
      className="zap-card"
    >
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box />
          <Box paddingLeft={6}>
            <Typography id="migration-modal-title" variant="h6" component="h2">
              <Trans>Adjust Slippage</Trans>
            </Typography>
          </Box>
          <PrimaryButton icon="x" template="text" onClick={handleClose} />
        </Box>
      </DialogTitle>
      <Box paddingBottom="36px" className={classes.root}>
        <Typography color="textSecondary">
          <Trans>Important: Recommended slippage is 1-3% to avoid a failed transaction.</Trans>
        </Typography>
      </Box>
      <Box paddingBottom="16px" className={classes.root}>
        {/* <Paper style={{ maxHeight: 300, overflow: "auto", borderRadius: 10 }}> */}
        <FormControl className="slippage-input" variant="outlined" color="primary" size="small">
          <Input
            id="slippage"
            type="number"
            placeholder="Slippage Tolerance"
            value={proposedSlippage}
            onChange={e => handleChangeProposedSlippage(e.target.value)}
            endString="%"
          />
        </FormControl>

        <Box display="flex" flexDirection="row" justifyContent="space-between">
          {presetSlippageOptions.map(slippage => (
            <SecondaryButton size="small" onClick={() => handleChangeProposedSlippage(slippage)}>
              <Typography>{`${slippage}%`}</Typography>
            </SecondaryButton>
          ))}
        </Box>
        <Box paddingY="16px">{errorState ? <Typography color="error">{errorState}</Typography> : null}</Box>
        <Box display="flex" justifyContent={"center"}>
          <PrimaryButton
            size="small"
            color="primary"
            disabled={errorState != null}
            onClick={() => {
              if (errorState != null) {
                return;
              }
              setCustomSlippage(trim(+proposedSlippage, 1));
              handleClose();
            }}
          >
            <Typography>Adjust Slippage</Typography>
          </PrimaryButton>
        </Box>
        {zapperCredit}
      </Box>
    </StyledDialog>
  );
}

export default SlippageModal;
