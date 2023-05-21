import { Box, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import Icon from "src/components/library/Icon";
import PaperCard from "src/components/library/PaperCard";
import Token, { OHMTokenProps } from "src/components/library/Token/Token";
import TokenStack, { OHMTokenStackProps } from "src/components/library/TokenStack";

const PREFIX = "MiniCard";

const classes = {
  miniCardContainer: `${PREFIX}-miniCardContainer`,
  title: `${PREFIX}-title`,
  label: `${PREFIX}-label`,
  icon: `${PREFIX}-icon`,
};

const StyledPaperCard = styled(PaperCard)(({ theme }) => ({
  [`&.${classes.miniCardContainer}`]: {
    padding: "18px",
    marginTop: "8px",
    marginBottom: "8px",
    background: theme.colors.gray[700],
  },

  [`& .${classes.title}`]: {
    fontWeight: 500,
    lineHeight: "21px",
    fontSize: "15px",
    color: theme.colors.gray[10],
  },

  [`& .${classes.label}`]: {
    color: theme.colors.gray[40],
    lineHeight: "18px",
    fontWeight: 500,
  },

  [`& .${classes.icon}`]: {
    fill: theme.colors.primary[300],
  },
}));

export interface OHMMiniCardProps {
  title?: string;
  href?: string;
  label?: string;
  icon?: OHMTokenProps["name"] | OHMTokenStackProps["tokens"];
}

/**
 * Component for Displaying MiniCard
 */
const MiniCard: FC<OHMMiniCardProps> = ({ title, href, label, icon }) => {
  const LinkWrapper = (props: { href?: string; children: any }) => {
    return props.href ? (
      <Link href={props.href} target="_blank" underline="hover">
        {props.children}
      </Link>
    ) : (
      props.children
    );
  };

  return (
    <LinkWrapper href={href}>
      <StyledPaperCard className={classes.miniCardContainer}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box display="flex" flexDirection="row" alignItems="center">
            {icon && Array.isArray(icon) ? (
              <Box sx={{ marginRight: "18px" }}>
                <TokenStack tokens={icon} />
              </Box>
            ) : icon ? (
              <Token name={icon} style={{ fontSize: "39px", marginRight: "18px" }} />
            ) : (
              <></>
            )}
            <Box display="flex" flexDirection="column">
              {label && (
                <Typography className={classes.label} variant="body2">
                  {label}
                </Typography>
              )}
              {title && (
                <Typography className={classes.title} variant="h6">
                  {title}
                </Typography>
              )}
            </Box>
          </Box>

          {href && (
            <Box display="flex">
              <Icon className={classes.icon} name="arrow-up" style={{ fontSize: "30px", margin: "4.5px" }} />
            </Box>
          )}
        </Box>
      </StyledPaperCard>
    </LinkWrapper>
  );
};

export default MiniCard;
