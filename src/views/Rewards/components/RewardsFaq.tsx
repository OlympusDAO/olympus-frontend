import AddIcon from "@mui/icons-material/Add";
import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const RewardsFaq = () => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        background: theme.colors.paper.card,
        padding: "12px",
        borderRadius: "24px",
        width: "100%",
      }}
    >
      <Accordion
        defaultExpanded
        sx={{
          background: "transparent",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        }}
      >
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
          sx={{
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
              outline: `3px solid ${
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)"
              }`,
              borderRadius: "12px",
            },
          }}
        >
          <Typography fontSize="18px" fontWeight={500} sx={{ color: theme.colors.gray[10], textAlign: "left" }}>
            Where do the rewards come from?
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "0 16px 16px 16px",
          }}
        >
          <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
            The Drachmas Program is a liquidity-driven rewards system designed to incentivize using Olympus CDs.
            Participants earn drachmas based on their activity across protocol features.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          background: "transparent",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        }}
      >
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
          sx={{
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
              outline: `3px solid ${
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)"
              }`,
              borderRadius: "12px",
            },
          }}
        >
          <Typography fontSize="18px" fontWeight={500} sx={{ color: theme.colors.gray[10], textAlign: "left" }}>
            Can I use multiple wallets?
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "0 16px 16px 16px",
          }}
        >
          <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
            some text
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          background: "transparent",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        }}
      >
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
          sx={{
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
              outline: `3px solid ${
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)"
              }`,
              borderRadius: "12px",
            },
          }}
        >
          <Typography fontSize="18px" fontWeight={500} sx={{ color: theme.colors.gray[10], textAlign: "left" }}>
            How to max benefit?
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "0 16px 16px 16px",
          }}
        >
          <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
            some text
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          background: "transparent",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        }}
      >
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
          sx={{
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
              outline: `3px solid ${
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 23, 34, 0.1)"
              }`,
              borderRadius: "12px",
            },
          }}
        >
          <Typography fontSize="18px" fontWeight={500} sx={{ color: theme.colors.gray[10], textAlign: "left" }}>
            When can they be redeemed / how to redeem?
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "0 16px 16px 16px",
          }}
        >
          <Typography fontSize="15px" fontWeight={400} sx={{ color: theme.colors.gray[40] }}>
            some text
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};
