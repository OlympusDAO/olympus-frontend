import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement } from "react";

const PREFIX = "DottedDataRow";

const classes = {
  container: `${PREFIX}-container`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${classes.container}`]: {
    borderBottom: `1px dashed ${
      theme.palette.mode === "light" ? theme.colors.paper.cardHover : theme.colors.gray[500]
    }`,
    paddingBottom: "7px",
    paddingTop: "9px",
    "& .title": {
      lineHeight: "18px",
    },
    "& .value": {
      lineHeight: "18px",
    },
  },
}));

export interface OHMDottedDataRowProps {
  title: string | ReactElement | JSX.Element;
  value?: string | number | ReactElement | JSX.Element;
  bold?: boolean;
}

/**
 * Component for Displaying DottedDataRow
 */
const DottedDataRow: FC<OHMDottedDataRowProps> = ({ bold = false, title, value }) => {
  return (
    <StyledBox display="flex" flexDirection="row" justifyContent="space-between" className={classes.container}>
      <Typography
        sx={{ fontWeight: bold ? 600 : 400 }}
        color={bold ? "textPrimary" : "textSecondary"}
        variant="body2"
        className="title"
      >
        {title}
      </Typography>
      <Box textAlign="right" className="value">
        {typeof value === "string" || typeof value === "number" ? (
          <Typography
            sx={{ fontWeight: bold ? 600 : 400 }}
            color={bold ? "textPrimary" : "textSecondary"}
            variant="body2"
            className="value"
          >
            {value}
          </Typography>
        ) : (
          <>{value}</>
        )}
      </Box>
    </StyledBox>
  );
};

export default DottedDataRow;
