import React from "react";
import ReactGA from "react-ga4";

// Pushing data to google analytics
export function ga(data) {
  const stringifiedData = JSON.stringify(data);
  console.log("stringifiedData", stringifiedData);
  ReactGA.event({
    hitType: "event",
    category: stringifiedData,
    action: data.txType,
  });
}
