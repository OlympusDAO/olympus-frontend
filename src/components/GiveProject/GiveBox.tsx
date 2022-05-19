import { Box } from "@mui/material";

interface GiveBoxProps {
  children: React.ReactNode;
  overrideClass?: string;
}

/**
 * Standard Box with border and padding, used by the Give project.
 *
 * @param
 * @returns
 */
export function GiveBox(props: GiveBoxProps) {
  return (
    <Box border={1} className={`grey-box ${props?.overrideClass || ""}`} borderRadius="10px" padding="20px">
      {props.children}
    </Box>
  );
}
