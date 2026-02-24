import AddIcon from "@mui/icons-material/Add";
import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const faqItems = [
  {
    question: "Where do the rewards come from?",
    answer:
      "The Drachmas Program is a liquidity-driven rewards system designed to incentivize using Olympus CDs. Participants earn drachmas based on their activity across protocol features.",
    defaultExpanded: true,
  },
  {
    question: "Can I use multiple wallets?",
    answer: "some text",
  },
  {
    question: "How to max benefit?",
    answer: "some text",
  },
  {
    question: "When can they be redeemed / how to redeem?",
    answer: "some text",
  },
];

export const RewardsFaq = () => {
  const theme = useTheme();

  const accordionSx = {
    background: "transparent",
    boxShadow: "none",
    "&:before": {
      display: "none",
    },
    "&.Mui-expanded": {
      margin: 0,
    },
  };

  const summarySx = {
    padding: "16px",
    borderRadius: "12px",
    minHeight: "auto",
    "&.Mui-expanded": {
      minHeight: "auto",
    },
    "& .MuiAccordionSummary-content": {
      margin: 0,
      "&.Mui-expanded": {
        margin: 0,
      },
    },
    "&:focus-visible": {
      outline: `3px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)"}`,
      borderRadius: "12px",
    },
  };

  return (
    <Paper
      sx={{
        background: theme.colors.paper.card,
        padding: "12px",
        borderRadius: "12px",
        width: "100%",
      }}
    >
      {faqItems.map(item => (
        <Accordion key={item.question} defaultExpanded={item.defaultExpanded} sx={accordionSx}>
          <AccordionSummary
            expandIcon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddIcon
                  sx={{
                    fontSize: "16px",
                    color: theme.colors.gray[40],
                    transition: "all 0.2s",
                    ".Mui-expanded &": {
                      color: theme.colors.gray[10],
                      transform: "rotate(45deg)",
                    },
                  }}
                />
              </Box>
            }
            sx={summarySx}
          >
            <Typography fontSize="18px" fontWeight={500} sx={{ color: theme.colors.gray[10], textAlign: "left" }}>
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: "0 16px 16px 16px",
            }}
          >
            <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};
