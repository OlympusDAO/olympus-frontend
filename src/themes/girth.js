import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";

export const gTheme = {
  color: "#EFEFEF",
  gold: "#F8CC82",
  textHighlightColor: "#F4D092",
  backgroundColor: "#4158D0",
  background: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
  paperBg: "#4242426A",
  modalBg: "#F9F9F9AA",
  primaryBtnBg: "#759AAE",
  primaryBtnBgHover: "#93AEBC",
  largeTextColor: "#759AAE",
  activeLinkColor: "#222222",
  CTAButtonBorder: "2px solid #FFF",
  CTAButtonBorderColor: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
};

export const girth = responsiveFontSizes(
  createMuiTheme({
    typography: {
      fontSize: 16,
      fontFamily: "Square",
      props: {
        gutterBottom: false,
      },
      h3: {
        padding: "10px",
      },
      h4: {
        margin: "10px",
      },
      h5: {
        fontWeight: "bold",
      },
    },
    palette: {
      type: "light",
      background: {
        default: gTheme.backgroundColor,
        paper: gTheme.paperBg,
      },
      contrastText: "#FAFAFA",
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "@font-face": fonts,
          body: {
            background: gTheme.background,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiContainer: {
        root: {
          backgroundColor: "transparent",
          flexGrow: 1,
        },
      },
      MuiPaper: {
        root: {
          padding: "20px 20px 20px 20px", // global
          backdropFilter: "blur(60px)", // global
          borderRadius: "5px", // global
          maxWidth: "869px",
        },
      },
      MuiDrawer: {
        root: {
          width: "280px",
          flexShrink: 0,
        },
        paper: {
          width: "inherit",
          backgroundColor: "#00000000",
          padding: 0,
          square: true,
          rounded: false,
        },
      },
      MuiLink: {
        root: {
          color: gTheme.color,
          "&:hover": {
            borderColor: gTheme.color,
            cursor: "pointer",
            color: gTheme.color,
          },
          ".active": {
            color: gTheme.textHighlightColor,
          },
        },
      },
      MuiTableRow: {
        head: {
          color: "#999999",
        },
      },
      MuiTableCell: {
        root: {
          borderBottom: 0,
          color: gTheme.color,
        },
      },
      MuiToggleButton: {
        root: {
          backgroundColor: gTheme.paperBg,
        },
      },
      MuiButton: {
        root: {
          borderRadius: "5px",
        },
        containedPrimary: {
          color: "#FAFAFA",
          backgroundColor: gTheme.primaryBtnBg,
          "&:hover": {
            backgroundColor: gTheme.primaryBtnBgHover,
          },
        },
        containedSecondary: {
          backgroundColor: gTheme.paperBg,
          color: gTheme.color,
        },
        outlinedPrimary: {
          color: gTheme.gold,
          borderColor: gTheme.gold,
          textTransform: "none",
          textDecoration: "none",
        },
        outlinedSecondary: {
          color: gTheme.color,
          borderColor: gTheme.color,
          textTransform: "none",
          textDecoration: "none",
        },
        textPrimary: {
          color: "#A3A3A3",
          "&:hover": {
            color: gTheme.gold,
            backgroundColor: "#00000000",
          },
          "&:active": {
            color: gTheme.gold,
            borderBottom: "#F8CC82",
          },
        },
        textSecondary: {
          color: gTheme.color,
          textTransform: "none",
          padding: "2px 2px",
          "&:hover": {
            color: gTheme.textHighlightColor,
            backgroundColor: "#00000000",
          },
        },
      },
    },
    props: {
      MuiButton: {
        disableElevation: true,
        disableFocusRipple: true,
        disableRipple: true,
      },
      MuiPaper: {
        elevation: 0,
      },
    },
  }),
);
