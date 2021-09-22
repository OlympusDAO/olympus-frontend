// Pushing data to segment analytics
export function ua(data) {
  const stringifiedData = JSON.stringify(data);
  analytics.track(data.type, {
    data,
  });
}
