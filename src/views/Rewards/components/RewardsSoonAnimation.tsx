import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Lottie from "lottie-react";
import comingSoonDark from "src/assets/animation/coming-soon-dark.json";
import comingSoonLight from "src/assets/animation/coming-soon-light.json";

export const RewardsSoonAnimation = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <Box>
        <Box sx={{ width: "272px", height: "178px" }}>
          <Lottie animationData={theme.palette.mode === "dark" ? comingSoonDark : comingSoonLight} loop={true} />
        </Box>
        <Typography fontSize="20px" fontWeight={400} sx={{ textAlign: "center" }}>
          Coming Soon
        </Typography>
      </Box>
    </Box>
  );
};
