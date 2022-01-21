import ReactGA from "react-ga";

declare global {
  interface Window {
    analytics: {
      track: any;
    };
  }
}

type SegmentEvent = {
  type: string;
  [key: string]: any;
};

export const trackSegmentEvent = (event: SegmentEvent) => {
  try {
    // Send event to Segment
    if (process.env.REACT_APP_SEGMENT_API_KEY && window.analytics) {
      window.analytics.track(event.type, event, { context: { ip: "0.0.0.0" } });
    }
    // Send event to Google Analytics 4
    // NOTE: We do not send Segment events -> Google Analytics
  } catch (e) {
    console.log("trackSegmentEvent", e);
  }
};

export const trackGAEvent = (event: ReactGA.EventArgs) => {
  try {
    if (process.env.REACT_APP_GA_API_KEY && ReactGA) {
      ReactGA.event(event);
    }
  } catch (e) {
    console.log("trackGAEvent", e);
  }
};
