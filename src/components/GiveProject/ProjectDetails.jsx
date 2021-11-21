import React from "react";
import { Button, Typography, Grid } from "@material-ui/core";

export default function ProjectDetails({ logo, title, details, remainingTime, completion }) {
  return (
    <>
      <Grid item xs={12} className="cause-card">
        <div className="cause-image">{logo}</div>
        <div className="cause-content">
          <div className="cause-title">
            <Typography variant="h6">{title}</Typography>
          </div>
          <div className="cause-body">
            <Typography variant="body2">{details}</Typography>
          </div>
          <div className="cause-misc-info">
            <Typography variant="body2">Time remaining: {remainingTime}</Typography>
            <Typography variant="body2">{completion}% complete</Typography>
            <Button variant="outlined" color="secondary">
              Give
            </Button>
          </div>
        </div>
      </Grid>
    </>
  );
}
