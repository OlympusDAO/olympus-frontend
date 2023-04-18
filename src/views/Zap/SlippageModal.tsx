import { Box, Dialog, DialogTitle, FormControl, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, Input, PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { FC, SetStateAction, useEffect, useState } from "react";
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

export interface SlippageModal {
  handleClose: () => void;
  modalOpen: boolean;
  currentSlippage: string;
  setCustomSlippage: { (value: SetStateAction<string>): void; (arg0: string): void };
}

const SlippageModal: FC<SlippageModal> = ({ handleClose, modalOpen, currentSlippage, setCustomSlippage }) => {
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
      PaperProps={{ sx: { borderRadius: "9px" } }}
    >
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box />
          <Box>
            <Typography id="migration-modal-title" variant="h6" component="h2">
              Adjust Slippage
            </Typography>
          </Box>
          <Link onClick={handleClose} alignItems="center">
            <Icon name="x" />
          </Link>
        </Box>
      </DialogTitle>
      <Box paddingBottom="15px" className={classes.root}>
        <Typography color="textSecondary">
          Important: Recommended slippage is 1-3% to avoid a failed transaction.
        </Typography>
      </Box>
      <Box paddingBottom="15px" className={classes.root}>
        <FormControl fullWidth sx={{ paddingBottom: "10px" }}>
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
          {presetSlippageOptions.map((slippage, index) => (
            <SecondaryButton onClick={() => handleChangeProposedSlippage(slippage)} key={index}>
              <Typography>{`${slippage}%`}</Typography>
            </SecondaryButton>
          ))}
        </Box>
        <Box paddingY="16px">{errorState ? <Typography color="error">{errorState}</Typography> : null}</Box>
        <Box display="flex" justifyContent={"center"}>
          <PrimaryButton
            disabled={errorState != null}
            onClick={() => {
              if (errorState != null) {
                return;
              }
              setCustomSlippage(trim(+proposedSlippage, 1));
              handleClose();
            }}
          >
            Adjust Slippage
          </PrimaryButton>
        </Box>
      </Box>
    </StyledDialog>
  );
};

export default SlippageModal;
