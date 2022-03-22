import { extendTheme, olympusDarkTheme, olympusTheme } from "@multifarm/widget";

const multifarmLightTheme = extendTheme(olympusTheme, {
  card: {
    background: {
      primary: "var(--light-paper-bg)",
    },
  },
  tabs: {
    background: {
      primary: "#F8CC82",
      secondary: "#F0F0F0",
    },
    text: {
      primary: "#181A1D",
      secondary: "#676B74",
    },
  },
  badge: {
    background: {
      primary: "rgba(255, 255, 255, 0.6)",
    },
  },
  form: {
    background: {
      primary: "rgba(255, 255, 255, 0.6)",
    },
    text: {
      primary: "#253449",
    },
  },
});

const multifarmDarkTheme = extendTheme(olympusDarkTheme, {
  card: {
    background: {
      primary: "var(--dark-paper-bg)",
    },
  },
  tabs: {
    background: {
      primary: "#F8CC82",
      secondary: "#1D2026",
    },
    text: {
      primary: "#292C32",
      secondary: "#A3A3A3",
    },
  },
  text: {
    highlight: "#fff",
  },
  table: {
    background: {
      primary: "#1d2026",
    },
  },
});

export { multifarmLightTheme, multifarmDarkTheme };
