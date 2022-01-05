export function getParameterByName(name: string, url: string) {
  const cleanName = escape(name.replace(/[\[\]]/g, "\\$&"));
  const regex = new RegExp(`[?&]${cleanName}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
