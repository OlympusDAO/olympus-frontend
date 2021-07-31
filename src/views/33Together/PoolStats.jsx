import React from "react";
import { useWeb3Context } from "../../hooks";
// import { OhmDataLoading } from '../../components/Loading/OhmDataLoading'
import { CircularProgress } from "@material-ui/core";

export const PoolData = () => {
  const { address, provider } = useWeb3Context();
  const poolChainValuesIsFetched = false;
  const loading = !poolChainValuesIsFetched || (address && !usersChainValuesIsFetched);

  if (loading) {
    return <CircularProgress />;
  }

  return <>{props.children}</>;
};
