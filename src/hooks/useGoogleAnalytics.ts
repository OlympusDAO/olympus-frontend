import { useEffect } from "react";
import ReactGA from "react-ga";
import { useLocation } from "react-router-dom";

import { EnvHelper } from "../helpers/Environment";

const GA_API_KEY = EnvHelper.getGaKey();

const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (GA_API_KEY && GA_API_KEY.length > 1) {
      ReactGA.initialize(GA_API_KEY, {
        gaOptions: { cookieFlags: "secure;samesite=strict" },
      });
      ReactGA.set({ anonymizeIp: true });
      ReactGA.pageview(location.pathname + location.hash + location.search);
    }
  }, [location]);
};

export { useGoogleAnalytics };
