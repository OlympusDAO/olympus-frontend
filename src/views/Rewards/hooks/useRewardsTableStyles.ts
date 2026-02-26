import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";

export const useRewardsTableStyles = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const colors = useMemo(
    () => ({
      borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 23, 34, 0.05)",
      secondaryText: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(20, 23, 34, 0.6)",
      disabledText: isDark ? "rgba(255, 255, 255, 0.20)" : "rgba(20, 23, 34, 0.20)",
      disabledBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 23, 34, 0.05)",
      paginationBtnBg: isDark ? "rgba(255, 255, 255, 0.10)" : "rgba(20, 23, 34, 0.10)",
      arrowColor: isDark ? "white" : "#141722",
    }),
    [isDark],
  );

  const styles = useMemo(
    () => ({
      headerSx: {
        color: colors.secondaryText,
        fontSize: "12px",
        fontWeight: 400,
        lineHeight: "16px",
        height: "40px",
        padding: "12px",
        whiteSpace: "nowrap" as const,
        borderBottom: `1px solid ${colors.borderColor}`,
      },
      cellSx: {
        padding: "12px",
        height: "64px",
        whiteSpace: "nowrap" as const,
        borderBottom: `1px solid ${colors.borderColor}`,
      },
      valueSx: {
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "16px",
        letterSpacing: "0.12px",
        color: theme.colors.gray[10],
      },
      containerSx: {
        width: "100%",
        background: isDark ? "#20222A" : "#EFEAE0",
        borderRadius: "12px",
        overflowX: "auto" as const,
      },
      tableSx: {
        width: "100%",
        borderCollapse: "collapse" as const,
        margin: 0,
      },
      rowHoverSx: {
        transition: "background-color 0.2s",
        "&:hover": {
          bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 23, 34, 0.05)",
        },
        "&:last-child td": { borderBottom: "none" },
      },
      actionButtonSx: (active: boolean) => ({
        textTransform: "none" as const,
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "16px",
        letterSpacing: "0.12px",
        padding: "8px 14px",
        borderRadius: "8px",
        minWidth: "auto",
        ...(!active && {
          bgcolor: colors.disabledBg,
          color: colors.disabledText,
          "&.Mui-disabled": {
            bgcolor: colors.disabledBg,
            color: colors.disabledText,
            opacity: 1,
          },
        }),
      }),
      emptyStateCellSx: {
        borderBottom: "none",
        padding: "56px 12px",
      },
    }),
    [colors, theme.colors.gray, isDark],
  );

  return { theme, isDark, colors, styles };
};
