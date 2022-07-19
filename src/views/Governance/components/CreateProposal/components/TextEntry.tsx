import { Grid, OutlinedInput, Typography } from "@mui/material";

type TextEntryProps = {
  inputTitle: string;
  gridSize: number;
  handleChange: (value: string) => void;
  secondaryTitle?: string;
  placeholder?: string;
};

export const TextEntry = ({ inputTitle, gridSize, handleChange, secondaryTitle, placeholder }: TextEntryProps) => {
  return (
    <Grid className="create-proposal-entry" direction="column" xs={gridSize}>
      <Grid className="entry-title" container direction="row">
        <Grid item>
          <Typography variant="body2">{inputTitle}</Typography>
        </Grid>
        {secondaryTitle ? (
          <Grid item>
            <Typography variant="body2">{secondaryTitle}</Typography>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
      <Grid item>
        <OutlinedInput
          className="input-box"
          placeholder={placeholder}
          onChange={(e: any) => handleChange(e.target.value)}
        />
      </Grid>
    </Grid>
  );
};
