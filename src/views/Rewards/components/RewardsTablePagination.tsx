import { Box, Typography } from "@mui/material";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

interface RewardsTablePaginationProps {
  page: number;
  totalRows: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  secondaryText: string;
  paginationBtnBg: string;
  arrowColor: string;
}

export const RewardsTablePagination = ({
  page,
  totalRows,
  rowsPerPage,
  onPageChange,
  secondaryText,
  paginationBtnBg,
  arrowColor,
}: RewardsTablePaginationProps) => {
  if (totalRows <= 0) return null;

  const totalPages = Math.ceil(totalRows / rowsPerPage);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px", color: secondaryText }}>
        Showing {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, totalRows)} out of {totalRows}
      </Typography>
      <Box display="flex" gap="8px">
        <Box
          component="button"
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          sx={{
            width: "32px",
            height: "32px",
            padding: "8px",
            bgcolor: paginationBtnBg,
            borderRadius: "100px",
            border: "none",
            cursor: page === 0 ? "default" : "pointer",
            opacity: page === 0 ? 0.3 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RiArrowLeftSLine size={16} color={arrowColor} />
        </Box>
        <Box
          component="button"
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          sx={{
            width: "32px",
            height: "32px",
            padding: "8px",
            bgcolor: paginationBtnBg,
            borderRadius: "100px",
            border: "none",
            cursor: page >= totalPages - 1 ? "default" : "pointer",
            opacity: page >= totalPages - 1 ? 0.3 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RiArrowRightSLine size={16} color={arrowColor} />
        </Box>
      </Box>
    </Box>
  );
};
