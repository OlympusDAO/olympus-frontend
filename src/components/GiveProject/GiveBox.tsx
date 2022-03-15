import { Box } from "@material-ui/core";

interface GiveBoxProps {
  children: React.ReactNode;
}

/**
 * Standard Box with border and padding, used by the Give project.
 *
 * @param
 * @returns
 */
export function GiveBox(props: GiveBoxProps) {
  return (
    <Box border={1} borderColor="#999999" borderRadius="10px" padding="20px">
      {props.children}
    </Box>
  );
}
