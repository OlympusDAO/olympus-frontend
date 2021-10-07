import { retrieveUTMQueryParameters } from "./QueryParameterHelper";

export function segmentUA(data) {
  var analytics = (window.analytics = window.analytics);
  var queryParameters = retrieveUTMQueryParameters();
  console.log(queryParameters);
  var combinedData = Object.assign({}, data, queryParameters);
  console.log(combinedData);
  try {
    analytics.track(
      data.type,
      {
        combinedData,
      },
      { context: { ip: "0.0.0.0" } },
    );
  } catch (e) {
    console.log("segmentAnalytics", e);
  }
}
