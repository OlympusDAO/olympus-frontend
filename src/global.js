import { createMuiTheme } from "@material-ui/core";
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    .app, #dapp {
        font-family: 'Square';
        background: ${({ theme }) => theme.background};
        background-color: ${({ theme }) => theme.backgroundColor};
        background-blend-mode: screen;
        color: ${({ theme }) => theme.color};
        height: 100%;
        width: 100%;
        transition: all 0.27s linear;
        position: fixed;
        font-size: 16px;
        overflow-y: auto;
        a {
            text-decoration: none;
        }
    }
    .MuiContainer-root {
        height: 100%;
    }
    .dapp-sidebar {
        background-color: ${({ theme }) => theme.cardBg};
        svg {
            filter: ${({ theme }) => theme.iconColor};
        }
        ${({ theme }) => theme.sidebarBorder && "border-right: 1px solid " + theme.sidebarBorder}
        #navbarNav.dapp-nav a.active {
            box-sizing: border-box !important;
            span {
                color: ${({ theme }) => theme.activeLinkColor} !important;
            }
            svg {
                ${({ theme }) => theme.activeLinkSvgColor && "filter: " + theme.activeLinkSvgColor + " !important; "}
            }
        }
    }

    h2.content,
    h3.content {
        color:  ${({ theme }) => theme.largeTextColor} !important;
    }

    .stake-wallet-notification {
        border: 1px solid ${({ theme }) => theme.largeTextColor};
    }
    .mobile .dapp-sidebar {
        background-color: ${({ theme }) => theme.modalBg};
    }
    .branding-header-icon, 
    .olympus-sushi img,
    .olympus-sushi svg,
    .social-icon-small,
    .dapp-menu-external-links svg {
        filter: ${({ theme }) => theme.iconColor};
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
    .ohm-card {
        background-color: ${({ theme }) => theme.cardBg};
        h2 { 
            color: ${({ theme }) => theme.color};
        }
    }
    .ohm-card.ohm-modal {
        background-color: ${({ theme }) => theme.modalBg} !important;
        overflow-y: scroll;
    }
    .ohm-card,
    .ohm-dashboard-card {
        opacity: 0.92 !important;
        -moz-opacity: 0.92 !important;
        border: ${({ theme }) => theme.cardBorder} !important;
    }
    .top-bar-button {
        background: ${({ theme }) => theme.TopBarButtonBg} !important;
        color: ${({ theme }) => theme.TopBarButtonColor} !important;
            &:hover {
                background: ${({ theme }) => theme.TopBarButtonBgHover} !important;
                color: ${({ theme }) => theme.TopBarButtonColorHover} !important;
            }
        border: ${({ theme }) => theme.TopBarButtonBorder} !important;
        backdrop-filter: blur(8px) !important;
    }
     .top-bar-button a {
         color: ${({ theme }) => theme.TopBarButtonColor} !important;
     }
    .stake-button {
        background: ${({ theme }) => theme.CTAButtonBg} !important;
        color: ${({ theme }) => theme.CTAButtonColor} !important;
        border: ${({ theme }) => theme.CTAButtonBorder};
        ${({ theme }) => theme.CTAButtonBorderColor && "border-color: " + theme.CTAButtonBorderColor + " !important; "};
            &:hover {
                background: ${({ theme }) => theme.CTAButtonBgHover} !important;
                color: ${({ theme }) => theme.CTAButtonColorHover} !important;
                border: ${({ theme }) => theme.CTAButtonBorderHover} !important;
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
                -moz-opacity: 1; /* Firefox */
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
    .dapp-nav a {
        border-bottom: 2px solid transparent;
    }
    .dapp-nav a:hover {
        > span {
            border-bottom: 2px solid ${({ theme }) => theme.color};
        }
        &.active span {
            border-bottom: 2px solid ${({ theme }) => theme.activeLinkColor};
        }
      }
    .dapp-nav a:hover, .dapp-menu-external-links a:hover {
        > span {
            color: ${({ theme }) => theme.color} !important;
            border-bottom: 2px solid ${({ theme }) => theme.color};
        }
    }
    .navbar-light .navbar-toggler {
        border: 0px solid ${({ theme }) => theme.color} !important;
        border-color: ${({ theme }) => theme.color} !important;
    }
    .navbar-light .navbar-toggler-icon {
        filter: ${({ theme }) => theme.logoColor}; 
    }
    nav.navbar-expand-lg {
        position: fixed;
    }
    .ohm-logo-bg {
        border: 1px solid ${({ theme }) => theme.color};
    }
    td.MuiTableCell-root.MuiTableCell-body {
        color: ${({ theme }) => theme.color} !important;
    }
    td.MuiTableCell-root.MuiTableCell-body {
        .ohm-pair .ohm-logo-bg {
            padding: 0.3em !important;
        }
    }

    td .ohm-logo-bg {
        padding: .3em;
        height: 40px;
        width: 40px;
    }
    .olympus-logo {
        filter: invert(${({ theme }) => theme.filter});
        -webkit-filter: invert(${({ theme }) => theme.filter});
    }

    a.close-nav {
        svg {
            color: ${({ theme }) => theme.color} !important;
        }
    }
    
    #bond-view .bond-price-data-row .bond-price-data h4.price, #bond-view .bond-price-data-row .bond-price-data h4.price {
        color: ${({ theme }) => theme.largeTextColor} !important;
    }
    
`;


export const globalTheme = createMuiTheme({
    overrides: {
        MuiTypography: {
            root: {
                fontFamily: 'Square'
            }
        },
        MuiButton: {
            root: {
                borderRadius: '5px'
            }
        },
        MuiPaper: {
            root: {
                borderRadius: '5px'
            }
        }
    }
})