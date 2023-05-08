import { useState } from "react";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { GraphProps } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { OhmSupplyGraph } from "src/views/TreasuryDashboard/components/Graph/OhmSupplyGraph";
import { OhmSupplyTable } from "src/views/TreasuryDashboard/components/Graph/OhmSupplyTable";

/**
 * Displays the OHM Supply chart and table together.
 *
 * The table will update according to the focus in the chart.
 */
export const OhmSupply = ({ earliestDate, subgraphDaysOffset }: GraphProps) => {
  // State variable for the selected index in the chart
  const [selectedIndex, setSelectedIndex] = useState(0);

  /**
   * Uses mouse movement events in the chart to record the
   * current index that the user is hovering over. This is then passed to
   * the table in order to have the contents reflect the current
   * index (date).
   *
   * @param nextState
   * @param event
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onMouseMove: CategoricalChartFunc = (nextState, event) => {
    // We need to explictly check for undefined, otherwise an index of 0 will be caught (OlympusDAO/olympus-frontend#2128)
    if (nextState.activeTooltipIndex === undefined) return;

    setSelectedIndex(nextState.activeTooltipIndex);
  };

  return (
    <>
      <OhmSupplyGraph onMouseMove={onMouseMove} earliestDate={earliestDate} subgraphDaysOffset={subgraphDaysOffset} />
      <OhmSupplyTable
        earliestDate={earliestDate}
        selectedIndex={selectedIndex}
        subgraphDaysOffset={subgraphDaysOffset}
      />
    </>
  );
};
