import { useCallback, useMemo, useState } from "react";
import "./give.scss";
import { Button, Paper, Typography, Zoom, Grid } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ProjectDetails from "src/components/GiveProject/ProjectDetails";
import data from "./mock_projects.json";

export default function CausesDashboard() {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [zoomed, setZoomed] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const [test, setTest] = useState(0);

  const { projects } = data;

  const renderProjects = useMemo(() => {
    return projects.map(project => {
      const { id, logo, title, details, remainingTime, completion } = project;
      return (
        <ProjectDetails
          key={id}
          logo={logo}
          title={title}
          details={details}
          remainingTime={remainingTime}
          completion={completion}
        />
      );
    });
  }, [projects]);

  return (
    <>
      <div className="give-view">
        <div>{test}</div>
        <button onClick={() => setTest(test + 1)}>setTest</button>
        <Zoom in={true}>
          <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
            <div className="card-header">
              <div className="give-yield-title">
                <Typography variant="h5">Causes Dashboard</Typography>
              </div>
            </div>
            <div className="causes-body">
              <Grid container spacing={2} className="data-grid">
                {renderProjects}
              </Grid>
            </div>
            <div className="custom-recipient">
              <Button variant="outlined" color="secondary">
                Custom Recipient
              </Button>
            </div>
          </Paper>
        </Zoom>
      </div>
    </>
  );
}
