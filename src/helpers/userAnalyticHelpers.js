// Pushing data to segment analytics
export function segmentUA(data) {
  const stringifiedData = JSON.stringify(data);
  var analytics = (window.analytics = window.analytics || []);
  analytics.track(data.type, {
    data,
  });
}
