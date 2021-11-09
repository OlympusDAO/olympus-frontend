import { Avatar, Box, Button, Fade, Paper, Tab, Tabs, Typography, Zoom } from "@material-ui/core";

const avatarStyle = { height: "35px", width: "35px", marginInline: "-7px" };

export default function HeaderLogo({ images }) {
  return (
    <Box display="flex" p={3} flexDirection="row">
      {images.map(image => (
        <Avatar src={image} style={avatarStyle} />
      ))}
    </Box>
  );
}
