import { useEffect } from "react";

const useEscape = (onEscape: () => void) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      console.log(event.keyCode);
      if (event.keyCode === 27) onEscape();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);
};

export default useEscape;
