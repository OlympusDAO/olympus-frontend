import { CSSProperties } from "react";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";

export const PARAM_DAYS = "days";
export const DEFAULT_DAYS = 30;

export const PARAM_TOKEN = "token";
export const PARAM_TOKEN_OHM = "OHM";
export const PARAM_TOKEN_GOHM = "gOHM";

export const PARAM_DAYS_OFFSET = "daysOffset";

export type GraphProps = {
  /**
   * A value of null indicates that no earliestDate has been loaded (asynchronously).
   * Components should avoid loading any data until earliestDate is non-null.
   */
  earliestDate: string | null;
  subgraphDaysOffset: number | undefined;
  activeToken?: string;
  onMouseMove?: CategoricalChartFunc;
};

export type LiquidBackingProps = {
  isLiquidBackingActive: boolean;
};

export type AssetsTableProps = {
  selectedIndex: number;
};

// These constants are used by charts to have consistent colours
// Source: https://www.figma.com/file/RCfzlYA1i8wbJI3rPGxxxz/SubGraph-Charts-V3?node-id=0%3A1
export const DEFAULT_COLORS: string[] = [
  "#917BD9",
  "#49A1F2",
  "#95B7A1",
  "#E49471",
  "#D85F73",
  "#A3CFF0",
  "#70E8C7",
  "#DF7FD0",
  "#F6BD67",
  "#F090A0",
];

export const DEFAULT_BULLETPOINT_COLOURS: CSSProperties[] = DEFAULT_COLORS.map(value => {
  return {
    background: value,
  };
});
