import { Button, Typography, Grid, Paper } from "@material-ui/core";

type ProjectDetailsProps = {
  title: string;
  details: string;
  finishDate: Date;
  completion: number;
  photos: [string];
  category: string;
};

export default function ProjectDetails({
  title,
  details,
  finishDate,
  completion,
  photos,
  category,
}: ProjectDetailsProps) {
  // TODO finish date counter

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
              <Typography variant="body2">Finish Date: {finishDate.toLocaleString()}</Typography>
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
