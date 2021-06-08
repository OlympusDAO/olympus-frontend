import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    .app, #dapp {
        background: ${({theme}) => theme.background};
        background-color: ${({theme}) => theme.backgroundColor};
        color: ${({theme}) => theme.color};
        height: 100vh;
        transition: all 0.27s linear;
        position: fixed;
        
    }
    .ohm-dashboard-card,
    .ohm-card .card-content {
        background-color: ${({theme}) => theme.cardBg};
        h2 { 
            color: ${({theme}) => theme.color};
        }
    }
    #dapp p {
        color: ${({theme}) => theme.color};
    }
`;