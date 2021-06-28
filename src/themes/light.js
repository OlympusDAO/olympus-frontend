import { createMuiTheme } from "@material-ui/core";

export const lightTheme = createMuiTheme({
    backgroundColor: "#83A5CB11",
    background: "radial-gradient(circle at 25% 0%, rgba(227,255,240,.5), rgba(227,255,240,0) 50%), radial-gradient(circle at 80% 80%, rgba(131,165,203,.5), rgba(131,165,203,0) 50%)",
    overrides: {
        MuiTypography: {
            color: "#222222",
            h1: { color: "#759AAE" },
            h2: { color: "#759AAE" },
            h3: { color: "#759AAE" }
        },
        MuiButton: {
            root: {
                backgroundColor: "rgba(252,252,252, 0.6)",
                text: "#222222",
            },
            primary: {

            },
            secondary: {
                backgroundColor: "#759AAE",
                '&:hover': {
                    backgroundColor: "#93AEBC"
                }
            }
        },
        MuiPaper: {
            root: {
                border: "1px solid #759AAE99",
                backgroundColor: "#F9F9F977",
            }
        }
    },
    
    // modalBg: "#F9F9F9AA",
    // logoColor: "none",
    // TopBarButtonBg: "rgba(252, 252, 252, 0.5)",
    // TopBarButtonBgHover: "rgba(227, 218, 191, 0.5)",
    // TopBarButtonColor: "#000000",
    // TopBarButtonColorHover: "#000000",
    // TopBarButtonBorder: "1px solid #759AAE99",
    // TopBarButtonBorderHover: "",
    // CTAButtonBg: "#759AAE",
    // CTAButtonColor: "#ffffff",
    // CTAButtonColorHover: "#ffffff",
    // CTAButtonBorder: "2px solid #759AAE",
    // CTAButtonBorderHover: "2px solid #93AEBC",
    // CTALpButtonBg: "transparent",
    // CTALpButtonBgHover: "#758cae",
    // CTALpButtonColor: "#000000",
    // CTALpButtonColorHover: "#ffffff",
    // CTALpButtonBorder: "2px solid #000000",
    // CTALpButtonBorderHover: "2px solid #758cae",
    // iconColor: "brightness(0) saturate(100%)",
    // activeLinkColor: "#759AAE",
    // activeLinkSvgColor: "invert(64%) sepia(11%) saturate(934%) hue-rotate(157deg) brightness(90%) contrast(86%)",
    // filter: "0",
})