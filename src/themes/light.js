import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";
import commonSettings from "./global.js";

const lightTheme = {
  color: "#222222",
  gold: "#F8CC82",
  gray: "#A3A3A3",
  textHighlightColor: "#F4D092",
  backgroundColor: "#83A5CB11",
  // background:
  // "radial-gradient(circle at 25% 0%, rgba(227,255,240,.5), rgba(227,255,240,0) 50%), radial-gradient(circle at 80% 80%, rgba(131,165,203,.5), rgba(131,165,203,0) 50%)",
  background: "linear-gradient(180deg, #AFCDE9 0%, #F7FBE7 100%)",
  paperBg: "rgba(255, 255, 255, 0.6)",
  modalBg: "#F9F9F9AA",
  menuBg: "rgba(255, 255, 255, 0.6)",
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
  containedSecondaryButtonHoverBG: "#33333333",
  //
  // sidebarBorder: "#759AAE99",
  // iconColor: "brightness(0) saturate(100%)",
};

export const light = responsiveFontSizes(
  createMuiTheme(
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
          secondary: lightTheme.gray,
        },
      },
      typography: {
        fontFamily: "Square",
      },
      props: {
        MuiSvgIcon: {
          htmlColor: lightTheme.color,
        },
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
          "&.ohm-modal": {
            backgroundColor: lightTheme.modalBg,
          },
          "&.ohm-menu": {
            backgroundColor: lightTheme.menuBg,
            backdropFilter: "blur(60px)",
          },
        },
        MuiBackdrop: {
          root: {
            backgroundColor: "rgba(255,255,255, 0.6)",
          },
        },
        MuiLink: {
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
          },
        },
        MuiTableCell: {
          root: {
            color: lightTheme.color,
          },
        },
        MuiToggleButton: {
          root: {
            backgroundColor: lightTheme.paperBg,
            "&:hover": {
              backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
            },
            selected: {
              backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
            },
          },
        },
        MuiButton: {
          containedPrimary: {
            color: lightTheme.color,
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
              backgroundColor: `${lightTheme.containedSecondaryButtonHoverBG} !important`,
            },
            "@media (hover:none)": {
              color: lightTheme.color,
              backgroundColor: lightTheme.paperBg,
              "&:hover": {
                backgroundColor: `${lightTheme.containedSecondaryButtonHoverBG} !important`,
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
            color: "#A3A3A3",
            "&:hover": {
              color: lightTheme.gold,
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
    },
    commonSettings,
  ),
);
