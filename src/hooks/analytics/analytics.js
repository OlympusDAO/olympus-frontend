import ReactGA from "react-ga4";
const TRACKING_ID = "G-TKEFGWGLPM";

const init = () => {
  ReactGA.initialize(TRACKING_ID);
};

const sendPageView = path => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export default {
  init,
  sendPageView,
};
