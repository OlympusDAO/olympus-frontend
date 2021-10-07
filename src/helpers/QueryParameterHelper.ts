import queryString from "query-string";

const sessionStorageKey = "query";

/**
 * Stores the URL query parameters in session storage as a string.
 *
 * If the query parameters cannot be retrieved or parsed,
 * the session storage will be cleared.
 */
export function storeQueryParameters() {
  // We use session storage as it will be cleared when the tab is closed. The data is not needed any longer than that.
  if (!window.sessionStorage) {
    console.warn("Could not find session storage.");
    return;
  }

  // window.location.search is supposed to be what contains the query parameters
  // however it was not returning anything
  // so we use href instead: https://app.olympusdao.finance/#/stake?utm_campaign=foo
  if (!window.location || !window.location.href) {
    console.warn("Unable to access window.location");
    window.sessionStorage.removeItem(sessionStorageKey);
    return;
  }

  // If we can't fetch the parameters, it's possible that:
  // 1. There were no parameters to begin with
  // 2. There were parameters, but a link was clicked and there parameters are no longer present
  //
  // Either way, we would have already captured any parameters that were present upon initial page load, and they have been saved.
  var hrefParameters = window.location.href.split("?");
  if (!hrefParameters || hrefParameters.length != 2) {
    console.info("Unable to find query parameters");
    return;
  }

  var parsedParameters = queryString.parse(hrefParameters.pop() || "");

  window.sessionStorage.setItem(sessionStorageKey, queryString.stringify(parsedParameters));
  console.debug("Stored query parameters in session storage: " + queryString.stringify(parsedParameters));
}

/**
 * Fetches the query parameters from session storage
 *
 * @returns dictionary containing the query parameters
 */
export function retrieveQueryParameters() {
  if (!window.sessionStorage) {
    console.warn("Could not find session storage.");
    return {};
  }

  var parsedParameters: queryString.ParsedQuery = queryString.parse(
    window.sessionStorage.getItem(sessionStorageKey) || "",
  );
  console.debug("Retrieved query parameters from session storage: " + JSON.stringify(parsedParameters));

  return parsedParameters;
}

export function retrieveUTMQueryParameters() {
  var queryParameters: queryString.ParsedQuery = retrieveQueryParameters();

  // Return only parameters with a "utm_" prefix
  var filteredQueryParameters: queryString.ParsedQuery = {};
  for (let key in queryParameters) {
    if (key.indexOf("utm_") == -1) continue;

    filteredQueryParameters[key] = queryParameters[key];
  }

  console.debug("Filtered query parameters for UTM prefix: " + JSON.stringify(filteredQueryParameters));
  return filteredQueryParameters;
}
