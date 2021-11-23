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

  const { projects } = data;

  const renderProjects = useMemo(() => {
    return projects.map(project => {
      const { title, details, finishDate, photos, category, wallet } = project;
      return (
        <ProjectDetails
          title={title}
          details={details}
          finishDate={finishDate}
          completion={50}
          photos={photos}
          category={category}
          wallet={wallet}
        />
      );
    });
  }, [projects]);

  return (
    <>
      <div className="give-view">
        <Zoom in={true}>
          <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
            <div className="card-header">
              <div className="give-yield-title">
                <Typography variant="h5">Causes Dashboard</Typography>
              </div>
            </div>
            <div className="causes-body">
              <Grid container className="data-grid">
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
