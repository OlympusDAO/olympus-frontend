import ReactGA from "react-ga";

import { Environment } from "../environment/Environment/Environment";

const GA_API_KEY = Environment.getGoogleAnalyticsApiKey();

export const trackGAEvent = (event: ReactGA.EventArgs) => {
  try {
    // Universal GA (using react-ga)
    if (GA_API_KEY && ReactGA) {
      ReactGA.event(event);
    }
  } catch (error) {
    console.error("trackGAEvent", error);
  }
};
