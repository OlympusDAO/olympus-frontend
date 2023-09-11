import { Box, Link, LinkProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Accordion, Chip, Icon, OHMChipProps } from "@olympusdao/component-library";
import { IconName } from "@olympusdao/component-library/lib/components/Icon";
import { FC, ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

const PREFIX = "NavItem";

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
};

const Root = styled("div", { shouldForwardProp: prop => prop !== "match" })<MatchProps>(({ theme, match }) => ({
  [`&.${classes.root}`]: {
    alignItems: "center",
    marginBottom: "12px",
    "& .link-container": {
      paddingRight: "12px",
    },
    "& a.active": {
      "& .link-container": {
        backgroundColor: theme.colors.gray[600],
      },
      textDecoration: "none",
    },
    "& .MuiAccordion-root": {
      background: "transparent",
      "& .MuiAccordionDetails-root a.active .activePill": {
        marginLeft: "-35px",
        marginRight: "35px",
      },
      "& .MuiAccordionSummary-expandIconWrapper": {
        padding: "0px 18px",
      },
    },
    "& .MuiAccordion-root &:last-child": {
      paddingBottom: "0px",
    },
    "& .MuiAccordionSummary-root": {
      "&.Mui-expanded": {
        marginBottom: "6px",
      },
      "& a.active .link-container": {
        backgroundColor: theme.colors.gray[600],
        marginRight: "-48px",
      },
    },

    "& .MuiAccordionDetails-root": {
      "& .link-container .title": {
        fontSize: "13px",
        lineHeight: 1,
      },
      "& a.active .link-container": {
        backgroundColor: theme.colors.gray[600],
      },
      paddingLeft: "20px",
      display: "block",
      "& .nav-item-container": {
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingRight: "0px",
      },
    },

    "& svg": {
      marginRight: "12px",
    },
    "& svg.accordion-arrow": {
      marginRight: "0px",
    },
    "& .external-site-link": {
      "& .external-site-link-icon": {
        opacity: "0",
      },
      "&:hover .external-site-link-icon": {
        marginLeft: "5px",
        opacity: "1",
      },
    },
  },

  [`& .${classes.title}`]: {
    lineHeight: "33px",
    paddingLeft: "12px",
    paddingTop: "3px",
    paddingBottom: "3px",
    fontSize: "15px",
  },
}));

interface MatchProps {
  match: boolean;
}

export interface OHMNavItemProps extends LinkProps {
  label: string;
  customIcon?: ReactNode;
  icon?: IconName;
  chip?: string | ReactNode;
  className?: string;
  to?: any;
  /**Will Override to prop. Used for External Links */
  href?: string;
  children?: ReactNode;
  defaultExpanded?: boolean;
  chipColor?: OHMChipProps["template"];
}

/**
 * Primary NavItem Component for UI.
 */
const NavItem: FC<OHMNavItemProps> = ({
  chip,
  className = "",
  customIcon,
  icon,
  label,
  to,
  children,
  defaultExpanded = true,
  chipColor,
  ...props
}) => {
  const currentLocation = useLocation();
  const match = currentLocation.pathname === to || currentLocation.pathname === `/${to}`;

  const linkProps = props.href
    ? {
        href: props.href,
        target: "_blank",
        className: `external-site-link ${className}`,
      }
    : {
        component: NavLink,
        to: to,
        className: `button-dapp-menu ${className}`,
      };
  const LinkItem = () => (
    <Link {...linkProps} {...props} underline="hover">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        alignContent="center"
        justifyContent="space-around"
        className="link-container"
      >
        <Box display="flex" width={"100%"} alignItems="center" className={`${classes.title} title`}>
          {customIcon ? customIcon : icon && <Icon name={icon} style={{ fontSize: "21px" }} />}
          {label}
          {props.href && <Icon className="external-site-link-icon" name="arrow-up" />}
        </Box>
        {chip && <Chip size="small" label={chip} template={chipColor} />}
      </Box>
    </Link>
  );
  return (
    <Root className={`${classes.root} nav-item-container`} match={match}>
      {children ? (
        <Accordion defaultExpanded={defaultExpanded} arrowOnlyCollapse summary={<LinkItem />}>
          {children}
        </Accordion>
      ) : (
        <LinkItem />
      )}
    </Root>
  );
};

export default NavItem;
