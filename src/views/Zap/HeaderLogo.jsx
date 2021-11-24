import { Avatar, Box, SvgIcon } from "@material-ui/core";

const avatarStyle = { height: "35px", width: "35px", marginInline: "-4px" };
const iconStyle = { height: "35px", width: "35px", marginInline: "-4px", zIndex: 1 };
const viewBox = "0 0 32 32";
export default function HeaderLogo({ images, icons, avatarStyleOverride }) {
  if (images && !images.length) {
    images = [
      "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
    ];
  }
  return (
    <Box display="flex" p={3} flexDirection="row">
      {images?.map(image => (
        <Avatar src={image} style={avatarStyleOverride ?? avatarStyle} />
      ))}

      {icons?.map(icon => (
        <SvgIcon component={icon} viewBox={viewBox} style={iconStyle}></SvgIcon>
      ))}
    </Box>
  );
}
