// Obtain country from IP address
export function countryLookup() {
  // Determine the country the user is from, based on IP
  // Geoapify offers 3000 lookups/day, so we should be fine
  var apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw "Missing REACT_APP_GEOAPIFY_API_KEY environment variable";
  }

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

  // NOTE (appleseed): the analytics object may not exist (if there is no SEGMENT_API_KEY)
  if (analytics) {
    analytics.track(
      data.type,
      {
        data,
      },
      { context: { ip: "0.0.0.0" } },
    );
  }
}
