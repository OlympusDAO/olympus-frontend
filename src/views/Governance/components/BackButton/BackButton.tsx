import { ChevronLeft } from "@mui/icons-material";
import { Box, Grid, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const BackButton = () => {
  return (
    <Grid className="back-button" item>
      <Link to="/governance" component={RouterLink}>
        <Box display="flex" flexDirection="row">
          <Box pr="9px">
            <ChevronLeft viewBox="6 6 12 12" style={{ width: "12px", height: "12px" }} />
          </Box>
          <Typography fontSize="15px" fontWeight={500}>
            Back
          </Typography>
        </Box>
      </Link>
    </Grid>
  );
};
