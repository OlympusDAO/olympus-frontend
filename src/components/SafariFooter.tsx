/**
 * Safari on iPhone prevents the user from scrolling to the bottom of the screen, due
 * to the address bar.
 *
 * On Safari for iPhone, this React component adds an empty div with padding, which ensures that no content
 * is hidden.
 *
 * On all other browsers, this has no effect.
 */
export const SafariFooter: React.FC = () => {
  const isSafariOniPhone = navigator.userAgent.match(/(iPhone).*(Safari)/);

  if (!isSafariOniPhone) return <></>;

  return <div id="safari-iphone-footer" style={{ paddingTop: "80px" }} />;
};
