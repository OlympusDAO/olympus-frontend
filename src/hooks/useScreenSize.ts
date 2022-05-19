import { useMediaQuery } from "@mui/material";

export const useScreenSize = (size: "xs" | "sm" | "md" | "lg" | "xl") => {
  const breakpoint =
    size === "xs"
      ? "(max-width: 0px)"
      : size === "sm"
      ? "(max-width: 600px)"
      : size === "md"
      ? "(max-width: 900px)"
      : size === "lg"
      ? "(max-width: 1200px)"
      : size === "xl"
      ? "(max-width: 153600px)"
      : "";

  return useMediaQuery(breakpoint);
};
