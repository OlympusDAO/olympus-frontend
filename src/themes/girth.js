import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";
import commonSettings from "./global.js";

export const girthTheme = {
  color: "#EFEFEF",
  gold: "#F8CC82",
  textHighlightColor: "#F4D092",
  backgroundColor: "#4158D0",
  background: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
  paperBg: "#4242426A",
  modalBg: "#F9F9F9AA",
  primaryButtonBG: "#759AAE",
  primaryButtonBGHover: "#93AEBC",
  largeTextColor: "#759AAE",
  activeLinkColor: "#222222",
  CTAButtonBorder: "2px solid #FFF",
  secondaryButtonBG: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
  secondaryyButtonBGHover: "#93AEBC",
};

export const girth = responsiveFontSizes(
  createMuiTheme(
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
          "&.ohm-modal": {
            backgroundColor: girthTheme.modalBg,
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
            color: girthTheme.color,
            backgroundColor: girthTheme.primaryButtonBG,
            "&:hover": {
              backgroundColor: girthTheme.primaryButtonHoverBG,
              color: girthTheme.primaryButtonHoverColor,
            },
          },
          containedSecondary: {
            backgroundColor: girthTheme.paperBg,
            color: girthTheme.color,
            "&:hover": {
              backgroundColor: girthTheme.secondaryButtonHoverBG,
            },
          },
          outlinedPrimary: {
            color: girthTheme.gold,
            borderColor: girthTheme.gold,
            "&:hover": {
              color: girthTheme.outlinedPrimaryButtonHoverColor,
              backgroundColor: girthTheme.primaryButtonHoverBG,
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
