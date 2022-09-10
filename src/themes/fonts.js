import NHaasGroteskRegular from "src/assets/fonts/NHaasGroteskDSPro-55Rg.woff2";
import NHassGroteskMedium from "src/assets/fonts/NHaasGroteskDSPro-65Md.woff2";
import NHaasGroteskSemibold from "src/assets/fonts/NHaasGroteskDSPro-75Bd.woff2";

const NHassGrotesk = `
@font-face {
  font-family: "NHassGrotesk";
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: local('NHassGrotesk'), local('NHassGrotesk-55Rg'), url(${NHaasGroteskRegular}) format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
}
@font-face {
  font-family: "NHassGrotesk";
  font-style: normal;
  font-display: swap;
  font-weight: 450;
  src: local('NHassGrotesk'), local('NHassGrotesk-55Rg'), url(${NHaasGroteskRegular}) format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
}

@font-face {
  font-family: "NHassGrotesk";
  font-style: normal;
  font-display: swap;
  font-weight: 300;
  src: local('NHassGrotesk'), local('NHassGrotesk-55Rg'), url(${NHaasGroteskRegular}) format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
}

@font-face {
  font-family: "NHassGrotesk";
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: local('NHassGrotesk'), local('NHassGrotesk-65Md'), url(${NHassGroteskMedium}) format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
}

@font-face {
  font-family: "NHassGrotesk";
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: local('NHassGrotesk'), local('NHassGrotesk-55Rg'), url(${NHassGroteskMedium}) format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
}

@font-face {
  font-family: "NHassGrotesk";
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: local('NHassGrotesk-75Bd'), url(${NHaasGroteskSemibold}) format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
}

@font-face {
  font-family: "NHassGrotesk";
  font-style: italic;
  font-display: swap;
  font-weight: 400;
  src: local('NHassGrotesk-Italic'), url(${NHaasGroteskRegular}) format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
}
`;
export default NHassGrotesk;
