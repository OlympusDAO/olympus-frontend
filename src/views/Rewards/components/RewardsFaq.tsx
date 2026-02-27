import AddIcon from "@mui/icons-material/Add";
import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const faqItems = [
  {
    question: "How are Drachmas calculated?",
    answer:
      "Drachmas are calculated using a time-weighted system. The longer you hold a deposit position during an epoch, the more Drachmas you earn. Drachmas accrue daily based on your position size and the current season's base rate (Drachmas per dollar per day). Activities like Convertible Deposit (CD) positions, limit order deposits, and governance votes all earn Drachmas.",
    defaultExpanded: true,
  },
  {
    question: "What are seasons and epochs?",
    answer:
      "The rewards program is organized into seasons, each with its own base Drachma rate. Seasons are divided into shorter periods called epochs (typically one week). At the end of each epoch, your accumulated Drachmas determine your share of that epoch's convOHM rewards.",
  },
  {
    question: "When do I start earning Drachmas?",
    answer:
      "You start earning Drachmas as soon as your deposit is confirmed on-chain. Drachmas accrue daily based on your position size, so the sooner you deposit, the more you accumulate within the current epoch.",
  },
  {
    question: "What are convOHM tokens?",
    answer:
      "convOHM (Convertible OHM) are tokenized options that give you the right to purchase OHM at a predetermined strike price. At the end of each epoch, your Drachmas are converted into a proportional share of the convOHM pool. The more Drachmas you earn relative to other participants, the more convOHM you receive.",
  },
  {
    question: "How is the convOHM strike price determined?",
    answer:
      "The strike price is the price at which you can exercise your convOHM to purchase OHM. It is calculated using the higher of two floors: a buffered Liquid Backing price (LB + 20%) or a discounted market TWAP (TWAP - 15%). This ensures a fair conversion price that reflects current market conditions.",
  },
  {
    question: "How do I claim my convOHM rewards?",
    answer:
      "Once an epoch is finalized, a Merkle proof is generated for your rewards. After a 3-month vesting period, you have a 1-month exercise window to claim your convOHM on-chain by paying the strike price in USDS. Your Merkle proof — available through the dashboard — is used to verify your claim against the on-chain Merkle root.",
  },
  {
    question: "What happens if I withdraw my deposit mid-epoch?",
    answer:
      "You still earn Drachmas for the time your deposit was active. Since calculations are time-weighted, withdrawing early means you earn proportionally fewer Drachmas — and therefore less convOHM — for that epoch compared to holding for the full period.",
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
