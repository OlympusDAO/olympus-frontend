import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { EnvHelper } from "../helpers/Environment";

const GA_API_KEY = EnvHelper.getGaKey();

const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (GA_API_KEY) {
      ReactGA.initialize(GA_API_KEY);
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [location]);
};

export { useGoogleAnalytics };
