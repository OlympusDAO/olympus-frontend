import ReactGA from "react-ga4";

// Pushing data to google analytics
export function ua(data) {
  const stringifiedData = JSON.stringify(data);
  ReactGA.event({
    category: data.txType,
    action: stringifiedData,
  });
}
