import { Box, Grid, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { animated, useSpring } from "@react-spring/web";
import { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import { TextButton } from "src/components/library/Button";
import Chip, { OHMChipProps } from "src/components/library/Chip";
import Icon from "src/components/library/Icon";
import PaperCard from "src/components/library/PaperCard";
import Token, { OHMTokenProps } from "src/components/library/Token/Token";
import TokenStack, { OHMTokenStackProps } from "src/components/library/TokenStack";

const PREFIX = "ItemCard";

const classes = {
  wrapper: `${PREFIX}-wrapper`,
  container: `${PREFIX}-container`,
  tokens: `${PREFIX}-tokens`,
  tokenName: `${PREFIX}-tokenName`,
  value: `${PREFIX}-value`,
  details: `${PREFIX}-details`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${classes.wrapper}`]: {
    marginBottom: "9px",
    "& .MuiLink-root:hover": {
      color: "inherit",
    },
  },

  [`& .${classes.container}`]: {
    minHeight: "59px",
  },

  [`& .${classes.tokens}`]: {
    fontSize: "27px",
  },

  [`& .${classes.tokenName}`]: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "20px",
    marginLeft: "8px",
    whiteSpace: "nowrap",
  },

  [`& .${classes.value}`]: {
    lineHeight: "20px",
  },

  [`& .${classes.details}`]: {
    marginTop: "-59px",
    backgroundColor: theme.colors.paper.cardHover,
    borderRadius: "9px",
    padding: "1px 10px 1px 13px",
    "& .MuiButton-text": {
      fontSize: "1rem",
      paddingLeft: "0px",
      marginLeft: "0px",
    },
  },
}));

export interface OHMItemCardProps {
  title?: string;
  value?: string | number;
  roi?: string | number;
  tokens?: OHMTokenStackProps["tokens"];
  days?: string;
  href?: string;
  /*External Link*/
  external?: boolean;
  hrefText?: string;
  disableFlip?: boolean;
  networkName?: OHMTokenProps["name"];
}

/**
 * Component for Displaying ItemCard
 */
const ItemCard: FC<OHMItemCardProps> = ({
  title,
  value,
  roi = 0,
  days,
  tokens = [],
  href = "",
  hrefText,
  disableFlip = false,
  external,
  networkName,
}) => {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const posOrNegative = (number: number | string) => {
    const toNumber = typeof number === "string" ? parseFloat(number) : number;
    if (toNumber < 0) {
      return "error";
    }
    return "success";
  };

  const chipTemplate: OHMChipProps["template"] = posOrNegative(roi);

  const linkProps = () => {
    let linkProps = {};
    if (external) {
      linkProps = {
        href: href,
        target: "_blank",
      };
    } else {
      linkProps = {
        to: href,
        component: NavLink,
      };
    }
    return linkProps;
  };

  const LinkWrapper = (props: { href?: string; children: any }) => {
    const flipProps = disableFlip ? linkProps() : { onClick: () => setFlipped(!flipped) };
    return props.href ? (
      <Link {...flipProps} underline="hover">
        {props.children}
      </Link>
    ) : (
      props.children
    );
  };
  return (
    <StyledBox className={classes.wrapper}>
      <animated.div style={{ opacity: opacity.to(o => 1 - o), transform }}>
        <LinkWrapper href={href}>
          <PaperCard display="flex" className={classes.container} alignItems="center">
            <Grid container alignItems="center">
              <Grid item xs={!roi && !value && !days ? 12 : 5}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TokenStack tokens={tokens} className={classes.tokens} />
                  <Typography className={classes.tokenName}>
                    {title
                      ? title
                      : tokens.map((token: string, index) => token + (index === tokens.length - 1 ? "" : "-"))}
                  </Typography>
                  {networkName && <Token name={networkName} style={{ fontSize: "15px", marginLeft: "9px" }} />}
                </Box>
              </Grid>
              <Grid container item xs={7} alignItems="center" justifyContent="flex-end">
                <Grid item xs={4}>
                  <Box display="flex" flexDirection="row" justifyContent="flex-end">
                    <Typography className={classes.value}>{value}</Typography>
                  </Box>
                </Grid>
                {roi ? (
                  <Grid item xs={5}>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end">
                      <Chip label={roi} template={chipTemplate} />
                    </Box>
                  </Grid>
                ) : (
                  <></>
                )}
                {days ? (
                  <Grid item xs={3}>
                    <Box display="flex" justifyContent="flex-end">
                      <Typography color="textSecondary">{days}</Typography>
                    </Box>
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </PaperCard>
        </LinkWrapper>
      </animated.div>
      <animated.div style={{ opacity, transform: transform.to(t => `${t} rotateX(180deg)`) }}>
        {flipped && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            className={`${classes.container} ${classes.details}`}
          >
            <Box display="flex" alignItems="center" flexGrow={1} justifyContent="space-around">
              <Link {...linkProps()} underline="hover">
                <TextButton>{hrefText}</TextButton>
              </Link>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon name="x" style={{ cursor: "pointer" }} onClick={() => setFlipped(f => !f)} />
            </Box>
          </Box>
        )}
      </animated.div>
    </StyledBox>
  );
};

export default ItemCard;
