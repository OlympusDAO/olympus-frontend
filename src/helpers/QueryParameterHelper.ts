export function getParameterByName(name: string, url: string) {
  const urlParams = new URLSearchParams(url);
  return urlParams.get(name);
}
