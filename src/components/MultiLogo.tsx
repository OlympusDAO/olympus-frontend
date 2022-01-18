import { Avatar, Box, SvgIcon } from "@material-ui/core";
import { ElementType } from "react";

const avatarStyle = { height: "35px", width: "35px", marginInline: "-4px" };
const iconStyle = { height: "35px", width: "35px", marginInline: "-4px", zIndex: 1 };
const viewBox = "0 0 32 32";
const defaultImages = [
  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png",
  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png",
];

export default function MultiLogo({
  images,
  icons,
  avatarStyleOverride,
}: {
  images?: string[];
  icons?: ElementType[];
  avatarStyleOverride?: Record<string, string | number>;
}) {
  if (images && !images.length) {
    images = defaultImages;
  }
  return (
    <Box display="flex" marginBottom={2} flexDirection="row">
      {images?.map(image => (
        <Avatar src={image} style={avatarStyleOverride ?? avatarStyle} />
      ))}

      {icons?.map(icon => (
        <SvgIcon component={icon} viewBox={viewBox} style={iconStyle} />
      ))}
    </Box>
  );
}
