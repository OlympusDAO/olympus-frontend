import { Box, Slider, Tooltip, Typography } from "@mui/material";
import { SvgIcon } from "@mui/material";

interface LoanToValueSliderProps {
  ltvPercentage: number;
  onLtvChange: (value: number) => void;
  isRepayMode?: boolean;
}

export const LoanToValueSlider = ({ ltvPercentage, onLtvChange, isRepayMode }: LoanToValueSliderProps) => {
  return (
    <Box mt="18px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={0.5}>
          {isRepayMode ? "Collateral to Withdraw" : "Loan to Collateral"}
          <Tooltip
            title={
              isRepayMode
                ? "Adjust how much collateral to withdraw. The maximum amount is limited by your remaining debt."
                : "The ratio of your borrowed amount to your collateral value. A higher ratio means you're borrowing more against your collateral."
            }
            arrow
          >
            <SvgIcon sx={{ fontSize: 16, cursor: "help" }} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </SvgIcon>
          </Tooltip>
        </Box>
        <Typography>{ltvPercentage.toFixed(2)}%</Typography>
      </Box>
      <Box mt="9px">
        <Slider
          value={ltvPercentage}
          onChange={(_, value) => onLtvChange(value as number)}
          min={0}
          max={100}
          step={1}
          sx={{
            "& .MuiSlider-thumb": {
              width: "15px",
              height: "15px",
            },
          }}
          valueLabelDisplay="auto"
          valueLabelFormat={value => `${value.toFixed(2)}%`}
        />
      </Box>
    </Box>
  );
};
