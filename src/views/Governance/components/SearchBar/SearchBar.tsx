import SearchIcon from "@mui/icons-material/Search";
import { Box, Input, InputAdornment, useTheme } from "@mui/material";

export const SearchBar = () => {
  const theme = useTheme();
  return (
    <Box mb="9px">
      <Input
        fullWidth
        disableUnderline
        className="search-input"
        sx={{
          backgroundColor: theme.colors.gray[700],
          fontSize: "15px",
          borderColor: "transparent",
          borderRadius: "6px",
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={{ fill: theme.colors.gray[500] }} />
          </InputAdornment>
        }
        placeholder="Search proposal"
      />
    </Box>
  );
};
