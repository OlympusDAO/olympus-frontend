import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

import fonts from "./fonts";
import commonSettings from "./global.js";

// TODO: Break repeated use color values out into list of consts declared here
// then set the values in darkTheme using the global color variables

const darkTheme = {
  color: "#FAFAFB",
  gold: "#F8CC82",
  gray: "#A3A3A3",
  textHighlightColor: "#F4D092",
  backgroundColor: "rgba(8, 15, 53, 1)",
  background: `
    linear-gradient(180deg, rgba(8, 15, 53, 0), rgba(0, 0, 10, 0.9)),
    linear-gradient(333deg, rgba(153, 207, 255, 0.2), rgba(180, 255, 217, 0.08)),
    radial-gradient(circle at 77% 89%, rgba(125, 163, 169, 0.8), rgba(125, 163, 169, 0) 50%),
    radial-gradient(circle at 15% 95%, rgba(125, 163, 169, 0.8), rgba(125, 163, 169, 0) 43%),
    radial-gradient(circle at 65% 23%, rgba(137, 151, 119, 0.4), rgba(137, 151, 119, 0) 70%),
    radial-gradient(circle at 10% 0%, rgba(187, 211, 204, 0.33), rgba(187,211,204,0) 35%),
    radial-gradient(circle at 11% 100%, rgba(131, 165, 203, 0.3), rgba(131, 165, 203, 0) 30%)
    `,
  paperBg: "linear-gradient(237.43deg, #2B313D -12.81%, #171A20 132.72%)",
  modalBg: "#24242699",
  popoverBg: "rgba(54, 56, 64, 0.99)",
  menuBg: "linear-gradient(237.43deg, #2B313D -12.81%, #171A20 132.72%)",
  backdropBg: "linear-gradient(237.43deg, #2B313D -12.81%, #171A20 132.72%)",
  largeTextColor: "#F4D092",
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#333333",
  primaryButtonBG: "#F4D092",
  primaryButtonHoverBG: "#EDD8B4",
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#F8CC82",
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: "#F8CC82", //gold
  containedSecondaryButtonHoverBG: "rgba(255, 255, 255, 0.15)",
  graphStrokeColor: "rgba(255, 255, 255, .1)",
  gridButtonHoverBackground: "rgba(255, 255, 255, 0.6)",
  gridButtonActiveBackground: "#00000038",
  switchBg: "#333333",
};

export const dark = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: darkTheme.color,
      },
      colors: {
        paper: {
          background: darkTheme.paperBg,
          card: "#1D2026",
          cardHover: "#343C49",
        },
        feedback: {
          success: "#94B9A1",
          userFeedback: "#49A1F2",
          error: "#FF6767",
          warning: "#FC8E5F",
          pnlGain: "#3D9C70",
        },
        gray: {
          700: "#181A1D",
          600: "#292C32",
          500: "#3F4552",
          90: "#676B74",
          40: "#A3A3A3",
          10: darkTheme.color,
        },
        primary: {
          300: "#F8CC82",
          100: "#EAD8B8",
          "300/A75": " rgba(248, 204, 130,0.75)",
          "300/A50": " rgba(248, 204, 130,0.5)",
        },
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
        fontFamily: "Square",
      },
      overrides: {
        MuiSwitch: {
          colorPrimary: {
            color: darkTheme.color,
            "&$checked": {
              color: darkTheme.switchBg,
              "& + $track": {
                backgroundColor: darkTheme.color,
                borderColor: darkTheme.color,
              },
            },
          },
          track: {
            border: `1px solid ${darkTheme.color}`,
            backgroundColor: darkTheme.switchBg,
          },
        },
        MuiAlert: {
          root: {
            background: "transparent",
          },
        },
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
            background: darkTheme.paperBg,
            zIndex: 7,
          },
        },
        MuiSelect: {
          select: {
            color: "#F8CC82",
          },
        },
        MuiPaper: {
          root: {
            "&.MuiAccordion-root": {
              background: "transparent",
            },
            background: darkTheme.paperBg,
            "&.ohm-card": {
              background: darkTheme.paperBg,
            },
            "&.ohm-modal": {
              backgroundColor: darkTheme.modalBg,
            },
            "&.MuiPaper-root.tooltip-container": {
              background: darkTheme.paperBg,
            },
            "&.ohm-menu": {
              background: darkTheme.menuBg,
              backdropFilter: "blur(33px)",
            },
            "&.ohm-popover": {
              backgroundColor: darkTheme.popoverBg,
              color: darkTheme.color,
              // backdropFilter: "blur(15px)",
            },
          },
        },
        MuiBackdrop: {
          root: {
            background: darkTheme.backdropBg,
          },
        },
        MuiLink: {
          root: {
            color: darkTheme.color,
            "&:hover": {
              color: darkTheme.textHighlightColor,
              textDecoration: "none",
              "&.active": {
                color: darkTheme.color,
              },
            },
            "&.active": {
              color: darkTheme.color,
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
            // color: darkTheme.gold,
          },
        },
        MuiOutlinedInput: {
          notchedOutline: {
            // borderColor: `${darkTheme.gold} !important`,
            "&:hover": {
              // borderColor: `${darkTheme.gold} !important`,
            },
          },
        },
        MuiTab: {
          textColorPrimary: {
            color: darkTheme.gray,
            "&$selected": {
              color: darkTheme.gold,
            },
          },
        },
        PrivateTabIndicator: {
          colorPrimary: {
            backgroundColor: darkTheme.gold,
          },
        },
        MuiToggleButton: {
          root: {
            background: darkTheme.paperBg,
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
                background: darkTheme.paperBg,
              },
              "&:focus": {
                color: darkTheme.color,
                background: darkTheme.paperBg,
                borderColor: "transparent",
                outline: "#00000000",
              },
            },
          },
        },
        MuiButton: {
          containedPrimary: {
            color: darkTheme.primaryButtonColor,
            backgroundColor: darkTheme.gold,
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
              backgroundColor: darkTheme.gold,
              "&:hover": {
                backgroundColor: darkTheme.primaryButtonHoverBG,
              },
            },
          },
          containedSecondary: {
            background: darkTheme.paperBg,
            color: darkTheme.color,
            "&:hover": {
              backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
            },
            "&:active": {
              backgroundColor: darkTheme.containedSecondaryButtonHoverBG,
            },
            "&:focus": {
              background: darkTheme.paperBg,
            },
            "@media (hover:none)": {
              color: darkTheme.color,
              background: darkTheme.paperBg,
              "&:hover": {
                backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
              },
            },
          },
          outlinedPrimary: {
            color: darkTheme.gold,
            borderColor: darkTheme.gold,
            "&:hover": {
              color: darkTheme.outlinedPrimaryButtonHoverColor,
              backgroundColor: darkTheme.primaryButtonHoverBG,
            },
            "@media (hover:none)": {
              color: darkTheme.gold,
              borderColor: darkTheme.gold,
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
              borderColor: darkTheme.gold,
            },
          },
          textPrimary: {
            color: "#A3A3A3",
            "&:hover": {
              color: darkTheme.gold,
              backgroundColor: "#00000000",
            },
            "&:active": {
              color: darkTheme.gold,
              borderBottom: "#F8CC82",
            },
          },
          textSecondary: {
            color: darkTheme.color,
            "&:hover": {
              color: darkTheme.textHighlightColor,
            },
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
              color: darkTheme.gold,
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
                borderColor: `${darkTheme.gold} !important`,
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
