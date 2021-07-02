import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";


const darkTheme = {
    color: "#FCFCFC",
		gold: "#F8CC82",
		textHighlightColor: "#F4D092",
    backgroundColor: "#3A4050",
    background: "radial-gradient(circle at 25% 0%, rgba(227,255,240,.5), rgba(227,255,240,0) 50%), radial-gradient(circle at 80% 80%, rgba(131,165,203,.5), rgba(131,165,203,0) 50%)",
    // background: "linear-gradient(180deg, #080F35AA 0%, #00000A 100%), radial-gradient(circle at 80% 80%, rgba(180, 255, 217, 1), rgba(180, 255, 217, 0.3))",
    paperBg: "rgba(54, 56, 64, 0.5)",
    modalBg: "rgba(27, 29, 34, 0.8)",
    largeTextColor: "#F4D092",
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
			background: {
				default: darkTheme.backgroundColor,
				paper: darkTheme.paperBg,	
			},
      contrastText: "#FAFAFA"
    },
    overrides: {
			MuiCssBaseline: {
				'@global': {
					'@font-face': fonts,
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
				}
			},
			MuiLink: {
				root: {
					color: darkTheme.color,
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
					color: darkTheme.color,
				},
				head: {
					color: "#999999",
				}
			},
			MuiToggleButton: {
				root: {
					backgroundColor: darkTheme.paperBg,
				}
			},
      MuiButton: {
        root: {
          borderRadius: "5px"
        },
				containedPrimary: {
					color: "#333333",
					backgroundColor: darkTheme.gold
				},
				containedSecondary: {
					backgroundColor: darkTheme.paperBg,
					color: darkTheme.color,
				},
				outlinedPrimary: {
          color: darkTheme.gold,
          borderColor: darkTheme.gold,
          textTransform: "none",
					textDecoration: "none",
        },
        outlinedSecondary: {
          color: darkTheme.color,
          borderColor: darkTheme.color,
          textTransform: "none",
					textDecoration: "none",
        },
        textPrimary: {
          color: "#A3A3A3",
          "&:hover": {
            color: darkTheme.gold,
            backgroundColor: "#00000000"
          },
          "&:active": {
            color: darkTheme.gold,
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


