import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Metric, MetricCollection, Paper, Tab, Tabs } from "@olympusdao/component-library";
import { Route, Routes } from "react-router-dom";

import RangeChart from "./RangeChart";
import RangeInputForm from "./RangeInputForm";
import RangeModal from "./RangeModal";

const useStyles = makeStyles<Theme>(theme => ({}));

//export interface OHMRangeProps {}

/**
 * Component for Displaying Range
 */
const Range = () => {
  const classes = useStyles();
  return (
    <div id="stake-view">
      <Paper headerText="Range Swap">
        <MetricCollection>
          <Metric label="Current OHM Price" metric="$16.15" />
          <Metric label="Lower Wall" metric="$15.15" />
          <Metric label="Upper Wall" metric="$20.15" />
        </MetricCollection>
        <RangeChart />
        <Tabs centered>
          <Tab label="Buy" />
          <Tab label="Sell" />
        </Tabs>
        <RangeInputForm />
      </Paper>
      <Routes>
        <Route path=":id" element={<RangeModal />} />
      </Routes>
    </div>
  );
};

export default Range;
