import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import SquareWOFF from "../assets/fonts/EuclidSquare-Regular.woff";
import SquareBoldWOFF from "../assets/fonts/EuclidSquare-Bold.woff";
import SquareItalicWOFF from "../assets/fonts/EuclidSquare-Italic.woff";
import SquareLightWOFF from "../assets/fonts/EuclidSquare-Light.woff";
import SquareMediumWOFF from "../assets/fonts/EuclidSquare-Medium.woff";

const square = {
	fontFamily: 'Square',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 400,
	src: `
		local('EuclidSquare'),
		local('EuclidSquare-Regular'),
		url(${SquareWOFF}) format('woff')
	`,
	unicodeRange:
		'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const squareLight = {
	fontFamily: 'Square',
	fontStyle: 'light',
	fontDisplay: 'swap',
	fontWeight: 300,
	src: `
		local('EuclidSquare'),
		local('EuclidSquare-Light'),
		url(${SquareLightWOFF}) format('woff')
	`,
	unicodeRange:
		'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const squareMedium = {
	fontFamily: 'Square',
	fontStyle: 'medium',
	fontDisplay: 'swap',
	fontWeight: 500,
	src: `
		local('EuclidSquare'),
		local('EuclidSquare-Medium'),
		url(${SquareMediumWOFF}) format('woff')
	`,
	unicodeRange:
		'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const squareBold = {
	fontFamily: 'Square',
	fontStyle: 'bold',
	fontDisplay: 'swap',
	fontWeight: 800,
	src: `
		local('EuclidSquare-Bold'),
		local('EuclidSquare-Bold'),
		url(${SquareBoldWOFF}) format('woff')
	`,
	unicodeRange:
		'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const squareItalic = {
	fontFamily: 'Square',
	fontStyle: 'italic',
	fontDisplay: 'swap',
	fontWeight: 400,
	src: `
		local('EuclidSquare-Italic'),
		local('EuclidSquare-Italic'),
		url(${SquareItalicWOFF}) format('woff')
	`,
	unicodeRange:
		'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
}



const darkTheme = {
    color: "#ffffff",
		textHighlightColor: "#F4D092",
    backgroundColor: "#3A4050",
    background: "radial-gradient(circle at 25% 0%, rgba(227,255,240,.5), rgba(227,255,240,0) 50%), radial-gradient(circle at 80% 80%, rgba(131,165,203,.5), rgba(131,165,203,0) 50%)",
    // background: "linear-gradient(180deg, #080F35AA 0%, #00000A 100%), radial-gradient(circle at 80% 80%, rgba(180, 255, 217, 1), rgba(180, 255, 217, 0.3))",
    paperBg: "rgba(54, 56, 64, 0.4)",
    modalBg: "rgba(27, 29, 34, 0.8)",
    largeTextColor: "#F4D092",
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
			fontFamily: 'Square',
      props: {
        gutterBottom: false
      },
      h3: {
        padding: "10px"
      },
      h4: {
        margin: "10px",
      },
			h5: {
				fontWeight: "bold",
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
			background: {
				default: darkTheme.backgroundColor,
				paper: darkTheme.paperBg,	
			},
      contrastText: "#FFFFFF"
    },
    overrides: {
			MuiCssBaseline: {
				'@global': {
					'@font-face': [square, squareLight, squareMedium, squareBold, squareItalic],
					body: {
						background: darkTheme.background,
						backgroundRepeat: "no-repeat",
						backgroundAttachment: "fixed",
					},
				}
			},
      MuiContainer: {
        root: {
					backgroundColor: "transparent",
					flexGrow: 1,
        }
      },
			MuiPaper: {
        root: {
          padding: "20px 20px 20px 20px", // global
          backdropFilter: "blur(60px)", // global
          borderRadius: "5px", // global
					maxWidth: "969px",
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
				}
			},
			MuiLink: {
				root: {
					color: darkTheme.color,
					borderBottom: "2px solid",
					"&:hover": {
						borderColor: darkTheme.color,
						cursor: "pointer",
						color: darkTheme.color,
					},
					".active": {
						color: darkTheme.textHighlightColor,
					},
				},
			},
			MuiTableCell: {
				root: {
					borderBottom: 0,
				}
			},
      MuiButton: {
        root: {
          padding: "9px 20px",
          borderRadius: "5px"
        },
				primary: {
					color: "#333333"
				},
				secondary: {
					backgroundColor: darkTheme.paperBg
				},
				outlinedPrimary: {
          color: "#F8CC82",
          borderColor: "#F8CC82",
          textTransform: "none"
        },
        outlinedSecondary: {
          color: "#FFFFFF",
          borderColor: "#FFFFFF",
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
        },
				textSecondary: {
					color: darkTheme.color,
					textTransform: "none",
					padding: "2px 2px",
					"&:hover": {
						color: darkTheme.textHighlightColor,
						backgroundColor: "#00000000"
					}
				}
      },
    },
    props: {
      MuiButton: {
        disableElevation: true,
        disableFocusRipple: true,
        disableRipple: true
      },
			MuiPaper: {
				elevation: 0,	
			}
    }
  })
);


