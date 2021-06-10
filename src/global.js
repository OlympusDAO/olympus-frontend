import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    .app, #dapp {
        @font-face {font-family: 'Square-Bold';
            src: url('./assets/fonts/EuclidSquare-Bold.ttf');
        }
        @font-face {font-family: 'Square-Semi-Bold';
            src: url('./assets/fonts/EuclidSquare-Bold.ttf');
        }
        @font-face {font-family: 'Square';
            src: url('./assets/fonts/EuclidSquare-Regular.ttf');
        }
        @font-face {font-family: 'Square-Medium';
            src: url('./assets/fonts/EuclidSquare-Medium.ttf');
        }
        @font-face {font-family: 'Square-Light';
            src: url('./assets/fonts/EuclidSquare-Light.ttf');
        }
        @font-face {font-family: 'Square-Italic';
            src: url('./assets/fonts/EuclidSquare-Italic.ttf');
        }
        @font-face {font-family: 'Square-Italic-Light';
            src: url('./assets/fonts/EuclidSquare-LightItalic.ttf');
        }
        background: ${({ theme }) => theme.background};
        background-color: ${({ theme }) => theme.backgroundColor};
        color: ${({ theme }) => theme.color};
        height: 100%;
        width: 100%;
        transition: all 0.27s linear;
        position: fixed;
        font-size: 16px;
        a {
            text-decoration: none;
        }
    }
    .dapp-sidebar {
        background-color: ${({ theme }) => theme.cardBg};
        svg {
            filter: ${({ theme }) => theme.iconColor};
        }
    }
    .branding-header-icon, 
    .olympus-sushi img,
    .olympus-sushi svg,
    .social-icon-small,
    .dapp-menu-external-links svg {
        filter: ${({ theme }) => theme.iconColor} !important;
    }
    .button-dapp-menu,
    .dapp-menu-top a h3,
    .ohm-card .card-header h5,
    .stake-table tbody,
    .olympus-sushi h3,
    .olympus-sushi a, 
    #dapp p {
        color: ${({ theme }) => theme.color} !important;
        font-family: Square !important;
    }
    .ohm-dashboard-card,
    .ohm-card .card-content {
        background-color: ${({ theme }) => theme.cardBg};
        h2 { 
            color: ${({ theme }) => theme.color};
        }
    }
    .top-bar-button {
        background: ${({ theme }) => theme.TopBarButtonBg} !important;
        color: ${({ theme }) => theme.TopBarButtonColor} !important;
            &:hover {
                background: ${({ theme }) => theme.TopBarButtonBgHover} !important;
                color: ${({ theme }) => theme.TopBarButtonColorHover} !important;
            }
    }
     .top-bar-button a {
         color: ${({ theme }) => theme.TopBarButtonColor} !important;
     }
    .stake-button {
        background: ${({ theme }) => theme.CTAButtonBg};
        color: ${({ theme }) => theme.CTAButtonColor} !important;
        border: ${({ theme }) => theme.CTAButtonBorder};
        ${({ theme }) => theme.CTAButtonBorderColor && "border-color: " + theme.CTAButtonBorderColor + " !important; "};
            &:hover {
                background: ${({ theme }) => theme.CTAButtonBgHover};
                color: ${({ theme }) => theme.CTAButtonColorHover} !important;
                border: ${({ theme }) => theme.CTAButtonBorderHover};
            }
    }
    .stake-lp-button {
        background: ${({ theme }) => theme.CTALpButtonBg};
        color: ${({ theme }) => theme.CTALpButtonColor} !important;
        border: ${({ theme }) => theme.CTALpButtonBorder};
        ${({ theme }) =>
          theme.CTALpButtonBorderColor && "border-color: " + theme.CTALpButtonBorderColor + " !important; "};
            &:hover {
                background: ${({ theme }) => theme.CTALpButtonBgHover};
                color: ${({ theme }) => theme.CTALpButtonColorHover} !important;
                border: ${({ theme }) => theme.CTALpButtonBorderHover};
            }
    }
    .ohm-input-group {
        border-color: ${({ theme }) => theme.color} !important;
    }
    .ohm-input-group button,
    .input-group.ohm-input-group {
        input, button {
            color: ${({ theme }) => theme.color} !important;
            &::placeholder {
                color: ${({ theme }) => theme.color} !important;
                opacity: 1; /* Firefox */
            }    
        }
    }
    .stake-toggle-row {
        .btn-group button.btn {
            &:hover {
                color: ${({ theme }) => theme.color} !important;
            }
        }
    }
    
    .btn-light {
        border-bottom: 2px solid ${({ theme }) => theme.color} !important;
        color: ${({ theme }) => theme.color} !important;
    }
    table .MuiTableCell-root {
        color: ${({ theme }) => theme.color};
    }
`;
