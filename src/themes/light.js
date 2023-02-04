import { switchClasses, tabClasses } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { darkPalette } from "src/themes/darkPalette";
import fonts from "src/themes/fonts";
import commonSettings from "src/themes/global.js";
import { lightPalette as colors } from "src/themes/lightPalette";

const lightTheme = {
  gridButtonHoverBackground: "rgba(118, 130, 153, 0.2)",
  gridButtonActiveBackground: "rgba(118, 130, 153, 0.7)",
  switchBg: "#FCFCFC",
};

export const light = createTheme(
  deepmerge(
    {
      colors,
      palette: {
        mode: "light",
        contrastText: colors.gray[10],
        primary: {
          main: colors.gray[10],
        },
        neutral: {
          main: colors.gray[10],
          secondary: colors.gray[600],
        },
        text: {
          primary: colors.gray[10],
          secondary: colors.gray[40],
        },
        graphStrokeColor: "rgba(37, 52, 73, 0.2)",
        error: {
          main: colors.feedback.error,
        },
        info: {
          main: colors.feedback.userFeedback,
        },
        success: {
          main: colors.feedback.success,
        },
        warning: {
          main: colors.feedback.warning,
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
            ${fonts}
            body {
              background-color:"#FCF7EF";
            }
            `,
        },
        MuiSwitch: {
          styleOverrides: {
            switchBase: {
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
            colorPrimary: {
              color: colors.gray[10],
              [`&.${switchClasses["checked"]}`]: {
                color: lightTheme.switchBg,
                [`& + ${switchClasses["track"]}`]: {
                  backgroundColor: colors.gray[10],
                  borderColor: colors.gray[10],
                },
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
            },
            track: {
              border: `1px solid ${colors.gray[10]}`,
              backgroundColor: lightTheme.switchBg,
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              height: 9,
              borderRadius: 4,
            },
            colorPrimary: {
              backgroundColor: colors.gray[500],
            },
            barColorPrimary: {
              backgroundColor: colors.primary[300],
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              background: "transparent",
              "&.ohm-card": {
                background: "transparent",
              },
              "&.MuiPaper-root&.info-tooltip,  &.MuiPaper-root&.tooltip-container": {
                background: colors.gray[700],
              },
            },
          },
        },
        MuiModal: {
          styleOverrides: {
            root: {
              ".Paper-root": {
                background: colors.gray[700],
              },
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            root: {
              "& .MuiPaper-root": {
                background: colors.gray[700],
              },
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: colors.gray[700],
              zIndex: 7,
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              "& .MuiLink-root": {
                color: colors.gray[40],
                "&.active": {
                  color: colors.gray[10],
                },
              },
            },
          },
        },
        MuiBackdrop: {
          styleOverrides: {
            root: {
              backgroundColor: "rgba(255,255,255, 0)",
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              color: colors.gray[10],
              "&:hover": {
                color: colors.gray[500],
                textDecoration: "none",
                "&.active": {
                  color: colors.gray[10],
                },
              },
              "&.active": {
                color: colors.gray[10],
                textDecoration: "underline",
              },
              "@media (hover:none)": {
                "&:hover": {
                  color: colors.gray[500],
                  textDecoration: "none",
                  backgroundColor: "#00000000 !important",
                },
                "&:focus": {
                  color: colors.gray[500],
                  backgroundColor: "#00000000 !important",
                },
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              color: colors.gray[10],
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              color: colors.gray[10],
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: `${colors.gray[10]} !important`,
              "&:hover": {
                borderColor: `${colors.gray[10]} !important`,
              },
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            textColorPrimary: {
              color: colors.gray[40],
              [`&.${tabClasses["selected"]}`]: {
                color: colors.gray[10],
              },
            },
            root: {
              "&.Mui-selected": {
                textDecoration: "underline",
                textUnderlineOffset: "10px",
                textDecorationThickness: "3px",
              },
              "&:hover": {
                color: colors.gray[500],
                textDecoration: "underline",
                textUnderlineOffset: "10px",
                textDecorationThickness: "3px",
              },
            },
          },
        },
        PrivateTabIndicator: {
          styleOverrides: {
            colorPrimary: {
              backgroundColor: colors.gray[10],
            },
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: {
              background: colors.paper.card,
              "&:hover": {
                background: colors.paper.cardHover,
              },
              "@media (hover:none)": {
                "&:hover": {
                  background: colors.paper.cardHover,
                },
                "&:focus": {
                  background: colors.paper.cardHover,
                },
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              "&:hover": {
                backgroundColor: colors.gray[500],
              },
              "@media (hover:none)": {
                "&:hover": {
                  color: colors.gray[10],
                  backgroundColor: colors.gray[500],
                },
                "&:focus": {
                  color: colors.gray[10],
                  backgroundColor: colors.gray[500],
                },
              },
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            select: {
              color: "#93AEBC",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            containedPrimary: {
              color: colors.gray[40],
              backgroundColor: colors.primary[300],
              "&.Mui-disabled": {
                backgroundColor: colors.primary[300],
              },
              "&:hover": {
                backgroundColor: colors.primary[100],
              },
            },
            containedSecondary: {
              height: "39px",
              background: colors.paper.card,
              color: colors.gray[10],
              fontWeight: 500,
              "&:hover": {
                background: `${colors.paper.cardHover} !important`,
              },
              "&:active": {
                background: colors.paper.cardHover,
              },
              "&:focus": {
                background: colors.paper.cardHover,
              },
              "@media (hover:none)": {
                color: colors.gray[10],
                background: colors.paper.card,
                "&:hover": {
                  background: `${colors.paper.cardHover} !important`,
                },
              },
            },
            outlinedPrimary: {
              color: colors.gray[90],
              borderColor: colors.gray[90],
              "&.Mui-disabled": {
                color: colors.gray[90],
                borderColor: colors.gray[90],
              },
              "&:hover": {
                color: colors.gray[700],
                backgroundColor: colors.gray[90],
                borderColor: colors.gray[90],
              },
              "@media (hover:none)": {
                color: darkPalette.gray[700],
                borderColor: darkPalette.gray[700],
                "&:hover": {
                  color: `${colors.gray[600]} !important`,
                  backgroundColor: `${darkPalette.gray[10]} !important`,
                },
              },
            },
            outlinedSecondary: {
              color: colors.gray[40],
              borderColor: colors.gray[40],
              "&.Mui-disabled": {
                color: colors.gray[40],
                borderColor: colors.gray[40],
              },
              "&:hover": {
                backgroundColor: darkPalette.gray[10],
                borderColor: darkPalette.gray[10],
              },
            },
            textPrimary: {
              color: colors.gray[600],
              "&:hover": {
                color: colors.gray[500],
                backgroundColor: "#00000000",
              },
              "&:active": {
                color: colors.primary[300],
                borderBottom: "#F8CC82",
              },
            },
            textSecondary: {
              color: colors.gray[10],
              "&:hover": {
                color: colors.gray[500],
              },
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              "&.grid-message-typography": {
                color: colors.gray[40],
              },
              "&.chain-highlight": {
                color: colors.gray[10],
              },
            },
          },
        },
      },
    },
    commonSettings,
  ),
);
