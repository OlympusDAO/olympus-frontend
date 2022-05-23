import { switchClasses, tabClasses } from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

import fonts from "./fonts";
import commonSettings, { handleBackdropFilter } from "./global.js";

const lightTheme = {
  color: "#181A1D",
  gold: "#F8CC82",
  gray: "#A3A3A3",
  blueish_gray: "#676B74",
  textHighlightColor: "#93AEBC", // "#F4D092",
  backgroundColor: "#AFCDE9",
  // background:
  // "radial-gradient(circle at 25% 0%, rgba(227,255,240,.5), rgba(227,255,240,0) 50%), radial-gradient(circle at 80% 80%, rgba(131,165,203,.5), rgba(131,165,203,0) 50%)",
  background: "linear-gradient(180.37deg, #B3BFC5 0.49%, #D1D5D4 26.3%, #EEEAE3 99.85%)",
  paperBg: "linear-gradient(65.7deg, #F5F5F5 8.35%, #FFFFFF 100%)",
  modalBg: "#FAFAFAEF",
  popoverBg: "rgba(255, 255, 255, 0.95)",
  menuBg: handleBackdropFilter("rgba(255, 255, 255, 0.5)"),
  backdropBg: "rgba(200, 200, 200, 0.4)",
  largeTextColor: "#759AAE",
  activeLinkColor: "#222222",
  activeLinkSvgColor: "invert(64%) sepia(11%) saturate(934%) hue-rotate(157deg) brightness(90%) contrast(86%)",
  // primaryButtonBG: "#759AAE",
  primaryButtonBG: "#93AEBC",
  primaryButtonHoverBG: "#759AAE",
  // these need fixing
  primaryButtonHoverColor: "#333333",
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#F8CC82",
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "#FCFCFC",
  outlinedSecondaryButtonHoverColor: "#333333",
  containedSecondaryButtonHoverBG: "#333333",
  graphStrokeColor: "rgba(37, 52, 73, .2)",
  gridButtonHoverBackground: "rgba(118, 130, 153, 0.2)",
  gridButtonActiveBackground: "rgba(118, 130, 153, 0.7)",
  switchBg: "#FCFCFC",
};

const colors = {
  paper: {
    background: lightTheme.paperBg,
    card: "#F0F0F0",
    cardHover: "#E0E2E3",
  },
  feedback: {
    success: "#94B9A1",
    userFeedback: "#49A1F2",
    error: "#FF8585",
    warning: "#FC8E5F",
    pnlGain: "#3D9C70",
  },
  gray: {
    700: "#181A1D",
    600: "#292C32",
    500: "#3F4552",
    90: lightTheme.blueish_gray,
    40: lightTheme.blueish_gray,
    10: "#FAFAFB",
  },
  primary: {
    300: "#F8CC82",
    100: "#EAD8B8",
    "300/A75": " rgba(248, 204, 130,0.75)",
    "300/A50": " rgba(248, 204, 130,0.5)",
  },
};

export const light = responsiveFontSizes(
  createTheme(
    deepmerge(
      {
        colors,
        palette: {
          mode: "light",
          contrastText: lightTheme.color,
          primary: {
            main: lightTheme.color,
          },
          neutral: {
            main: lightTheme.color,
            secondary: lightTheme.gray,
          },
          text: {
            primary: lightTheme.color,
            secondary: lightTheme.blueish_gray,
          },
          graphStrokeColor: lightTheme.graphStrokeColor,
          error: {
            main: colors.feedback.error,
          },
          info: {
            main: colors.feedback.userFeedback,
          },
          success: {
            main: colors.feedback.success,
          },
          warning: {
            main: colors.feedback.warning,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: `
            ${fonts}
            body {
              background:${lightTheme.background};
              background-repeat:no-repeat;
              background-attachment:fixed;
              font-size:0.75rem;
              font-weight:400;
            }
            `,
          },
          MuiSwitch: {
            styleOverrides: {
              colorPrimary: {
                color: lightTheme.color,
                [`&.${switchClasses["checked"]}`]: {
                  color: lightTheme.switchBg,
                  [`& + ${switchClasses["track"]}`]: {
                    backgroundColor: lightTheme.color,
                    borderColor: lightTheme.color,
                  },
                },
              },
              track: {
                border: `1px solid ${lightTheme.color}`,
                backgroundColor: lightTheme.switchBg,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                background: lightTheme.paperBg,
                "&.ohm-card": {
                  background: lightTheme.paperBg,
                },
                "&.MuiPaper-root&.tooltip-container": {
                  background: lightTheme.paperBg,
                },
                "&.ohm-modal": {
                  backgroundColor: lightTheme.modalBg,
                },
                "&.ohm-menu": {
                  backgroundColor: lightTheme.menuBg,
                  backdropFilter: "blur(33px)",
                },
                "&.ohm-popover": {
                  backgroundColor: lightTheme.popoverBg,
                  color: lightTheme.color,
                  backdropFilter: "blur(15px)",
                },
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
                  color: lightTheme.blueish_gray,
                  "&.active": {
                    color: lightTheme.color,
                  },
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                background: lightTheme.paperBg,
                zIndex: 7,
              },
            },
          },
          MuiBackdrop: {
            styleOverrides: {
              root: {
                backgroundColor: "rgba(255,255,255, 0)",
              },
            },
          },
          MuiLink: {
            styleOverrides: {
              root: {
                color: lightTheme.color,
                "&:hover": {
                  color: lightTheme.textHighlightColor,
                  textDecoration: "none",
                  "&.active": {
                    color: lightTheme.color,
                  },
                },
                "&.active": {
                  color: lightTheme.color,
                  textDecoration: "underline",
                },
                "@media (hover:none)": {
                  "&:hover": {
                    color: lightTheme.textHighlightColor,
                    textDecoration: "none",
                    backgroundColor: "#00000000 !important",
                  },
                  "&:focus": {
                    color: lightTheme.textHighlightColor,
                    backgroundColor: "#00000000 !important",
                  },
                },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                color: lightTheme.color,
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                color: lightTheme.color,
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              notchedOutline: {
                borderColor: `${lightTheme.color} !important`,
                "&:hover": {
                  borderColor: `${lightTheme.color} !important`,
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              textColorPrimary: {
                color: lightTheme.blueish_gray,
                [`&.${tabClasses["selected"]}`]: {
                  color: lightTheme.color,
                },
              },
              root: {
                "&.Mui-selected": {
                  textDecoration: "underline",
                  textUnderlineOffset: "5px",
                },
                "&:hover": {
                  color: colors.gray[500],
                  textDecoration: "underline",
                  textUnderlineOffset: "5px",
                },
              },
            },
          },
          PrivateTabIndicator: {
            styleOverrides: {
              colorPrimary: {
                backgroundColor: lightTheme.color,
              },
            },
          },
          MuiToggleButton: {
            styleOverrides: {
              root: {
                background: lightTheme.paperBg,
                "&:hover": {
                  color: lightTheme.color,
                  backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
                },
                selected: {
                  backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
                },
                "@media (hover:none)": {
                  "&:hover": {
                    color: lightTheme.color,
                    background: lightTheme.paperBg,
                  },
                  "&:focus": {
                    color: lightTheme.color,
                    background: lightTheme.paperBg,
                  },
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
                },
                "@media (hover:none)": {
                  "&:hover": {
                    color: lightTheme.color,
                    backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
                  },
                  "&:focus": {
                    color: lightTheme.color,
                    backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
                  },
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              select: {
                color: "#93AEBC",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              containedPrimary: {
                color: "#FCFCFC",
                backgroundColor: lightTheme.primaryButtonBG,
                "&:hover": {
                  backgroundColor: lightTheme.primaryButtonHoverBG,
                  color: lightTheme.primaryButtonHoverColor,
                },
                "@media (hover:none)": {
                  color: lightTheme.color,
                  backgroundColor: lightTheme.primaryButtonBG,
                  "&:hover": {
                    backgroundColor: lightTheme.primaryButtonHoverBG,
                  },
                },
              },
              containedSecondary: {
                color: lightTheme.color,
                background: lightTheme.paperBg,
                "&:hover": {
                  color: "#333333",
                },
                "@media (hover:none)": {
                  color: lightTheme.color,
                  background: lightTheme.paperBg,
                  "&:hover": {
                    color: "#FCFCFC",
                  },
                },
              },
              outlinedPrimary: {
                color: lightTheme.primaryButtonBG,
                borderColor: lightTheme.primaryButtonBG,
                "&:hover": {
                  color: lightTheme.gold,
                  backgroundColor: lightTheme.primaryButtonHoverBG,
                  borderColor: lightTheme.primaryButtonBG,
                },
                "@media (hover:none)": {
                  color: lightTheme.primaryButtonBG,
                  borderColor: lightTheme.primaryButtonBG,
                  "&:hover": {
                    color: `${lightTheme.gold} !important`,
                    backgroundColor: `${lightTheme.primaryButtonBG} !important`,
                  },
                },
              },
              outlinedSecondary: {
                color: lightTheme.color,
                borderColor: lightTheme.color,
                "&:hover": {
                  color: lightTheme.outlinedSecondaryButtonHoverColor,
                  backgroundColor: lightTheme.outlinedSecondaryButtonHoverBG,
                  borderColor: "#333333",
                },
              },
              textPrimary: {
                color: lightTheme.gray,
                "&:hover": {
                  color: lightTheme.textHighlightColor,
                  backgroundColor: "#00000000",
                },
                "&:active": {
                  color: lightTheme.gold,
                  borderBottom: "#F8CC82",
                },
              },
              textSecondary: {
                color: lightTheme.color,
                "&:hover": {
                  color: lightTheme.textHighlightColor,
                },
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              root: {
                "&.grid-message-typography": {
                  color: lightTheme.blueish_gray,
                },
                "&.chain-highlight": {
                  color: lightTheme.color,
                },
              },
            },
          },
          MuiGrid: {
            styleOverrides: {
              root: {
                "&.grid-button": {
                  borderColor: `${lightTheme.gridButtonActiveBackground} !important`,
                  "&:hover": {
                    backgroundColor: lightTheme.gridButtonHoverBackground,
                  },
                  "&.current": {
                    backgroundColor: lightTheme.gridButtonActiveBackground,
                    "&:hover": {
                      backgroundColor: lightTheme.gridButtonHoverBackground,
                    },
                  },
                },
              },
            },
          },
        },
      },
      commonSettings,
    ),
  ),
);
