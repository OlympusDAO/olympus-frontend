import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";
import commonSettings, { handleBackdropFilter, BG_RED, BG_RED_SECONDARY, PRIMARY_WHITE } from "./global.js";

const darkTheme = {
  color: PRIMARY_WHITE,
  bgRed: BG_RED,
  gray: "#A3A3A3",
  textHighlightColor: BG_RED,
  backgroundColor: "rgba(8, 15, 53, 1)",
  background: "",
  paperBg: "rgba(54, 56, 64, 0.4)",
  modalBg: "#24242699",
  popoverBg: "rgba(54, 56, 64, 0.99)",
  menuBg: handleBackdropFilter("rgba(54, 56, 64, 0.5)"),
  backdropBg: "rgba(54, 56, 64, 0.5)",
  largeTextColor: BG_RED,
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: PRIMARY_WHITE,
  primaryButtonBG: BG_RED,
  primaryButtonHoverBG: BG_RED_SECONDARY,
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: BG_RED,
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: BG_RED,
  containedSecondaryButtonHoverBG: "rgba(255, 255, 255, 0.15)",
  graphStrokeColor: "rgba(255, 255, 255, .1)",
  gridButtonHoverBackground: "rgba(255, 255, 255, 0.6)",
  gridButtonActiveBackground: "#00000038",
};

export const dark = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: darkTheme.color,
      },
      palette: {
        type: "dark",
        background: {
          default: darkTheme.backgroundColor,
          paper: darkTheme.paperBg,
        },
        contrastText: darkTheme.color,
        primary: {
          main: darkTheme.color,
        },
        neutral: {
          main: darkTheme.color,
          secondary: darkTheme.gray,
        },
        text: {
          primary: darkTheme.color,
          secondary: darkTheme.gray,
        },
        graphStrokeColor: darkTheme.graphStrokeColor,
        highlight: darkTheme.textHighlightColor,
      },
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "@font-face": fonts,
            body: {
              background: darkTheme.background,
            },
          },
        },
        MuiDrawer: {
          paper: {
            backgroundColor: darkTheme.paperBg,
            zIndex: 7,
          },
        },
        MuiSelect: {
          select: {
            color: BG_RED,
          },
        },
        MuiPaper: {
          root: {
            backgroundColor: darkTheme.paperBg,
            "&.ohm-card": {
              backgroundColor: darkTheme.paperBg,
            },
            "&.ohm-modal": {
              backgroundColor: darkTheme.modalBg,
            },
            "&.ohm-menu": {
              backgroundColor: darkTheme.menuBg,
              backdropFilter: "blur(33px)",
            },
            "&.ohm-popover": {
              backgroundColor: darkTheme.popoverBg,
              color: darkTheme.color,
              backdropFilter: "blur(15px)",
            },
          },
        },
        MuiBackdrop: {
          root: {
            backgroundColor: darkTheme.backdropBg,
          },
        },
        MuiLink: {
          root: {
            color: darkTheme.color,
            "&:hover": {
              color: darkTheme.textHighlightColor,
              textDecoration: "none",
              "&.active": {
                color: darkTheme.bgRed,
              },
            },
            "&.active": {
              color: darkTheme.bgRed,
              textDecoration: "underline",
            },
          },
        },
        MuiTableCell: {
          root: {
            color: darkTheme.color,
          },
        },
        MuiInputBase: {
          root: {
            // color: darkTheme.bgRed,
          },
        },
        MuiOutlinedInput: {
          notchedOutline: {
            // borderColor: `${darkTheme.bgRed} !important`,
            "&:hover": {
              // borderColor: `${darkTheme.bgRed} !important`,
            },
          },
        },
        MuiTab: {
          textColorPrimary: {
            color: darkTheme.gray,
            "&$selected": {
              color: darkTheme.bgRed,
            },
          },
        },
        PrivateTabIndicator: {
          colorPrimary: {
            backgroundColor: darkTheme.bgRed,
          },
        },
        MuiToggleButton: {
          root: {
            backgroundColor: darkTheme.paperBg,
            "&:hover": {
              color: darkTheme.color,
              backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
            },
            selected: {
              backgroundColor: darkTheme.containedSecondaryButtonHoverBG,
            },
            "@media (hover:none)": {
              "&:hover": {
                color: darkTheme.color,
                backgroundColor: darkTheme.paperBg,
              },
              "&:focus": {
                color: darkTheme.color,
                backgroundColor: darkTheme.paperBg,
                borderColor: "transparent",
                outline: "#00000000",
              },
            },
          },
        },
        MuiButton: {
          containedPrimary: {
            color: darkTheme.primaryButtonColor,
            backgroundColor: darkTheme.bgRed,
            "&:hover": {
              backgroundColor: darkTheme.primaryButtonHoverBG,
              color: darkTheme.primaryButtonHoverColor,
            },
            "&:active": {
              backgroundColor: darkTheme.primaryButtonHoverBG,
              color: darkTheme.primaryButtonHoverColor,
            },
            "@media (hover:none)": {
              color: darkTheme.primaryButtonColor,
              backgroundColor: darkTheme.bgRed,
              "&:hover": {
                backgroundColor: darkTheme.primaryButtonHoverBG,
              },
            },
          },
          containedSecondary: {
            backgroundColor: darkTheme.paperBg,
            color: darkTheme.color,
            "&:hover": {
              backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
            },
            "&:active": {
              backgroundColor: darkTheme.containedSecondaryButtonHoverBG,
            },
            "&:focus": {
              backgroundColor: darkTheme.paperBg,
            },
            "@media (hover:none)": {
              color: darkTheme.color,
              backgroundColor: darkTheme.paperBg,
              "&:hover": {
                backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
              },
            },
          },
          outlinedPrimary: {
            color: darkTheme.bgRed,
            borderColor: darkTheme.bgRed,
            "&:hover": {
              color: darkTheme.outlinedPrimaryButtonHoverColor,
              backgroundColor: darkTheme.primaryButtonHoverBG,
            },
            "@media (hover:none)": {
              color: darkTheme.bgRed,
              borderColor: darkTheme.bgRed,
              "&:hover": {
                color: darkTheme.outlinedPrimaryButtonHoverColor,
                backgroundColor: `${darkTheme.primaryButtonHoverBG} !important`,
                textDecoration: "none !important",
              },
            },
          },
          outlinedSecondary: {
            color: darkTheme.color,
            borderColor: darkTheme.color,
            "&:hover": {
              color: darkTheme.outlinedSecondaryButtonHoverColor,
              backgroundColor: darkTheme.outlinedSecondaryButtonHoverBG,
              borderColor: darkTheme.bgRed,
            },
          },
          textPrimary: {
            color: darkTheme.gray,
            "&:hover": {
              color: darkTheme.bgRed,
              backgroundColor: "#00000000",
            },
            "&:active": {
              color: darkTheme.bgRed,
              borderBottom: BG_RED,
            },
          },
          textSecondary: {
            color: darkTheme.color,
            "&:hover": {
              color: darkTheme.textHighlightColor,
            },
          },
          "&.grid-button-text": {
            color: darkTheme.primaryButtonColor,
          },
        },
        MuiTypography: {
          root: {
            "&.grid-message-typography": {
              color: "#A3A3A3",
            },
            "&.chain-highlight": {
              color: "#DADADA",
            },
            "&.current": {
              color: darkTheme.bgRed,
            },
          },
        },
        MuiGrid: {
          root: {
            "&.grid-button": {
              borderColor: `#FFFFFF !important`,
              "&:hover": {
                backgroundColor: darkTheme.gridButtonHoverBackground,
              },
              "&.current": {
                borderColor: `${darkTheme.bgRed} !important`,
                backgroundColor: darkTheme.gridButtonActiveBackground,
                "&:hover": {
                  backgroundColor: darkTheme.gridButtonHoverBackground,
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
