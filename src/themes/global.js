import fonts from "./fonts";

const breakpointValues = {
  xs: 0,
  sm: 596,
  md: 800,
  lg: 1000,
  xl: 1333,
};

// replace above with this later
// const breakpointValues = {
//   mobile: 590,
//   tablet: 970,
//   browser: 1333,
// };

const commonSettings = {
  direction: "ltr",
  typography: {
    fontSize: 16,
    fontFamily: "Square",
    h1: {
      fontSize: "3rem",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 600,
      letterSpacing: "1.3px",
    },
    h3: {
      fontSize: "1.75rem",
    },
    h4: {
      fontSize: "1.5rem",
    },
    h5: {
      fontSize: "1.25rem",
      letterSpacing: "0.4px",
    },
    h6: {
      fontSize: "1rem",
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1,
    },
    body2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1,
    },
    button: {
      textTransform: "none",
      fontSize: "1.25rem",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": fonts,
        breakpoints: { values: breakpointValues },
        body: {
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiToolbar: {
      root: {
        justifyContent: "flex-end",
      },
    },
    MuiPaper: {
      root: {
        "&.ohm-card": {
          padding: "20px 20px 20px 20px",
          borderRadius: "10px",
          maxWidth: "833px",
          width: "97%",
          marginBottom: "1.8rem",
          borderRadius: "10px",
          backdropFilter: "blur(60px)",
        },
        "&.ohm-menu": {
          padding: "22px 20px",
          borderRadius: "10px",
          margin: "0px",
        },
      },
    },
    MuiContainer: {
      root: {
        backgroundColor: "transparent",
        flexGrow: 1,
      },
    },
    MuiLink: {
      root: {
        textUnderlineOffset: ".23rem",
        cursor: "pointer",
        "&:hover": {
          textDecoration: "none",
          underline: "none",
        },
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: 0,
        fontSize: "1rem",
      },
      head: {
        color: "#999999",
      },
    },
    MuiDrawer: {
      root: {
        width: "280px",
        flexShrink: 0,
      },
      paper: {
        width: "inherit",
        backgroundColor: "#00000011",
        backdropFilter: "blur(15px)",
        padding: 0,
        square: true,
        rounded: false,
        zIndex: 7,
      },
    },
    MuiBackdrop: {
      root: {
        backdropFilter: "blur(33px)",
      },
    },
    MuiToggleButton: {
      root: {
        border: 0,
        borderRadius: "5px",
        margin: "8px",
        padding: "10px",
      },
    },
    MuiButton: {
      root: {
        borderRadius: "5px",
        textTransform: "none",
        textDecoration: "none",
        whiteSpace: "nowrap",
        minWidth: "max-content",
        height: "40px",
      },
      containedPrimary: {
        border: 0,
        fontWeight: "500",
      },
      containedSecondary: {
        fontWeight: "400",
      },
      outlinedPrimary: {},
      outlinedSecondary: {
        textTransform: "none",
        textDecoration: "none",
      },
      text: {
        "&:hover": {
          backgroundColor: "#00000000",
        },
      },
      textSecondary: {
        textTransform: "none",
        textDecoration: "none",
        padding: "2px 2px",
        "&:hover": {
          backgroundColor: "#00000000",
        },
      },
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "#00000000",
        },
      },
    },
    MuiInputBase: {
      root: {
        height: "43px",
        padding: "5px",
      },
    },
    MuiInputLabel: {
      outlined: {
        transform: "translate(16px, 14px) scale(1)",
      },
    },
    MuiTabs: {
      root: {
        minHeight: "40px",
        height: "40px",
      },
    },
    MuiTab: {
      root: {
        minWidth: "fit-content !important",
        width: "min-content",
        padding: "0px",
        margin: "0px 20px",
      },
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiButton: {
      disableElevation: true,
      disableFocusRipple: true,
      disableRipple: true,
    },
    MuiTextButton: {
      disableFocusRipple: true,
      disableRipple: true,
    },
    MuiPaper: {
      elevation: 0,
    },
    MuiTypograph: {
      gutterBottom: true,
    },
    MuiLink: {
      underline: "none",
    },
    MuiSvgIcon: {
      viewBox: "0 0 20 20",
      fontSize: "small",
    },
    MuiBackdrop: {
      transitionDuration: 300,
    },
    MuiPopover: {
      transitionDuration: 300,
    },
  },
};

export default commonSettings;
