import { Box, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement } from "react";
import Icon from "src/components/library/Icon";

const PREFIX = "GetOnButton";

const classes = {
  container: `${PREFIX}-container`,
  getOn: `${PREFIX}-getOn`,
  exchange: `${PREFIX}-exchange`,
};

const StyledLink = styled(Link)(({ theme }) => ({
  [`& .${classes.container}`]: {
    background: theme.colors.paper.card,
    borderRadius: "12px",
    height: "72px",
    padding: "13px 16px",
  },

  [`& .${classes.getOn}`]: {
    lineHeight: "20x",
    fontSize: "12px",
    fontWeight: 600,
  },

  [`& .${classes.exchange}`]: {
    fontSize: "14x",
    lineHeight: "20px",
    fontWeight: 600,
  },
}));

export interface OHMGetOnButtonProps {
  href: string;
  logo: ReactElement;
  exchangeName: string;
}

/**
 * Component for Displaying GetOnButton
 */
const GetOnButton: FC<OHMGetOnButtonProps> = ({ href, logo, exchangeName }) => {
  return (
    <StyledLink href={href} target="_blank" underline="hover">
      <Box
        display="flex"
        flexDirection="row"
        className={classes.container}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box mr="6px">{logo}</Box>
          <Box display="flex" flexDirection="column" alignContent="center">
            <Typography className={classes.getOn}>Get on</Typography>
            <Typography className={classes.exchange}>{exchangeName}</Typography>
          </Box>
        </Box>
        <Icon name="arrow-up-right" style={{ fontSize: "12px" }} />
      </Box>
    </StyledLink>
  );
};

export default GetOnButton;
