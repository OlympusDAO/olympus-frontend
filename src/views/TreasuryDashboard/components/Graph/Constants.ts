export interface ToggleCallback {
  (event: React.MouseEvent<HTMLElement>, newValue: string | null): void;
}

export const QUERY_RECORD_COUNT = "recordCount";
export const QUERY_TOKEN = "token";
export const QUERY_TOKEN_OHM = "OHM";
export const QUERY_TOKEN_GOHM = "gOHM";
