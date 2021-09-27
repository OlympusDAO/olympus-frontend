import React, { useState } from "react";
import { EnvHelper } from "../helpers/Environment";
import { useLocation } from "react-router-dom";

const REACT_APP_SEGMENT_KEY = EnvHelper.getSegmentKey();

export default function useSegmentAnalytics() {
  const [prevPath, setPrevPath] = useState(null);
  const location = useLocation();

  React.useEffect(() => {
    initSegmentAnalytics();
  }, []);

  React.useEffect(() => {
    var analytics = (window.analytics = window.analytics || []);
    // NOTE (appleseed): location.pathname NEVER changes because we prepend /# to all paths for IPFS... so you need to
    // ... to add  + location.search + location.hash;
    const currentPath = location.pathname + location.search + location.hash;
    if (currentPath !== prevPath) {
      setPrevPath(currentPath);
      // NOTE (appleseed): if analytics aren't showing the full pathname + location.hash then we need to manually pass it
      // ... into analytics.page() below
      analytics.page();
    }
  }, [location]);
}

function initSegmentAnalytics() {
  var analytics = (window.analytics = window.analytics || []);
  if (!analytics.initialize) {
    if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice.");
    else {
      analytics.invoked = !0;
      analytics.methods = [
        "trackSubmit",
        "trackClick",
        "trackLink",
        "trackForm",
        "pageview",
        "identify",
        "reset",
        "group",
        "track",
        "ready",
        "alias",
        "debug",
        "page",
        "once",
        "off",
        "on",
        "addSourceMiddleware",
        "addIntegrationMiddleware",
        "setAnonymousId",
        "addDestinationMiddleware",
      ];
      analytics.factory = function (e) {
        return function () {
          var t = Array.prototype.slice.call(arguments);
          t.unshift(e);
          analytics.push(t);
          return analytics;
        };
      };
      for (var e = 0; e < analytics.methods.length; e++) {
        var key = analytics.methods[e];
        analytics[key] = analytics.factory(key);
      }
      analytics.load = function (key, e) {
        var t = document.createElement("script");
        t.type = "text/javascript";
        t.async = !0;
        t.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
        var n = document.getElementsByTagName("script")[0];
        n.parentNode.insertBefore(t, n);
        analytics._loadOptions = e;
      };
      analytics._writeKey = REACT_APP_SEGMENT_KEY;
      analytics.SNIPPET_VERSION = "4.15.3";
      analytics.load(REACT_APP_SEGMENT_KEY);
      analytics.page();
    }
  }
}
