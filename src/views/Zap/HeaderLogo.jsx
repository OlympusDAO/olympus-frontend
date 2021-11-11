import { Avatar, Box, SvgIcon } from "@material-ui/core";

const avatarStyle = { height: "35px", width: "35px", marginInline: "-7px" };
const iconStyle = { height: "35px", width: "35px", marginInline: "-7px", zIndex: 1 };
const viewBox = "0 0 32 32";
export default function HeaderLogo({ images, icons }) {
  return (
    <Box display="flex" p={3} flexDirection="row">
      {images?.map(image => (
        <Avatar src={image} style={avatarStyle} />
      ))}

      {icons?.map(icon => (
        <SvgIcon component={icon} viewBox={viewBox} style={iconStyle}></SvgIcon>
      ))}
    </Box>
  );
}
