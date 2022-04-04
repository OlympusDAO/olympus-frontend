import { useMediaQuery } from "@material-ui/core";

export const useScreenSize = (size: "sm") => {
  const breakpoint = size === "sm" ? "(max-width: 733px)" : "";

  return useMediaQuery(breakpoint);
};
