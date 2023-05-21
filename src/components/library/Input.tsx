import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement } from "react";
import Token from "src/components/library/Token/Token";
import tokenPath from "src/components/library/Token/tokensLib";

const PREFIX = "Input";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  [`&.${classes.root}`]: {
    "& .MuiButtonBase-root": {
      "&:hover": {
        backgroundColor: "inherit",
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "0px",
      fontSize: "15px",
      lineHeight: "21px",
    },
    "& .MuiInputLabel-outlined": {
      zIndex: "initial",
      transform: "inherit",
      position: "relative",
      top: "unset",
      left: "unset",
      lineHeight: "21px",
      fontSize: "15px",
      marginTop: "3px",
      marginBottom: "3px",
      "&.Mui-focused": {
        color: theme.palette.text.secondary,
      },
      paddingRight: "0px",
    },
    "& .MuiInputLabel-animated": {
      transition: "unset",
    },
    "& input": {
      fontSize: "15px",
      "&[type=number]": {
        MozAppearance: "textfield",
      },
      "&::-webkit-outer-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
    },
  },
}));

export interface OHMInputProps extends OutlinedInputProps {
  id: string;
  label?: string;
  className?: string;
  labelClass?: string;
  helperText?: string;
  endString?: string;
  endStringOnClick?: () => void;
  startAdornment?: keyof typeof tokenPath;
  placeholder?: string;
  info?: ReactElement | string;
}

const Input: FC<OHMInputProps> = ({
  id,
  label,
  className = "",
  helperText,
  endString,
  endStringOnClick,
  startAdornment,
  placeholder,
  info,
  ...props
}) => {
  const theme = useTheme();
  const enableLabel = label || info ? true : false;
  return (
    <StyledFormControl variant="outlined" className={classes.root} color="primary" fullWidth>
      {enableLabel && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent={label ? `space-between` : `flex-end`}
          alignItems="center"
        >
          {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
          {info && <Box sx={{ color: theme.palette.text.secondary }}>{info}</Box>}
        </Box>
      )}
      <OutlinedInput
        id={id}
        startAdornment={
          startAdornment && (
            <InputAdornment position="start">
              <Token name={startAdornment} fontSize={"small"} />
            </InputAdornment>
          )
        }
        endAdornment={
          endString ? (
            <InputAdornment position="end">
              <Button variant="text" style={{ fontWeight: 500, fontSize: "15px" }} onClick={endStringOnClick}>
                {endString}
              </Button>
            </InputAdornment>
          ) : (
            props.endAdornment
          )
        }
        label={label}
        className={className}
        placeholder={placeholder}
        notched={false}
        {...props}
      />
      {helperText && <FormHelperText error={props.error}>{helperText}</FormHelperText>}
    </StyledFormControl>
  );
};

export default Input;
