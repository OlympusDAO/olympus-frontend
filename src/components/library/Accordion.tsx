import { Accordion as MuiAccordion, AccordionDetails, AccordionProps, AccordionSummary } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement, useEffect, useState } from "react";
import Icon from "src/components/library/Icon";

const PREFIX = "Accordion";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledMuiAccordion = styled(MuiAccordion)(() => ({
  [`&.${classes.root}`]: {
    "& .MuiAccordionSummary-content": {
      display: "initial",
      margin: "initial",
    },
    "&.MuiAccordion-root": {
      backdropFilter: "none",
      backgroundColor: "transparent",
    },
    "& .MuiAccordionDetails-root": {
      padding: "0px 0px 0px 16px",
    },
    "& .MuiAccordionSummary-expandIconWrapper": {
      padding: "0px 11px",
    },
    "& .MuiAccordionSummary-root": {
      minHeight: "initial",
      padding: "initial",
    },
  },
}));

export interface OHMAccordionProps extends AccordionProps {
  summary: ReactElement;
  children: any;
  /** Disables clicking on entire row to expand/collapse and only expands/collapses when arrow is clicked */
  arrowOnlyCollapse?: boolean;
}

/**
 * Accordion Component for UI.
 */
const Accordion: FC<OHMAccordionProps> = ({
  summary,
  children,
  arrowOnlyCollapse = false,
  defaultExpanded = true,
  ...props
}) => {
  const [expand, setExpand] = useState(false);
  const toggleAcordion = () => {
    setExpand(prev => !prev);
  };
  useEffect(() => {
    if (arrowOnlyCollapse && defaultExpanded) {
      setExpand(true);
    }
  }, [defaultExpanded]);
  return (
    <StyledMuiAccordion
      square
      elevation={0}
      expanded={arrowOnlyCollapse ? expand : undefined}
      defaultExpanded={defaultExpanded}
      {...props}
      className={`${classes.root} ${props.className}`}
    >
      <AccordionSummary
        expandIcon={
          <Icon className="accordion-arrow" name="arrow-down" style={{ fontSize: 12 }} onClick={toggleAcordion} />
        }
      >
        {summary}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </StyledMuiAccordion>
  );
};

export default Accordion;
