// Pushing data to segment analytics
export function segmentUA(data) {
  const analytics = (window.analytics = window.analytics);

  // NOTE: we used to lookup the country via an API, but found it didn't make sense to pay for that.
  // Instead, we now have a materialised view in the data warehouse that will periodically match the
  // IP address to a country.

  // NOTE (appleseed): the analytics object may not exist (if there is no SEGMENT_API_KEY)
  // Passing in combined data directly so as not to have a nested object
  try {
    analytics.track(data.type, data);
  } catch (e) {
    console.error("Encountered error when trying to record analytics event to Segment:", e);
  }
}
