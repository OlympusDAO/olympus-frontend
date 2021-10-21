import { useCallback, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import "./tyche.scss";
import DirectYield from "./DirectYield";

function Tyche() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div id="yield-directing-view">
      <DirectYield />
    </div>
  );
}

export default Tyche;
