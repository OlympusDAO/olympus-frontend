import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { segmentUA } from "src/helpers/userAnalyticHelpers";
import { useWeb3Context } from "./useWeb3Context";

export const useEagerConnect = () => {
  // const location = useLocation();
  const [walletChecked, setWalletChecked] = useState(false);
  const { isConnected, connect, hasCachedProvider } = useWeb3Context();

  useEffect(() => {
    if (!walletChecked && hasCachedProvider) {
      connect().catch(() => {
        setWalletChecked(true);

        // (sam-potter)
        // @TODO Move these analytics to a place where the `useLocation` hook
        // is more accessible (under the necessary <Provider />)
        // const currentPath = location.pathname + location.hash + location.search;
        // segmentUA({ type: "connect", provider, context: currentPath });
      });
    } else {
      setWalletChecked(true);
    }
  }, [connect, walletChecked, hasCachedProvider]);

  useEffect(() => {
    if (!walletChecked && isConnected) {
      setWalletChecked(true);
    }
  }, [walletChecked, isConnected]);

  return walletChecked;
};
