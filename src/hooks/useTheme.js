import { useEffect, useState } from "react";

const useTheme = e => {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  const setMode = mode => {
    window.localStorage.setItem("theme", mode);
    setTheme(mode);
    console.log("theme set: ", mode);
  };

  const toggleTheme = e => {
    console.log("toggleTheme triggered", e);
    if (e.metaKey) {
      console.log("metakey detected", e.metaKey);
      setMode("girth");
    } else {
      if (theme === "light") {
        setMode("dark");
      } else {
        setMode("light");
      }
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches && !localTheme
      ? setMode("dark")
      : localTheme
      ? setTheme(localTheme)
      : setMode("light");
    setMounted(true);
  }, []);

  return [theme, toggleTheme, mounted];
};

export default useTheme;
