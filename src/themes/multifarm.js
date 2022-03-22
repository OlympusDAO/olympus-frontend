import { extendTheme, olympusDarkTheme, olympusTheme } from "@multifarm/widget";

const multifarmLightTheme = extendTheme(olympusTheme, {
  card: {
    background: {
      primary: "var(--light-paper-bg)",
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
  text: {
    highlight: "#fff",
  },
  table: {
    background: {
      primary: "#1d2026",
    },
  },
  tabs: {
    background: {
      primary: "var(--ohm-gold)",
      secondary: "#1d2026",
    },
    text: {
      primary: "#000",
      secondary: "#fff",
    },
  },
});

export { multifarmLightTheme, multifarmDarkTheme };
