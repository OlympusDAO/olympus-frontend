import { Box, BoxProps, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import { Link as RouterLink, NavLink, NavLinkProps } from "react-router-dom";
import Button from "src/components/library/Button/Button";

const PREFIX = "TabBar";

const classes = {
  container: `${PREFIX}-container`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${classes.container}`]: {
    borderRadius: "6px",
    background: theme.colors.paper.card,
    "& a:first-of-type": {
      "& .MuiButton-text": {
        [theme.breakpoints.down(430)]: {
          paddingLeft: "16px",
        },
      },
    },
    "& a:last-child": {
      "& .MuiButton-text": {
        [theme.breakpoints.down(430)]: {
          paddingRight: "16px",
        },
      },
    },
    "& .MuiButton-text": {
      color: theme.colors.gray[40],
      [theme.breakpoints.down(430)]: {
        padding: "6px 6px",
      },
    },
    "& .active": {
      textDecoration: "none",
      "& .MuiButton-text": {
        backgroundColor: theme.colors.primary[300],
        color: theme.palette.mode === "light" ? theme.colors.gray[700] : theme.colors.gray[600],
        [theme.breakpoints.down(430)]: {
          padding: "6px 16px",
        },
        "&:hover": {
          backgroundColor: "#EDD8B4",
        },
      },
    },
  },
}));

export interface OHMTabBarProps extends BoxProps {
  to?: NavLinkProps["to"];
  items: { label: string; to?: NavLinkProps["to"]; href?: string; end?: boolean; isActive?: boolean }[];
  className?: string;
  href?: string;
  /**
   * Set this to true to use RouterLinks instead of NavLinks and manage active state independently of react router
   */
  disableRouting?: boolean;
}

/**
 * Component for Displaying TabBar
 */
const TabBar: FC<OHMTabBarProps> = ({ to, className = "", href, items, disableRouting, ...props }) => {
  const linkProps = (item: {
    label: string;
    to?: NavLinkProps["to"];
    href?: string;
    end?: boolean;
    isActive?: boolean;
  }) =>
    item.href
      ? {
          href: item.href,
          target: "_blank",
          className: className,
        }
      : {
          component: disableRouting ? RouterLink : NavLink,
          to: item.to,
          className: item.isActive ? "active" : className,
          end: item.end,
        };
  return (
    <StyledBox display="flex" className={classes.container} p={"1.5px"} {...props} justifyContent="space-between">
      {items.map((item, index) => (
        <Link {...linkProps(item)} key={index} underline="hover">
          <Button template="text">{item.label}</Button>
        </Link>
      ))}
    </StyledBox>
  );
};

export default TabBar;
