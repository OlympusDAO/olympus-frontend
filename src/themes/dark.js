// import Square
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const darkTheme = {
    color: "#ffffff",
    backgroundColor: "#3A4050",
    // background: "radial-gradient(circle at 25% 0%, rgba(227,255,240,.5), rgba(227,255,240,0) 50%), radial-gradient(circle at 80% 80%, rgba(131,165,203,.5), rgba(131,165,203,0) 50%)",
    background: "linear-gradient(180deg, #080F35AA 0%, #00000A 100%), radial-gradient(circle at 25% 0%, rgba(180, 255, 217, 1), rgba(180, 255, 217, 0.3))",
    // cardBg: "rgba(27, 29, 34, 0.4)",
    paperBg: "rgba(54, 56, 64, 0.5)",
    modalBg: "rgba(27, 29, 34, 0.8)",
    largeTextColor: "#F4D092",
    cardBorder: "none",
    logoColor: "invert(1)",
    defaultButtonBg: "rgba(27, 29, 34, 0.6)",
    // TopBarButtonBg: "rgba(33, 33, 33, 0.5)",
    TopBarButtonBg: "#1B1D22AA",
    TopBarButtonBgHover: "#5A6C7D",
    TopBarButtonColor: "#ffffff",
    TopBarButtonColorHover: "#ffffff",
    TopBarButtonBorder: "",
    TopBarButtonBorderHover: "",
    CTAButtonBg: "#F4D092",
    CTAButtonBgHover: "#EDD8B4",
    CTAButtonColor: "#222222",
    CTAButtonColorHover: "#000000",
    CTAButtonBorder: "2px solid #F4D092",
    CTAButtonBorderHover: "2px solid #EDD8B4",
    CTALpButtonBg: "transparent",
    CTALpButtonBgHover: "#F4D092",
    CTALpButtonColor: "#ffffff",
    CTALpButtonColorHover: "#000000",
    CTALpButtonBorder: "2px solid #FFFFFF",
    CTALpButtonBorderHover: "2px solid #F4D092",
    activeLinkColor: "#F5DDB4",
    activeLinkSvgColor: "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
    filter: "1",
}


export const dark = responsiveFontSizes(
  createMuiTheme({
    typography: {
      fontSize: 16,
      props: {
        gutterBottom: false
      },
      h3: {
        padding: "10px"
      },
      h4: {
        margin: "10px"
      }
    },
    palette: {
      type: "dark",
      primary: {
        main: "#F8CC82"
      },
      secondary: {
        main: "#00000000"
      },
      contrastText: "#FCFCFC"
    },
    overrides: {
      MuiContainer: {
        root: {
         backgroundColor: darkTheme.backgroundColor,
          background: darkTheme.background,
          height: "100vh", // these will be in global makeStyle
          width: "100vw"
        }
      },
      MuiButton: {
        root: {
          padding: "9px 20px",
          margin: "10px",
          borderRadius: "5px"
        },
        outlinedSecondary: {
          color: "#F8CC82",
          borderColor: "#F8CC82",
          textTransform: "none"
        },
        textPrimary: {
          color: "#A3A3A3",
          "&:hover": {
            color: "#F8CC82",
            backgroundColor: "#00000000"
          },
          "&:active": {
            color: "#F8CC82",
            borderBottom: "#F8CC82"
          }
        }
      },
      MuiPaper: {
        root: {
          backgroundColor: darkTheme.paperBg,
          padding: "20px 0px 50px 0px", // global
          backdropFilter: "blur(60px)", // global
          borderRadius: "5px" // global
        }
      }
    },
    props: {
      MuiButton: {
        disableElevation: true,
        disableFocusRipple: true,
        disableRipple: true
      }
    }
  })
);


