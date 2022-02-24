import "../TreasuryDashboard/TreasuryDashboard.scss";

import { Container, useMediaQuery } from "@material-ui/core";
// @ts-ignore
import { Dashboard } from "@multifarm/widget";
import React from "react";

const V2TreasuryDashboard: React.FC = React.memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Dashboard />
      </Container>
    </div>
  );
});

export default V2TreasuryDashboard;
