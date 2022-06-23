import ReactGA from "react-ga";
import GA4 from "react-ga4";

import { Environment } from "../environment/Environment/Environment";

const GA_API_KEY = Environment.getGoogleAnalyticsApiKey();
const GA4_API_KEY = Environment.getGA4ApiKey();

type Category = "App" | "OlyZaps" | "Staking" | "Olympus Give" | "Bonds" | "Migration" | "Wrapping";

interface TrackGAEventOptions extends ReactGA.EventArgs {
  category: Category;
}

export const trackGAEvent = (event: TrackGAEventOptions) => {
  try {
    // Universal GA (using react-ga)
    if (GA_API_KEY && ReactGA) {
      ReactGA.event(event);
    }
  } catch (error) {
    console.error("trackGAEvent", error);
  }
};

//used for event tracking in Google Analytics 4
export const trackGtagEvent = (name: string, params: any) => {
  if (!name || !params) {
    return;
  }

  try {
    if (GA4_API_KEY && ReactGA) {
      GA4.gtag("event", name, {
        ...params,
        send_to: GA4_API_KEY,
      });
    }
  } catch (error) {
    console.error("trackGtagEvent", error);
  }
};
