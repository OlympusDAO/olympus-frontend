import { Avatar, Box, SvgIconProps } from "@mui/material";
import { FC } from "react";
import Token, { OHMTokenProps } from "src/components/library/Token/Token";

export interface OHMTokenStackProps extends SvgIconProps {
  tokens?: OHMTokenProps["name"][];
  style?: SvgIconProps["style"];
  /*Specify images to stack */
  images?: string[];
  network?: OHMTokenProps["name"];
}

const TokenStack: FC<OHMTokenStackProps> = ({ tokens, style, images, network, ...props }) => {
  const imageStyles = {
    height: "27px",
    width: "27px",
    ...style,
  };
  return (
    <Box display="flex" flexDirection="row" marginTop={network ? "3px" : "0px"} marginLeft={network ? "3px" : "0px"}>
      {network && (
        <Token
          {...props}
          name={network}
          style={{ zIndex: 3, position: "fixed", marginLeft: "-3px", marginTop: "-3px", fontSize: "16px" }}
        />
      )}
      {images?.map((image, i) => (
        <Avatar
          src={image}
          style={{
            ...(i !== 0 ? { marginLeft: -7, zIndex: 1, ...imageStyles } : { zIndex: 1, ...imageStyles }),
          }}
        />
      ))}
      {tokens?.map((token, i) => (
        <Token
          {...props}
          key={i}
          name={token}
          style={{
            ...(i !== 0 ? { marginLeft: -12, zIndex: 1, ...style } : { zIndex: 2, ...style }),
          }}
        />
      ))}
    </Box>
  );
};

export default TokenStack;
