import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";
import commonSettings, { handleBackdropFilter, BG_RED, BG_RED_SECONDARY, PRIMARY_WHITE } from "./global.js";

const lightTheme = {
  color: "#253449",
  bgRed: BG_RED,
  gray: "#A3A3A3",
  blueish_gray: "#768299",
  textHighlightColor: BG_RED,
  backgroundColor: "#F0ECF4",
  background: "",
  paperBg: "rgba(255, 255, 255, 0.6)",
  modalBg: "#FAFAFAEF",
  popoverBg: "rgba(255, 255, 255, 0.95)",
  menuBg: handleBackdropFilter("rgba(255, 255, 255, 0.5)"),
  backdropBg: BG_RED,
  largeTextColor: BG_RED_SECONDARY,
  activeLinkColor: "#222222",
  activeLinkSvgColor: "invert(64%) sepia(11%) saturate(934%) hue-rotate(157deg) brightness(90%) contrast(86%)",
  primaryButtonColor: PRIMARY_WHITE,
  primaryButtonBG: BG_RED,
  primaryButtonHoverBG: BG_RED_SECONDARY,
  primaryButtonHoverColor: PRIMARY_WHITE,
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: BG_RED,
  outlinedPrimaryButtonHoverColor: BG_RED,
  outlinedSecondaryButtonHoverBG: PRIMARY_WHITE,
  outlinedSecondaryButtonHoverColor: BG_RED,
  containedSecondaryButtonHoverBG: "#33333333",
  graphStrokeColor: "rgba(37, 52, 73, .2)",
  gridButtonHoverBackground: "rgba(118, 130, 153, 0.2)",
  gridButtonActiveBackground: "rgba(118, 130, 153, 0.7)",
};

export const light = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: lightTheme.color,
      },
      palette: {
        type: "light",
        background: {
          default: lightTheme.backgroundColor,
          paper: lightTheme.paperBg,
        },
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
      },
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "@font-face": fonts,
            body: {
              background: lightTheme.background,
            },
          },
        },
        MuiPaper: {
          root: {
            backgroundColor: lightTheme.paperBg,
            "&.ohm-card": {
              backgroundColor: lightTheme.paperBg,
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
        MuiDrawer: {
          paper: {
            backgroundColor: lightTheme.backdropBg,
            zIndex: 7,
          },
        },
        MuiBackdrop: {
          root: {
            backgroundColor: PRIMARY_WHITE,
          },
        },
        MuiLink: {
          root: {
            color: lightTheme.color,
            "&:hover": {
              color: lightTheme.textHighlightColor,
              textDecoration: "none",
              "&.active": {
                color: lightTheme.bgRed,
              },
            },
            "&.active": {
              color: lightTheme.bgRed,
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
        MuiTableCell: {
          root: {
            color: lightTheme.color,
          },
        },
        MuiInputBase: {
          root: {
            color: lightTheme.color,
          },
        },
        MuiOutlinedInput: {
          notchedOutline: {
            borderColor: `${lightTheme.color} !important`,
            "&:hover": {
              borderColor: `${lightTheme.color} !important`,
            },
          },
        },
        MuiTab: {
          textColorPrimary: {
            color: lightTheme.blueish_gray,
            "&$selected": {
              color: lightTheme.bgRed,
            },
          },
        },
        PrivateTabIndicator: {
          colorPrimary: {
            backgroundColor: lightTheme.bgRed,
          },
        },
        MuiToggleButton: {
          root: {
            backgroundColor: lightTheme.paperBg,
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
                backgroundColor: lightTheme.paperBg,
              },
              "&:focus": {
                color: lightTheme.color,
                backgroundColor: lightTheme.paperBg,
              },
            },
          },
        },
        MuiIconButton: {
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
        MuiSelect: {
          select: {
            color: BG_RED,
          },
        },
        MuiButton: {
          containedPrimary: {
            color: lightTheme.primaryButtonColor,
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
            backgroundColor: lightTheme.paperBg,
            "&:hover": {
              color: lightTheme.primaryButtonColor,
              backgroundColor: `${lightTheme.containedSecondaryButtonHoverBG} !important`,
            },
            "@media (hover:none)": {
              color: lightTheme.color,
              backgroundColor: lightTheme.paperBg,
              "&:hover": {
                color: lightTheme.primaryButtonColor,
                backgroundColor: `${lightTheme.containedSecondaryButtonHoverBG} !important`,
              },
            },
          },
          outlinedPrimary: {
            color: lightTheme.primaryButtonBG,
            borderColor: lightTheme.primaryButtonBG,
            "&:hover": {
              color: lightTheme.bgRed,
              backgroundColor: lightTheme.primaryButtonHoverBG,
              borderColor: lightTheme.primaryButtonBG,
            },
            "@media (hover:none)": {
              color: lightTheme.primaryButtonBG,
              borderColor: lightTheme.primaryButtonBG,
              "&:hover": {
                color: `${lightTheme.bgRed} !important`,
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
              borderColor: lightTheme.bgRed,
            },
          },
          textPrimary: {
            color: lightTheme.gray,
            "&:hover": {
              color: lightTheme.textHighlightColor,
              backgroundColor: "#00000000",
            },
            "&:active": {
              color: lightTheme.bgRed,
              borderBottom: lightTheme.bgRed,
            },
          },
          textSecondary: {
            color: lightTheme.color,
            "&:hover": {
              color: lightTheme.textHighlightColor,
            },
          },
          "&.grid-button-text": {
            color: lightTheme.primaryButtonColor,
          },
        },
        MuiTypography: {
          root: {
            "&.grid-message-typography": {
              color: lightTheme.blueish_gray,
            },
            "&.chain-highlight": {
              color: lightTheme.color,
            },
          },
        },
        MuiGrid: {
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
    commonSettings,
  ),
);
