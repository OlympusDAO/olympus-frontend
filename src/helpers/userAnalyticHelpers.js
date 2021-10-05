import { EnvHelper } from "./Environment";
import { retrieveUTMQueryParameters } from "./QueryParameterHelper";

// Obtain country from IP address
function countryLookup() {
  // Determine the country the user is from, based on IP
  // Geoapify offers 3000 lookups/day, so we should be fine
  var apiKey = EnvHelper.getGeoapifyAPIKey();

  fetch("https://api.geoapify.com/v1/ipinfo?apiKey=" + apiKey, {
    method: "GET",
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw "Unable to determine country from IP lookup: " + response.body;
      }
    })
    .then(function (json) {
      return json.country.name;
    })
    .catch(function (error) {
      console.log(error);
      // Set the country to a default value
      return "Unknown";
    });
}

// Pushing data to segment analytics
export function segmentUA(data) {
  const stringifiedData = JSON.stringify(data);
  var analytics = (window.analytics = window.analytics);

  // We don't record the IP for privacy reasons, so we capture the country instead
  var country = countryLookup();
  data.country = country;

  // Ensure that any UTM query parameters are sent along to Segment
  // var queryParameters = retrieveUTMQueryParameters();
  // var combinedData = Object.assign({}, data, queryParameters);
  var combinedData = stringifiedData;

  // NOTE (appleseed): the analytics object may not exist (if there is no SEGMENT_API_KEY)
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
