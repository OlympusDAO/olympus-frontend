declare module "*.jpg";
declare module "*.png";
declare module "*.svg";

export default global;

declare module "@mui/material/styles" {
  interface ThemeOptions {
    colors: {
      paper: {
        background: React.CSSProperties["background"];
        card: React.CSSProperties["color"];
        cardHover: React.CSSProperties["color"];
      };
      feedback: {
        success: React.CSSProperties["color"];
        userFeedback: React.CSSProperties["color"];
        error: React.CSSProperties["color"];
        warning: React.CSSProperties["color"];
        pnlGain: React.CSSProperties["color"];
      };
      gray: {
        700: React.CSSProperties["color"];
        600: React.CSSProperties["color"];
        500: React.CSSProperties["color"];
        90: React.CSSProperties["color"];
        40: React.CSSProperties["color"];
        10: React.CSSProperties["color"];
      };
      primary: {
        300: React.CSSProperties["color"];
        100: React.CSSProperties["color"];
      };
      special: {
        olyZaps: React.CSSProperties["color"];
      };
    };
    special: any;
  }
  interface Theme {
    colors: {
      paper: {
        background: React.CSSProperties["background"];
        card: React.CSSProperties["color"];
        cardHover: React.CSSProperties["color"];
      };
      feedback: {
        success: React.CSSProperties["color"];
        userFeedback: React.CSSProperties["color"];
        error: React.CSSProperties["color"];
        warning: React.CSSProperties["color"];
        pnlGain: React.CSSProperties["color"];
      };
      gray: {
        700: React.CSSProperties["color"];
        600: React.CSSProperties["color"];
        500: React.CSSProperties["color"];
        90: React.CSSProperties["color"];
        40: React.CSSProperties["color"];
        10: React.CSSProperties["color"];
      };
      primary: {
        300: React.CSSProperties["color"];
        100: React.CSSProperties["color"];
      };
      special: {
        olyZaps: React.CSSProperties["color"];
      };
    };
  }
}
