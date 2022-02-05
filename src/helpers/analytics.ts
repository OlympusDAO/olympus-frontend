import ReactGA from "react-ga";

import { EnvHelper } from "./Environment";

const SEGMENT_API_KEY = EnvHelper.getSegmentKey();
const GA_API_KEY = EnvHelper.getGaKey();

declare global {
  interface Window {
    analytics: any; // Segment.js
    gtag: any; // Google Tag Manager
  }
}

type SegmentEvent = {
  type: string;
  [key: string]: any;
};

export const trackSegmentEvent = (event: SegmentEvent) => {
  try {
    if (SEGMENT_API_KEY && window.analytics) {
      window.analytics.track(event.type, event, { context: { ip: "0.0.0.0" } });
    }
    // NOTE: We do not send Segment events -> Google Analytics
  } catch (e) {
    console.log("trackSegmentEvent", e);
  }
};

export const trackGAEvent = (event: ReactGA.EventArgs) => {
  try {
    // Universal GA (using react-ga)
    if (GA_API_KEY && ReactGA) {
      ReactGA.event(event);
    }
  } catch (e) {
    console.log("trackGAEvent", e);
  }
};
