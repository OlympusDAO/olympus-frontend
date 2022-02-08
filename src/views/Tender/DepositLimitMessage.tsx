import { Box, Typography } from "@material-ui/core";

export const DepositLimitMessage = () => (
  <Box display="flex" justifyContent="center" mt="10px" mb="10px">
    <Typography variant="h5" color="textSecondary">
      Deposit limit has been reached
    </Typography>
  </Box>
);
