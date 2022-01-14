// Add all feature flags here!
export const OLYZAPS_ENABLED = "REACT_APP_OLYZAPS_ENABLED";
export const GIVE_ENABLED = "REACT_APP_GIVE_ENABLED";

export const isFeatureEnabled = (featureFlag: string): boolean => {
  return Boolean(process.env[featureFlag] && process.env[featureFlag] === "true");
};
