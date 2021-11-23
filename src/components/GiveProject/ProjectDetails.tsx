import { Button, Typography, Grid, Paper } from "@material-ui/core";
import Countdown from "react-countdown";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ClockIcon } from "../../assets/icons/clock.svg";
import { ReactComponent as CheckIcon } from "../../assets/icons/check-circle.svg";
import { useTheme } from "@material-ui/core/styles";

type ProjectDetailsProps = {
  title: string;
  owner: string;
  details: string;
  finishDate?: string;
  completion: number;
  photos: string[];
  category: string;
  wallet: string;
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
  owner,
  details,
  finishDate,
  completion,
  photos,
  category,
  wallet,
}: ProjectDetailsProps) {
  const theme = useTheme();

  // The JSON file returns a string, so we convert it
  const finishDateObject = finishDate ? new Date(finishDate) : null;
  const countdownRenderer = ({ days, hours, completed }: CountdownProps) => {
    if (completed)
      return (
        <>
          <div className="cause-info-icon">
            <SvgIcon component={ClockIcon} color="primary" />
          </div>
          <div>
            <strong>Fundraise Complete!</strong>
          </div>
        </>
      );

    return (
      <>
        <div className="cause-info-icon">
          <SvgIcon component={ClockIcon} color="primary" />
        </div>
        <div>
          <strong>
            {days} days, {hours} hours
          </strong>{" "}
          remaining
        </div>
      </>
    );
  };

  const getGoalCompletion = (): JSX.Element => {
    return (
      <>
        <div className="cause-info-icon">
          <SvgIcon component={CheckIcon} color="primary" />
        </div>
        <div>
          <strong>{completion}%</strong> <span>of goal</span>
        </div>
      </>
    );
  };

  const getProjectImage = (): JSX.Element => {
    // We return an empty image with a set width, so that the spacing remains the same.
    if (!photos || photos.length < 1)
      return (
        <div className="cause-image">
          <img width="100%" src="" />
        </div>
      );

    return (
      <div className="cause-image">
        <img width="100%" src={`${process.env.PUBLIC_URL}${photos[0]}`} />
      </div>
    );
  };

  return (
    <>
      <Paper>
        <Grid item className="cause-card" key={title}>
          {getProjectImage()}
          <div className="cause-content">
            <Grid container justifyContent="space-between">
              <Grid item className="cause-title">
                <Typography variant="h6">{title}</Typography>
              </Grid>
              <Grid item className="cause-category" style={{ backgroundColor: theme.palette.background.default }}>
                {category}
              </Grid>
            </Grid>
            <Typography variant="body1" style={{ fontSize: 12 }}>
              {owner}
            </Typography>
            <div className="cause-body">
              <Typography variant="body2">{details}</Typography>
            </div>
            <Grid container direction="column" className="cause-misc-info">
              <Grid item xs={3}>
                {finishDateObject ? <Countdown date={finishDateObject} renderer={countdownRenderer} /> : <></>}
              </Grid>
              <Grid item xs={3}>
                {getGoalCompletion()}
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="primary" className="cause-give-button">
                  Give Yield
                </Button>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Paper>
    </>
  );
}
