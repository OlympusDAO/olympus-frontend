import "./BackButton.scss";

import { ChevronLeft } from "@mui/icons-material";
import { Grid, Link } from "@mui/material";
import { TextButton } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";

export const BackButton = () => {
  return (
    <Grid className="back-button" item>
      <Link to="/governancetest" component={RouterLink}>
        <ChevronLeft viewBox="6 6 12 12" style={{ width: "12px", height: "12px" }} />
        <TextButton>Back</TextButton>
      </Link>
    </Grid>
  );
};
