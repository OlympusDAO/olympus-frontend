import { EnvHelper } from "./Environment";
import { retrieveUTMQueryParameters } from "./QueryParameterHelper";

/**
 * Obtain country from IP address
 * @returns the country name or an empty string
 */
async function countryLookup() {
  return new Promise(async (resolve, reject) => {
    const apiKey = EnvHelper.getGeoapifyAPIKey();
    if (!apiKey) return "";
    const response = await fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${apiKey}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Unable to determine country from IP lookup: " + response.body);
      return resolve("Undefined");
    }
    console.log(response);
    const json = await response.json();
    resolve(json.country.name);
  });
}

// Pushing data to segment analytics
export async function segmentUA(data) {
  let analytics = (window.analytics = window.analytics);
  const country = await countryLookup();
  data.country = country;
  const queryParameters = retrieveUTMQueryParameters();
  const combinedData = Object.assign({}, data, queryParameters);

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
