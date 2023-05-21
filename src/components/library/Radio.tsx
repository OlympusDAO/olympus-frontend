import { FormControlLabel, Radio as MuiRadio, RadioProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import Icon from "src/components/library/Icon";

const PREFIX = "Radio";

const classes = {
  radio: `${PREFIX}-radio`,
  label: `${PREFIX}-label`,
};

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  [`& .${classes.radio}`]: {
    padding: "0 8px 0 9px",
    color: theme.colors.gray[90],
    "&.Mui-checked": {
      color: theme.palette.mode === "light" ? theme.colors.gray[700] : theme.colors.primary[300],
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },

  [`& .${classes.label}`]: {
    "& .Mui-checked + .MuiFormControlLabel-label": {
      color: theme.palette.mode === "light" ? theme.palette.primary.main : theme.colors.gray[10],
    },
    "& .MuiFormControlLabel-label": {
      lineHeight: "20px",
      color: theme.palette.mode === "light" ? theme.colors.gray[90] : theme.colors.gray[40],
    },
  },
}));

export interface OHMRadioProps extends RadioProps {
  label?: string;
  value?: string | number;
}

/**
 * Component for Displaying Radio
 */
const Radio: FC<OHMRadioProps> = ({ label, value }) => {
  return (
    <StyledFormControlLabel
      value={value}
      control={
        <MuiRadio
          icon={<Icon name="radio-empty" />}
          checkedIcon={<Icon name="radio-filled" />}
          disableRipple={true}
          className={classes.radio}
          color="primary"
        />
      }
      label={label}
      className={classes.label}
    />
  );
};

export default Radio;
