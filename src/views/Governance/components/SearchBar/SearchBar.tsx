import "./SearchBar.scss";

import SearchIcon from "@mui/icons-material/Search";
import { Grid, InputAdornment, OutlinedInput } from "@mui/material";

export const SearchBar = () => {
  return (
    <Grid className="search-bar" item xs={4}>
      <OutlinedInput
        className="search-input"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        placeholder="Search proposal"
      />
    </Grid>
  );
};
