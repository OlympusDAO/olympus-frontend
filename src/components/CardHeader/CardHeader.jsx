import { Box, Typography } from "@material-ui/core";
// import "./cardheader.scss";

// (aphex) removed children arg in favor of spread to silence compiler while refactoring parents
const CardHeader = ({ title, ...props }) => {
  return (
    <Box className={`card-header`}>
      <Typography variant="h5">{title}</Typography>
      {props.children}
    </Box>
  );
};

export default CardHeader;
