import { useEffect } from "react";
import ReactGA from "react-ga";
import { useLocation } from "react-router-dom";

import { Environment } from "../helpers/environment/Environment/Environment";
import { useWeb3Context } from "./web3Context";

const GA_API_KEY = Environment.getGoogleAnalyticsApiKey();

const useGoogleAnalytics = () => {
  const location = useLocation();
  const { address } = useWeb3Context();

  useEffect(() => {
    const path = location.pathname + location.hash + location.search;
    const gaOptions = Object.assign(
      {
        cookieFlags: "SameSite=Strict; Secure",
      },
      address ? { userId: address } : {},
    );

    if (GA_API_KEY && GA_API_KEY.length > 1) {
      ReactGA.initialize(GA_API_KEY, {
        gaOptions,
      });
      ReactGA.set({ anonymizeIp: true });
      ReactGA.pageview(path);
    }
  }, [location]);
};

export { useGoogleAnalytics };
