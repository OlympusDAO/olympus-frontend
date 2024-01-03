import { Box, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement } from "react";
import Icon from "src/components/library/Icon";

const PREFIX = "ArticleCard";

const classes = {
  container: `${PREFIX}-container`,
  image: `${PREFIX}-image`,
  title: `${PREFIX}-title`,
  date: `${PREFIX}-date`,
  icon: `${PREFIX}-icon`,
  content: `${PREFIX}-content`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${classes.container}`]: {
    background: theme.colors.paper.card,
    borderRadius: "9px",
    marginBottom: "18px",
    "&:hover": {
      background: theme.colors.paper.cardHover,
    },
    "& a:hover": {
      color: "unset",
    },
  },

  [`& .${classes.image}`]: {
    width: "100%",
    borderRadius: "9px 9px 0 0",
  },

  [`& .${classes.title}`]: {
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "20px",
    marginBottom: "6px",
  },

  [`& .${classes.date}`]: {
    color: theme.colors.gray[90],
    lineHeight: "18px",
    marginBottom: "6px",
  },

  [`& .${classes.icon}`]: {
    fontSize: "10px",
    marginRight: "10px",
  },

  [`& .${classes.content}`]: {
    fontSize: "12px",
    lineHeight: "18px",
    color: theme.colors.gray[40],
    whiteSpace: "pre-line",
  },
}));

export interface OHMArticleCardProps {
  imageSrc: string;
  title: string;
  publishDate?: string;
  content: string | ReactElement | JSX.Element;
  href?: string;
}

/**
 * Component for Displaying ArticleCard
 */
const ArticleCard: FC<OHMArticleCardProps> = ({ imageSrc, title, publishDate, content, href }) => {
  const cursor = href ? "pointer" : "default";
  return (
    <StyledBox display="flex" className={classes.container} flexDirection="column">
      <Link href={href} target="_blank" underline="hover" sx={{ cursor: cursor }}>
        {imageSrc && (
          <Box>
            <img alt="" className={classes.image} width="100%" src={imageSrc} />
          </Box>
        )}
        <Box p="18px">
          <Box className={classes.title}>{title}</Box>
          {publishDate && (
            <Box display="flex" className={classes.date} alignItems="center">
              <Icon name="calendar" className={classes.icon} />
              {publishDate}
            </Box>
          )}
          <Box className={classes.content}>{content}</Box>
        </Box>
      </Link>
    </StyledBox>
  );
};

export default ArticleCard;
