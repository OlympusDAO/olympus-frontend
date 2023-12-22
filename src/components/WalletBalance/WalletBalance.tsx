import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, useState } from "react";
import { Icon } from "src/components/library";

const PREFIX = "WalletBalance";

const classes = {
  title: `${PREFIX}-title`,
  number: `${PREFIX}-number`,
  numberSmall: `${PREFIX}-numberSmall`,
  icon: `${PREFIX}-icon`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.title}`]: {
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: 400,
  },

  [`& .${classes.number}`]: {
    fontSize: "24px",
    lineHeight: "33px",
    fontWeight: 700,
  },

  [`& .${classes.numberSmall}`]: {
    color: theme.colors.gray[40],
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: 500,
  },

  [`& .${classes.icon}`]: {
    color: theme.colors.gray[90],
    fontSize: "16px",
    cursor: "pointer",
    marginLeft: "4px",
  },
}));

export interface OHMWalletBalanceProps {
  title: string;
  usdBalance: string | number;
  underlyingBalance: string | number;
  className?: string;
}

/**
 * Component for Displaying WalletBalance
 */
const WalletBalance: FC<OHMWalletBalanceProps> = ({ title, usdBalance, underlyingBalance, className = "" }) => {
  const [swapped, setSwapped] = useState(true);

  return (
    <StyledBox
      display="flex"
      flexDirection="column"
      mt="10px"
      pb="10px"
      ml="10px"
      className={`${className} walletBalance`}
    >
      <Typography className={`${classes.title} title`}>{title}</Typography>
      <Typography className={`${classes.number} number`}>{swapped ? underlyingBalance : usdBalance}</Typography>
      <Box display="flex" flexDirection="row" className="numberSmall" justifyContent="center">
        <Typography className={`${classes.numberSmall}`}>{swapped ? usdBalance : underlyingBalance}</Typography>
        <Icon
          name="repeat"
          className={classes.icon}
          onClick={() => {
            setSwapped(!swapped);
          }}
        />
      </Box>
    </StyledBox>
  );
};

export default WalletBalance;
