import React from "react";
import ReactGA from "react-ga4";

// Pushing data to google analytics
export function ua(data) {
  const stringifiedData = JSON.stringify(data);
  console.log(stringifiedData);
  ReactGA.event({
    category: stringifiedData,
    action: data.txType,
  });
}
