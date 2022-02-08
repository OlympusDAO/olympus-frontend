import { Box, LinearProgress, makeStyles, Typography } from "@material-ui/core";

export const ProgressBar = (props: { totalDeposits: number; maxDeposits: number }) => {
  const useStyles = makeStyles(() => ({
    progress: {
      backgroundColor: "#768299",
      borderRadius: "4px",
      marginTop: "3px",
      marginBottom: "3px",
      "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: "#F8CC82",
      },
    },
  }));
  const progressValue = props.totalDeposits && props.maxDeposits ? (props.totalDeposits / props.maxDeposits) * 100 : 0;
  const totalDepositsFormatted = props.totalDeposits && new Intl.NumberFormat("en-US").format(props.totalDeposits);
  const maxDepositsFormatted = props.maxDeposits && new Intl.NumberFormat("en-US").format(props.maxDeposits);
  const classes = useStyles();
  return (
    <>
      <Box display="flex" justifyContent={"center"} mb={"10px"}>
        <Typography>
          {totalDepositsFormatted}/{maxDepositsFormatted} Chickens Deposited
        </Typography>
      </Box>
      <Box style={{ width: "50%", margin: "0 25%" }}>
        <LinearProgress className={classes.progress} variant="determinate" value={progressValue} />
      </Box>
    </>
  );
};
