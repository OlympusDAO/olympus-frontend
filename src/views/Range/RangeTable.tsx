import { Box, Table, TableBody, TableCell, TableHead, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { OHMTokenProps, TertiaryButton, Token } from "@olympusdao/component-library";
import { FC } from "react";

import { Capacity, OperatorPrice, OperatorReserveToken } from "./hooks";

const useStyles = makeStyles<Theme>(theme => ({}));

//export interface OHMRangeTableProps {}

/**
 * Component for Displaying RangeTable
 */
const RangeTable: FC = () => {
  const classes = useStyles();

  const { data: capacity } = Capacity("operator");

  const { data: price } = OperatorPrice("operator");

  const { data: reserve } = OperatorReserveToken("operator");

  return (
    <>
      <Table>
        <TableHead>
          <TableCell>Reserve</TableCell>
          <TableCell>Operator</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Capacity</TableCell>
          <TableCell></TableCell>
        </TableHead>
        <TableBody>
          <TableCell>
            <Box display="flex" alignItems="center">
              <Token name={reserve as OHMTokenProps["name"]} />{" "}
              <Typography style={{ paddingLeft: "8px" }}>{reserve}</Typography>
            </Box>
          </TableCell>
          <TableCell align="center">
            <Box display="flex" alignItems="center">
              <Token name="OHM" /> <Typography style={{ paddingLeft: "8px" }}>OHM</Typography>
            </Box>
          </TableCell>
          <TableCell>{price}</TableCell>
          <TableCell>{capacity}</TableCell>
          <TableCell>
            <TertiaryButton>Swap for OHM</TertiaryButton>
          </TableCell>
        </TableBody>
      </Table>
    </>
  );
};

export default RangeTable;
