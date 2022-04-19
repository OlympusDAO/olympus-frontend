import { Trans } from "@lingui/macro";
import { Container, Tab, Tabs } from "@material-ui/core";
import { TabPanel } from "@olympusdao/component-library";
import { ChangeEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import { ContractsDiagram } from "./ContractsDiagram";

const dashboardTabs = [{ pathname: "contracts", label: <Trans>Contracts</Trans> }];

export const TransparencyDashboard: React.FC<{ activeView?: number }> = ({ activeView = 0 }) => {
  const history = useHistory();
  const [view, setView] = useState(activeView);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
    history.push(newView === 0 ? "/transparency" : `/transparency/${dashboardTabs[newView].pathname}`);
  };

  return (
    <Container>
      <Tabs
        value={view}
        variant="standard"
        centered={true}
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="primary"
        onChange={changeView}
        aria-label="dashboard-tabs"
      >
        {dashboardTabs.map(({ pathname, label }, key) => (
          <Tab key={key} aria-label={pathname} label={label} />
        ))}
      </Tabs>
      <Container>
        <TabPanel value={view} index={0}>
          <ContractsDiagram />
        </TabPanel>
      </Container>
    </Container>
  );
};
