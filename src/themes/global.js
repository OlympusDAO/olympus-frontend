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
    fontSize: 16,
    fontFamily: "Square",
    h1: {
      fontSize: "3.3rem",
    },
    h2: {
      fontSize: "2.3rem",
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
  breakpoints: { values: breakpointValues },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableFocusRipple: true,
        disableRipple: true,
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: "flex-end",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(33px)",
          "&.ohm-card": {
            padding: "20px 30px 30px 30px",
            borderRadius: "var(--ohm-card-border-radius)",
            maxWidth: "833px",
            width: "97%",
            marginBottom: "1.8rem",
            overflow: "hidden",
          },
          backdropFilter: "blur(33px)",
          "&.ohm-menu": {
            padding: "22px 0px",
            borderRadius: "10px",
            margin: "0px",
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
          width: "312px",
          flexShrink: 0,
        },
        paper: {
          width: "inherit",
          backgroundColor: "inherit",
          padding: 0,
          zIndex: 7,
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
          height: "43px",
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
          minHeight: "40px",
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
          fontWeight: 400,
          fontStyle: "normal",
          lineHeight: "24px",
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
      defaultProps: {
        transitionDuration: 300,
      },
    },
  },
};

export default commonSettings;
