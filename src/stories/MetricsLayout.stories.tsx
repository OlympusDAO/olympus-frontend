import { ComponentMeta } from "@storybook/react";
import React from "react";
import Metric from "src/components/library/Metric";
import MetricCollection from "src/components/library/MetricCollection";
import Paper from "src/components/library/Paper";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Layout/Metrics",
  component: MetricCollection,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof MetricCollection>;

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const MetricsCollection = () => (
  <Paper>
    <MetricCollection>
      <>
        <Metric label="APY" metric="5000%" isLoading={true} />
        <Metric label="APY" metric="5000%" isLoading={true} />
        <Metric label="APY" metric="5000%" isLoading={true} />
        <Metric label="APY" metric="5000%" isLoading={false} />
        <Metric label="APY" metric="5000%" isLoading={false} />
        <Metric label="APY" metric="5000%" isLoading={false} />
      </>
    </MetricCollection>
  </Paper>
);
