const breakpointValues = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

/**
 * will remove opacity from rgbaString when backdrop-filter is not supported
 * @param {String} rgbaString should be the rgba string
 * @returns modified rgbaString
 */
export const handleBackdropFilter = rgbaString => {
  const supported = CSS.supports("(-webkit-backdrop-filter: none)") || CSS.supports("(backdrop-filter: none)");
  if (!supported) {
    // make the opacity == 0.9;
    rgbaString = rgbaString.replace(/[\d\.]+\)$/g, "0.9)");
  }
  return rgbaString;
};

const commonSettings = {
  direction: "ltr",
  typography: {
    fontSize: 15,
    fontFamily: "NHassGrotesk",
    h1: {
      fontSize: "32px",
      fontWeight: 500,
      lineHeight: "36px",
    },
    h2: {
      fontSize: "27px",
      lineHeight: "32px",
    },
    h3: {
      fontSize: "24px",
      lineHeight: "32px",
    },
    h4: {
      fontSize: "24px",
      lineHeight: "32px",
    },
    h5: {
      fontSize: "24px",
      lineHeight: "32px",
    },
    h6: {
      fontSize: "24px",
      lineHeight: "32px",
    },
    body1: {
      fontSize: "15px",
      lineHeight: "24px",
    },
    body2: {
      fontSize: "12px",
      lineHeight: "15px",
    },
    button: {
      textTransform: "none",
      fontSize: "1.25rem",
    },
  },
  breakpoints: { values: breakpointValues },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            opacity: 0.3,
            color: "initial",
          },
        },
      },
      defaultProps: {
        disableElevation: true,
        disableFocusRipple: true,
        disableRipple: true,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          "&.ohm-card": {
            padding: "20px 30px 30px 30px",
            borderRadius: "var(--ohm-card-border-radius)",
            maxWidth: "900px",
            width: "97%",
            marginBottom: "1.8rem",
            overflow: "hidden",
          },
          "&.Paper-root&.ohm-chart-card": {
            padding: "20px 0px",
            whiteSpace: "nowrap",
            maxWidth: "700px",
            width: "97%",
            marginBottom: "1.8rem",
          },
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          flexGrow: 1,
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textUnderlineOffset: ".23rem",
          cursor: "pointer",
          "&:hover": {
            textDecoration: "none",
            underline: "none",
          },
        },
      },
      defaultProps: {
        underline: "none",
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          margin: "10px 0px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 0,
          fontSize: "1rem",
        },
        head: {
          color: "#999999",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: "264px",
          flexShrink: 0,
        },
        paper: {
          width: "inherit",
          padding: 0,
          zIndex: 100,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(15px)",
          zIndex: 0,
        },
      },
      defaultProps: {
        transitionDuration: 300,
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: "5px",
          margin: "8px",
          padding: "10px",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#00000000",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "39px",
          padding: "5px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          transform: "translate(16px, 14px) scale(1)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiLink-root": {
            textUnderlineOffset: "10px",
            textDecorationThickness: "3px",
          },
          height: "40px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: "min-content !important",
          padding: "0px",
          margin: "0px 10px",
          fontWeight: 500,
          fontStyle: "normal",
          lineHeight: "30px",
          opacity: 1,
        },
      },
    },
    MuiTextButton: {
      defaultProps: {
        disableFocusRipple: true,
        disableRipple: true,
      },
    },
    MuiSvgIcon: {
      defaultProps: {
        viewBox: "0 0 20 20",
        fontSize: "small",
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backdropFilter: "none",
          },
        },
      },
      defaultProps: {
        transitionDuration: 300,
      },
    },
  },
};

export default commonSettings;
