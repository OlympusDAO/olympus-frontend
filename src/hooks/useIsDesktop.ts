import { useState, useEffect } from "react";

const isBrowser = (): boolean => typeof window !== undefined;

export function useIsDesktop(): boolean {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 740);

  const updateMedia = () => {
    setDesktop(isBrowser() && window.innerWidth > 740);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return isDesktop;
}
