// Add all feature flags here!
export const OLYZAPS_FEATURE_FLAG = "REACT_APP_OLYZAPS_FEATURE_FLAG";

export const isFeatureEnabled = (featureFlag: string): boolean => {
  return Boolean(process.env[featureFlag] && process.env[featureFlag] === "enabled");
};
