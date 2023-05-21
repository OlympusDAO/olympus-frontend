import { Grid, OutlinedInputProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import { PrimaryButton } from "src/components/library/Button";
import Input from "src/components/library/Input";
import tokenPath from "src/components/library/Token/tokensLib";

const PREFIX = "InputWrapper";

const classes = {
  inputRow: `${PREFIX}-inputRow`,
  gridItem: `${PREFIX}-gridItem`,
  input: `${PREFIX}-input`,
  button: `${PREFIX}-button`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`&.${classes.inputRow}`]: {
    justifyContent: "space-around",
    alignItems: "center",
    height: "auto",
    marginTop: "4px",
  },

  [`& .${classes.gridItem}`]: {
    width: "100%",
    paddingRight: "5px",
    alignItems: "center",
    justifyContent: "center",
  },

  [`& .${classes.input}`]: {
    [theme.breakpoints.down("md")]: {
      marginBottom: "10px",
    },
    [theme.breakpoints.up("sm")]: {
      marginBottom: "0",
    },
  },
}));

const StyledButton = styled(PrimaryButton)(({}) => ({
  [`&.${classes.button}`]: {
    alignSelf: "center",
    width: "100%",
    minWidth: "163px",
    maxWidth: "542px",
    height: "43px",
  },
}));

export interface OHMInputWrapperProps extends OutlinedInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  endString?: string;
  endStringOnClick?: () => void;
  startAdornment?: keyof typeof tokenPath;
  buttonText: string;
  buttonOnClick?: () => void;
  buttonType?: string;
  disabled?: boolean;
}

const InputWrapper: FC<OHMInputWrapperProps> = ({
  id,
  label,
  helperText,
  placeholder,
  endString,
  endStringOnClick,
  startAdornment,
  buttonText,
  buttonOnClick,
  disabled,
  buttonType,
  ...props
}) => {
  let optionalButtonProps = {};

  if (buttonOnClick) {
    optionalButtonProps = { ...optionalButtonProps, buttonOnClick };
  }
  if (buttonType) {
    optionalButtonProps = { ...optionalButtonProps, type: buttonType };
  }
  return (
    <StyledGrid container className={classes.inputRow}>
      <Grid item xs={12} sm={8} className={classes.gridItem}>
        <Input
          label={label}
          id={id}
          helperText={helperText}
          className={classes.input}
          endString={endString}
          endStringOnClick={endStringOnClick}
          placeholder={placeholder}
          startAdornment={startAdornment}
          {...props}
        />
      </Grid>
      <Grid item xs={12} sm={4} className={classes.gridItem}>
        <StyledButton
          className={classes.button}
          disabled={disabled}
          sx={{ marginTop: helperText ? "5px" : "0px" }}
          {...optionalButtonProps}
        >
          {buttonText}
        </StyledButton>
      </Grid>
    </StyledGrid>
  );
};

export default InputWrapper;
