import { switchClasses } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { darkPalette as colors } from "src/themes/darkPalette";
import fonts from "src/themes/fonts";
import commonSettings from "src/themes/global.js";

export const dark = createTheme(
  deepmerge(
    {
      colors,
      palette: {
        mode: "dark",
        contrastText: colors.gray[10],
        primary: {
          main: colors.gray[10],
        },
        neutral: {
          main: colors.gray[10],
          secondary: colors.gray[40],
        },
        text: {
          primary: colors.gray[10],
          secondary: colors.gray[40],
        },
        graphStrokeColor: "rgba(255, 255, 255, .1)",
        error: {
          main: colors.feedback.error,
          dark: colors.feedback.error,
        },
        info: {
          main: colors.feedback.userFeedback,
          dark: colors.feedback.userFeedback,
        },
        success: {
          main: colors.feedback.success,
          dark: colors.feedback.success,
        },
        warning: {
          main: colors.feedback.warning,
          dark: colors.feedback.warning,
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
            ${fonts}
            body {
              background-color:${colors.gray[600]};
            }
            `,
        },
        MuiSwitch: {
          styleOverrides: {
            switchBase: {
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
            colorPrimary: {
              color: colors.gray[10],
              [`&.${switchClasses["checked"]}`]: {
                color: colors.gray[600],
                [`& + .${switchClasses["track"]}`]: {
                  backgroundColor: colors.primary[300],
                  opacity: 1,
                },
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
            },
            track: {
              border: `1px solid ${colors.gray[10]}`,
              background: "none",
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              "& .MuiLink-root": {
                color: colors.gray[40],
                "&.active": {
                  color: colors.gray[10],
                },
              },
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            select: {
              color: "#FFF",
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              height: 9,
              borderRadius: 4,
            },
            colorPrimary: {
              backgroundColor: colors.gray[500],
            },
            barColorPrimary: {
              backgroundColor: colors.primary[300],
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              "&.MuiAccordion-root": {
                background: "transparent",
              },
              background: "transparent",
              "&.ohm-card": {
                background: "transparent",
              },
              "&.MuiPaper-root&.info-tooltip,  &.MuiPaper-root&.tooltip-container": {
                background: colors.gray[500],
              },
            },
          },
        },
        MuiModal: {
          styleOverrides: {
            root: {
              ".Paper-root": {
                background: colors.gray[600],
              },
            },
          },
        },
        MuiPopover: {
          styleOverrides: {
            root: {
              "& .MuiList-root": {
                background: colors.gray[700],
              },
              "& .MuiSelect-select.MuiSelect-select": {
                color: "#fff",
              },
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            root: {
              "& .MuiPaper-root": {
                background: colors.gray[600],
              },
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: colors.gray[700],
              zIndex: 7,
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              color: colors.gray[10],
              "&:hover": {
                color: colors.primary[300],
                textDecoration: "none",
                "&.active": {
                  color: colors.gray[10],
                },
              },
              "&.active": {
                color: colors.gray[10],
                textDecoration: "underline",
                "&:hover": {
                  color: colors.primary[300],
                  textDecoration: "none",
                },
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              color: colors.gray[10],
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: colors.gray[40],
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            textColorPrimary: {
              color: colors.gray[40],
            },

            root: {
              "&.Mui-selected": {
                color: colors.gray[10],
                textDecoration: "underline",
                textUnderlineOffset: "10px",
                textDecorationThickness: "3px",
                "&:hover": {
                  color: colors.gray[300],
                },
              },
              "&:hover": {
                color: colors.primary[300],
                textDecoration: "underline",
                textDecorationThickness: "3px",
                textUnderlineOffset: "10px",
              },
            },
          },
        },
        PrivateTabIndicator: {
          styleOverrides: {
            colorPrimary: {
              backgroundColor: colors.primary[300],
            },
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: {
              background: colors.gray[600],
              "&:hover": {
                color: colors.gray[10],
                background: `${colors.gray[500]} !important`,
              },
              selected: {
                background: colors.gray[500],
              },
              "@media (hover:none)": {
                "&:hover": {
                  color: colors.gray[10],
                  background: colors.gray[500],
                },
                "&:focus": {
                  color: colors.gray[10],
                  background: colors.gray[600],
                  borderColor: "transparent",
                  outline: "#00000000",
                },
              },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            containedPrimary: {
              color: colors.gray[600],
              backgroundColor: colors.primary[300],
              "&.Mui-disabled": {
                backgroundColor: colors.primary[300],
              },
              "&:hover": {
                backgroundColor: colors.primary[100],
                color: colors.gray[600],
              },
              "&:active": {
                backgroundColor: colors.primary[100],
                color: colors.gray[600],
              },
              "@media (hover:none)": {
                color: colors.gray[600],
                backgroundColor: colors.primary[300],
                "&:hover": {
                  backgroundColor: colors.primary[100],
                },
              },
            },
            containedSecondary: {
              height: "39px",
              background: colors.gray[600],
              color: colors.gray[10],
              fontWeight: 500,
              "&:hover": {
                background: `${colors.gray[500]} !important`,
              },
              "&:active": {
                background: colors.gray[500],
              },
              "&:focus": {
                background: colors.gray[600],
              },
              "@media (hover:none)": {
                color: colors.gray[10],
                background: colors.gray[600],
                "&:hover": {
                  background: `${colors.gray[500]} !important`,
                },
              },
            },
            outlinedPrimary: {
              color: colors.gray[10],
              borderColor: colors.gray[10],
              "&.Mui-disabled": {
                borderColor: colors.gray[10],
                color: colors.gray[10],
              },
              "&:hover": {
                color: colors.gray[600],
                backgroundColor: colors.primary[100],
                borderColor: colors.primary[100],
              },
            },
            outlinedSecondary: {
              color: colors.primary[300],
              borderColor: colors.primary[300],
              "&.Mui-disabled": {
                color: colors.primary[300],
                borderColor: colors.primary[300],
              },
              "&:hover": {
                color: colors.gray[600],
                backgroundColor: colors.primary[100],
                borderColor: colors.primary[100],
              },
              "@media (hover:none)": {
                color: colors.primary[300],
                borderColor: colors.primary[300],
                "&:hover": {
                  color: colors.gray[600],
                  backgroundColor: `${colors.primary[100]} !important`,
                  borderColor: colors.primary[100],
                  textDecoration: "none !important",
                },
              },
            },
            textPrimary: {
              color: "#A3A3A3",
              "&:hover": {
                color: colors.primary[300],
                backgroundColor: "#00000000",
              },
              "&:active": {
                color: colors.primary[300],
                borderBottom: "#F8CC82",
              },
            },
            textSecondary: {
              color: colors.gray[10],
              "&:hover": {
                color: colors.primary[300],
              },
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              "&.grid-message-typography": {
                color: "#A3A3A3",
              },
              "&.chain-highlight": {
                color: "#DADADA",
              },
              "&.current": {
                color: colors.primary[300],
              },
            },
          },
        },
      },
    },
    commonSettings,
  ),
);
