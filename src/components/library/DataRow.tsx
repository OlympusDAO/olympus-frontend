import { Box, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement } from "react";
import Accordion from "src/components/library/Accordion";
import InfoTooltip from "src/components/library/InfoTooltip";

const PREFIX = "DataRow";

const classes = {
  root: `${PREFIX}-root`,
  accordion: `${PREFIX}-accordion`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledDiv = styled("div")(() => ({
  [`&.${classes.root}`]: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    margin: "12px 0px",
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  [`&.${classes.accordion}`]: {
    "&:before": {
      height: "0px",
    },
    "& .MuiAccordionSummary-root": {
      flexDirection: "row-reverse",
      "& .data-row": {
        margin: "0px",
      },
      "& .Mui-expanded": {
        marginTop: "0px",
      },
    },
    "& .MuiAccordionSummary-expandIconWrapper": {
      paddingLeft: "0px",
      paddingRight: "0px",
      marginRight: "10px",
    },
    "& .MuiAccordionDetails-root": {
      display: "block",
      paddingLeft: "33px",
      "& .MuiTypography-root": {
        color: theme.palette.text.secondary,
        fontSize: "14px",
      },
    },
  },
}));

export interface OHMDataRowProps {
  title: string | ReactElement | JSX.Element;
  indented?: boolean;
  id?: string;
  balance?: string | ReactElement | JSX.Element;
  isLoading?: boolean;
  children?: any;
  tooltip?: string;
}

const DataRow: FC<OHMDataRowProps> = props => {
  const Row = () => (
    <StyledDiv className={`${classes.root} data-row`} style={props.indented ? { paddingLeft: "10px" } : {}}>
      <Box
        display="flex"
        flexDirection="row"
        fontSize={props.indented ? "14px" : "15px"}
        color={props.indented ? "textSecondary" : "primary"}
      >
        {typeof props.title === "string" ? (
          <Typography fontSize={props.indented ? "14px" : "15px"} color={props.indented ? "textSecondary" : "primary"}>
            {props.title}
          </Typography>
        ) : (
          props.title
        )}
        {props.tooltip && <InfoTooltip message={props.tooltip} />}
      </Box>
      {typeof props.balance === "string" ? (
        <Typography
          fontSize={props.indented ? "14px" : "15px"}
          id={props.id}
          color={props.indented ? "textSecondary" : "primary"}
          style={{ textAlign: "right" }}
        >
          {props.isLoading ? <Skeleton width="80px" /> : props.balance}
        </Typography>
      ) : props.isLoading ? (
        <Skeleton width="80px" />
      ) : (
        props.balance
      )}
    </StyledDiv>
  );

  return (
    <>
      {props.children ? (
        <StyledAccordion className={classes.accordion} summary={<Row />}>
          {props.children}
        </StyledAccordion>
      ) : (
        <Row />
      )}
    </>
  );
};

export default DataRow;
