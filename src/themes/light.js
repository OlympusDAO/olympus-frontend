import { switchClasses, tabClasses } from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

import fonts from "./fonts";
import commonSettings, { handleBackdropFilter } from "./global.js";

const lightTheme = {
  textHighlightColor: "#93AEBC",
  backgroundColor: "#AFCDE9",
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
    error: "#FF6767",
    warning: "#FC8E5F",
    pnlGain: "#3D9C70",
  },
  gray: {
    700: "#FAFAFB",
    600: "#A3A3A3",
    500: "#676B74",
    90: "#3F4552",
    40: "#292C32",
    10: "#181A1D",
  },
  primary: {
    300: "#F8CC82",
    100: "#EAD8B8",
  },
};

export const light = responsiveFontSizes(
  createTheme(
    deepmerge(
      {
        colors,
        palette: {
          mode: "light",
          contrastText: colors.gray[10],
          primary: {
            main: colors.gray[10],
          },
          neutral: {
            main: colors.gray[10],
            secondary: colors.gray[600],
          },
          text: {
            primary: colors.gray[10],
            secondary: colors.gray[40],
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
                color: colors.gray[10],
                [`&.${switchClasses["checked"]}`]: {
                  color: lightTheme.switchBg,
                  [`& + ${switchClasses["track"]}`]: {
                    backgroundColor: colors.gray[10],
                    borderColor: colors.gray[10],
                  },
                },
              },
              track: {
                border: `1px solid ${colors.gray[10]}`,
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
                  color: colors.gray[10],
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
                  color: colors.gray[40],
                  "&.active": {
                    color: colors.gray[10],
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
                color: colors.gray[10],
                "&:hover": {
                  color: lightTheme.textHighlightColor,
                  textDecoration: "none",
                  "&.active": {
                    color: colors.gray[10],
                  },
                },
                "&.active": {
                  color: colors.gray[10],
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
                color: colors.gray[10],
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                color: colors.gray[10],
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              notchedOutline: {
                borderColor: `${colors.gray[10]} !important`,
                "&:hover": {
                  borderColor: `${colors.gray[10]} !important`,
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              textColorPrimary: {
                color: colors.gray[40],
                [`&.${tabClasses["selected"]}`]: {
                  color: colors.gray[10],
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
                backgroundColor: colors.gray[10],
              },
            },
          },
          MuiToggleButton: {
            styleOverrides: {
              root: {
                background: lightTheme.paperBg,
                "&:hover": {
                  color: colors.gray[10],
                  backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
                },
                selected: {
                  backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
                },
                "@media (hover:none)": {
                  "&:hover": {
                    color: colors.gray[10],
                    background: lightTheme.paperBg,
                  },
                  "&:focus": {
                    color: colors.gray[10],
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
                    color: colors.gray[10],
                    backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
                  },
                  "&:focus": {
                    color: colors.gray[10],
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
                  color: colors.gray[10],
                  backgroundColor: lightTheme.primaryButtonBG,
                  "&:hover": {
                    backgroundColor: lightTheme.primaryButtonHoverBG,
                  },
                },
              },
              containedSecondary: {
                color: colors.gray[10],
                background: lightTheme.paperBg,
                "&:hover": {
                  color: "#333333",
                },
                "@media (hover:none)": {
                  color: colors.gray[10],
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
                  color: colors.primary[300],
                  backgroundColor: lightTheme.primaryButtonHoverBG,
                  borderColor: lightTheme.primaryButtonBG,
                },
                "@media (hover:none)": {
                  color: lightTheme.primaryButtonBG,
                  borderColor: lightTheme.primaryButtonBG,
                  "&:hover": {
                    color: `${colors.primary[300]} !important`,
                    backgroundColor: `${lightTheme.primaryButtonBG} !important`,
                  },
                },
              },
              outlinedSecondary: {
                color: colors.gray[10],
                borderColor: colors.gray[10],
                "&:hover": {
                  color: lightTheme.outlinedSecondaryButtonHoverColor,
                  backgroundColor: lightTheme.outlinedSecondaryButtonHoverBG,
                  borderColor: "#333333",
                },
              },
              textPrimary: {
                color: colors.gray[600],
                "&:hover": {
                  color: lightTheme.textHighlightColor,
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
                  color: lightTheme.textHighlightColor,
                },
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              root: {
                "&.grid-message-typography": {
                  color: colors.gray[40],
                },
                "&.chain-highlight": {
                  color: colors.gray[10],
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
