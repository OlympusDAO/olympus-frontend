import { retrieveUTMQueryParameters } from "./QueryParameterHelper";

// Pushing data to segment analytics
export function segmentUA(data) {
  const stringifiedData = JSON.stringify(data);
  var analytics = (window.analytics = window.analytics);

  // Ensure that any UTM query parameters are sent along to Segment
  var queryParameters = retrieveUTMQueryParameters();
  var combinedData = Object.assign({}, data, queryParameters);

  // NOTE (appleseed): the analytics object may not exist (if there is no SEGMENT_API_KEY)
  if (analytics) {
    analytics.track(
      data.type,
      {
        combinedData,
      },
      { context: { ip: "0.0.0.0" } },
    );
  }
}
