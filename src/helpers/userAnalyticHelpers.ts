declare const window: CustomWindow;

// Pushing data to segment analytics
export const segmentUA = (data: any) => {
  const analytics = (window.analytics = window.analytics);

  // NOTE (appleseed): the analytics object may not exist (if there is no SEGMENT_API_KEY)
  // Passing in combined data directly so as not to have a nested object
  try {
    analytics.track(data.type, data, { context: { ip: "0.0.0.0" } });
  } catch (e) {
    console.log("segmentAnalytics", e);
  }
};
