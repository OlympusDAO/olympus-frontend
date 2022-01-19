import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

import fonts from "./fonts";
import commonSettings, { handleBackdropFilter } from "./global.js";

export const girthTheme = {
  color: "#EFEFEF",
  gold: "#F8CC82",
  textHighlightColor: "#F4D092",
  backgroundColor: "#4158D0",
  background: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
  paperBg: "#4242426A",
  menuBg: handleBackdropFilter("rgba(66, 66, 66, 0.41)"),
  modalBg: "#F9F9F9AA",
  primaryButtonBG: "#F8CC82",
  primaryButtonHoverBG: "#759AAE",
  largeTextColor: "#759AAE",
  activeLinkColor: "#222222",
  secondaryButtonBG: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#F8CC82",
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "#FCFCFC",
  outlinedSecondaryButtonHoverColor: "#333333",
  containedSecondaryButtonHoverBG: "#363840",
};

export const girth = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: girthTheme.color,
      },
      palette: {
        type: "dark",
        background: {
          default: girthTheme.backgroundColor,
          paper: girthTheme.paperBg,
        },
        contrastText: girthTheme.color,
        primary: {
          main: girthTheme.color,
        },
        neutral: {
          main: girthTheme.color,
          secondary: girthTheme.gray,
        },
        text: {
          primary: girthTheme.color,
          secondary: girthTheme.gray,
        },
        highlight: girthTheme.textHighlightColor,
      },
      typography: {
        fontFamily: "Square",
      },
      props: {
        MuiSvgIcon: {
          htmlColor: girthTheme.color,
        },
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "@font-face": fonts,
            body: {
              background: girthTheme.background,
            },
          },
        },
        MuiPaper: {
          root: {
            "&.ohm-menu": {
              backgroundColor: girthTheme.menuBg,
            },
            "&.ohm-modal": {
              backgroundColor: girthTheme.menuBg,
            },
          },
        },
        MuiBackdrop: {
          root: {
            backgroundColor: "rgba(100, 100, 100, 0.41)",
          },
        },
        MuiLink: {
          root: {
            color: girthTheme.color,
            "&:hover": {
              color: girthTheme.textHighlightColor,
              textDecoration: "none",
              "&.active": {
                color: girthTheme.color,
              },
            },
            "&.active": {
              color: girthTheme.color,
              textDecoration: "underline",
            },
          },
        },
        MuiTableCell: {
          root: {
            color: girthTheme.color,
          },
        },
        MuiToggleButton: {
          root: {
            backgroundColor: girthTheme.paperBg,
            "&:hover": {
              backgroundColor: girthTheme.secondaryButtonHoverBG,
            },
            selected: {
              backgroundColor: girthTheme.secondaryButtonHoverBG,
            },
          },
        },
        MuiButton: {
          containedPrimary: {
            color: "#333333",
            backgroundColor: girthTheme.primaryButtonBG,
            "&:hover": {
              backgroundColor: girthTheme.primaryButtonHoverBG,
              color: girthTheme.primaryButtonHoverColor,
            },
            "@media (hover:none)": {
              color: girthTheme.color,
              backgroundColor: girthTheme.primaryButtonBG,
              "&:hover": {
                backgroundColor: girthTheme.primaryButtonHoverBG,
              },
            },
          },
          containedSecondary: {
            backgroundColor: girthTheme.paperBg,
            color: girthTheme.color,
            "&:hover": {
              backgroundColor: girthTheme.secondaryButtonHoverBG,
            },
            "@media (hover:none)": {
              color: girthTheme.color,
              backgroundColor: girthTheme.paperBg,
              "&:hover": {
                backgroundColor: girthTheme.secondaryButtonHoverBG,
              },
            },
          },
          outlinedPrimary: {
            color: girthTheme.gold,
            borderColor: girthTheme.gold,
            "&:hover": {
              color: girthTheme.outlinedPrimaryButtonHoverColor,
              backgroundColor: girthTheme.outlinedPrimaryButtonHoverBG,
            },
          },
          outlinedSecondary: {
            color: girthTheme.color,
            borderColor: girthTheme.color,
            "&:hover": {
              color: girthTheme.outlinedSecondaryButtonHoverColor,
              backgroundColor: girthTheme.outlinedSecondaryButtonHoverBG,
              borderColor: "#333333",
            },
          },
          textPrimary: {
            color: "#A3A3A3",
            "&:hover": {
              color: girthTheme.gold,
              backgroundColor: "#00000000",
            },
            "&:active": {
              color: girthTheme.gold,
              borderBottom: "#F8CC82",
            },
          },
          textSecondary: {
            color: girthTheme.color,
            "&:hover": {
              color: girthTheme.textHighlightColor,
            },
          },
        },
      },
    },
    commonSettings,
  ),
);
