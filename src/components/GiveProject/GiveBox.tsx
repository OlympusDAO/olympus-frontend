import { Box } from "@mui/material";

interface GiveBoxProps {
  children: React.ReactNode;
  overrideClass?: string;
  borderColor?: string;
}

/**
 * Standard Box with border and padding, used by the Give project.
 *
 * @param
 * @returns
 */
export function GiveBox(props: GiveBoxProps) {
  return (
    <Box
      border={1}
      className={`grey-box ${props?.overrideClass || ""}`}
      borderColor={props.borderColor || "#999999"}
      borderRadius="10px"
      padding="20px"
    >
      {props.children}
    </Box>
  );
}

export function TopBottomGiveBox(props: GiveBoxProps) {
  return (
    <Box
      borderTop={1}
      borderBottom={1}
      // Setting the borderColor prop results in the bottom border having a different colour. This is a workaround.
      style={{ borderBottomColor: props.borderColor || "#999999", borderTopColor: props.borderColor || "#999999" }}
      padding="30px"
    >
      {props.children}
    </Box>
  );
}
