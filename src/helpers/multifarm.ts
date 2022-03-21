export const getMultiFarmApiKey = () => "ZawByKd4WLczzLcLOBS2aEG3uNXkyitk";

export const categoryTypesConfig = {
  "Reserve Assets": {
    cols: {
      farm: false,
      apr_y: false,
      month_earnings: false,
      tooltip: false,
      progress: false,
    },
  },
  Other: {
    cols: {
      farm: false,
      apr_y: false,
      month_earnings: false,
      tooltip: false,
      progress: false,
    },
  },
  "Protocol-Owned Liquidity": {
    cols: {
      progress: false,
    },
    colsNames: {
      farm: "DEX",
    },
  },
  "Olympus Pro": {
    cols: {
      farm: false,
      apr_y: false,
      month_earnings: false,
      progress: false,
    },
  },
  "Strategic Assets": {
    cols: {
      progress: false,
      farm: false,
      apr_y: false,
      month_earnings: false,
    },
  },
  "Olympus Branch": {
    cols: {
      progress: false,
    },
    colsNames: {
      farm: "Protocol",
    },
  },
  Incubator: {
    cols: {
      farm: false,
      progress: false,
    },
  },
};

export const strategyTypesConfig = {
  wallet: {
    tooltip: false,
    cols: {
      apr_y: false,
      progress: false,
      farm: false,
      month_earnings: false,
    },
  },
  collateral: {
    active: false,
  },
  claimable: {
    cols: {
      apr_y: false,
      month_earnings: false,
      progress: false,
    },
  },
  debt: {
    active: false,
  },
  nft: {
    active: false,
  },
};
