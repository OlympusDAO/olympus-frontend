import { Button, Typography, Grid, Paper } from "@material-ui/core";
import Countdown from "react-countdown";

type ProjectDetailsProps = {
  title: string;
  details: string;
  finishDate: string;
  completion: number;
  photos: [string];
  category: string;
};

type CountdownProps = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  completed: boolean;
};

export default function ProjectDetails({
  title,
  details,
  finishDate,
  completion,
  photos,
  category,
}: ProjectDetailsProps) {
  // The JSON file returns a string, so we convert it
  const finishDateObject = new Date(finishDate);
  const countdownRenderer = ({ days, hours }: CountdownProps) => (
    <div>
      {days} days, {hours} hours left
    </div>
  );

  return (
    <>
      <Paper>
        <Grid item className="cause-card">
          {photos && photos.length >= 1 ? (
            <div className="cause-image">
              <img width="100%" src={`${process.env.PUBLIC_URL}${photos[0]}`} />
            </div>
          ) : (
            <></>
          )}
          <div className="cause-content">
            <div className="cause-title">
              <Typography variant="h6">{title}</Typography>
            </div>
            <div className="cause-body">
              <Typography variant="body2">{details}</Typography>
            </div>
            <div className="cause-misc-info">
              <Countdown date={finishDateObject} renderer={countdownRenderer} />
              <Typography variant="body2">{completion}% complete</Typography>
              <Button variant="outlined" color="secondary">
                Give
              </Button>
            </div>
          </div>
        </Grid>
      </Paper>
    </>
  );
}
