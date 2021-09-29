// Pushing data to segment analytics
export function segmentUA(data) {
  const stringifiedData = JSON.stringify(data);
  var analytics = (window.analytics = window.analytics);
  // NOTE (appleseed): the analytics object may not exist (if there is no SEGMENT_API_KEY)
  if (analytics) {
    analytics.track(data.type, {
      data,
    });
  }
}
