import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";

const lightTheme = {
    color: "#222222",
		gold: "#F8CC82",
		textHighlightColor: "#F4D092",
    backgroundColor: "#83A5CB11",
    background: "radial-gradient(circle at 25% 0%, rgba(227,255,240,.5), rgba(227,255,240,0) 50%), radial-gradient(circle at 80% 80%, rgba(131,165,203,.5), rgba(131,165,203,0) 50%)",
    paperBg: "#F9F9F977",
    modalBg: "#F9F9F9AA",
		primaryBtnBg: "#759AAE",
    primaryBtnBgHover: "#93AEBC",
    sidebarBorder: "#759AAE99", 
    largeTextColor: "#759AAE",
    activeLinkColor: "#222222",
    logoColor: "none",
		iconColor: "brightness(0) saturate(100%)",
    activeLinkSvgColor: "invert(64%) sepia(11%) saturate(934%) hue-rotate(157deg) brightness(90%) contrast(86%)",
    filter: "0",
}

export const light = responsiveFontSizes(
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
      type: "light",
			background: {
					default: lightTheme.backgroundColor,
					paper: lightTheme.paperBg,	
			},
      contrastText: "#222222"
    },
    overrides: {
			MuiCssBaseline: {
				'@global': {
					'@font-face': fonts,
					body: {
						background: lightTheme.background,
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
					color: lightTheme.color,
					"&:hover": {
						borderColor: lightTheme.color,
						cursor: "pointer",
						color: lightTheme.color,
					},
					".active": {
						color: lightTheme.textHighlightColor,
					},
				},
			},
			MuiTableRow: {
				head: {
					color: "#999999"
				}
			},
			MuiTableCell: {
				root: {
					borderBottom: 0,
					color: lightTheme.color,
				}
			},
			MuiToggleButton: {
				root: {
					backgroundColor: lightTheme.paperBg,
				}
			},
      MuiButton: {
        root: {
          borderRadius: "5px"
        },
				containedPrimary: {
					color: "#FAFAFA",
					backgroundColor: lightTheme.primaryBtnBg,
					"&:hover": {
						backgroundColor: lightTheme.primaryBtnBgHover,
					}
				},
				containedSecondary: {
					backgroundColor: lightTheme.paperBg,
					color: lightTheme.color,
				},
				outlinedPrimary: {
          color: lightTheme.gold,
          borderColor: lightTheme.gold,
          textTransform: "none",
					textDecoration: "none",
        },
        outlinedSecondary: {
          color: lightTheme.color,
          borderColor: lightTheme.color,
          textTransform: "none",
					textDecoration: "none",
        },
        textPrimary: {
          color: "#A3A3A3",
          "&:hover": {
            color: lightTheme.gold,
            backgroundColor: "#00000000"
          },
          "&:active": {
            color: lightTheme.gold,
            borderBottom: "#F8CC82"
          }
        },
				textSecondary: {
					color: lightTheme.color,
					textTransform: "none",
					padding: "2px 2px",
					"&:hover": {
						color: lightTheme.textHighlightColor,
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


