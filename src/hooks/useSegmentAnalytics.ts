declare const window: CustomWindow;

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useWeb3Context } from "src/hooks/web3Context";
import { v4 as uuidv4 } from "uuid";

import { EnvHelper } from "../helpers/Environment";
import { getParameterByName } from "../helpers/QueryParameterHelper";

const SEGMENT_API_KEY = EnvHelper.getSegmentKey();

type Utm = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

const useSegmentAnalytics = () => {
  const [prevPath, setPrevPath] = useState<string | null>(null);
  const [loadedSegment, setLoadedSegment] = useState<boolean>(false);
  const analytics = (window.analytics = window.analytics || []);
  const location = useLocation();
  const { address } = useWeb3Context();

  useEffect(() => {
    if (SEGMENT_API_KEY && SEGMENT_API_KEY.length > 1) {
      const path = location.pathname + location.search + location.hash;
      const utmSource = getParameterByName("utm_source", path);
      const utmMedium = getParameterByName("utm_medium", path);
      const utmCampaign = getParameterByName("utm_campaign", path);
      initSegmentAnalytics({ utmSource, utmMedium, utmCampaign });
      setLoadedSegment(true);
    }
  }, []);

  useEffect(() => {
    if (loadedSegment) {
      const currentPath = location.pathname + location.search + location.hash;
      if (currentPath !== prevPath) {
        setPrevPath(currentPath);
        analytics.page("", currentPath, {}, { context: { ip: "0.0.0.0" } });
      }
    }
  }, [location]);

  useEffect(() => {
    if (loadedSegment && address) {
      analytics.identify(address, {
        wallet: address,
        sessionId: uuidv4(),
      });
    }
  }, [address]);
};

const initSegmentAnalytics = (utm: Utm) => {
  const analytics = (window.analytics = window.analytics || []);
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
      analytics.factory = function (...args: any) {
        return function () {
          const t = Array.prototype.slice.call(args);
          t.unshift(args[0]);
          analytics.push(t);
          return analytics;
        };
      };
      for (let e = 0; e < analytics.methods.length; e++) {
        const key = analytics.methods[e];
        analytics[key] = analytics.factory(key);
      }
      analytics.load = function (key: string, e: any) {
        const t = document.createElement("script");
        t.type = "text/javascript";
        t.async = !0;
        t.src = `https://cdn.segment.com/analytics.js/v1/${key}/analytics.min.js`;
        const n = document.getElementsByTagName("script")[0];
        n?.parentNode?.insertBefore(t, n);
        analytics._loadOptions = e;
      };
      analytics._writeKey = SEGMENT_API_KEY;
      analytics.SNIPPET_VERSION = "4.15.3";
      analytics.load(SEGMENT_API_KEY);
      analytics.page("UTM Check", utm);
    }
  }
};

export default useSegmentAnalytics;
