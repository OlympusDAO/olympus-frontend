import { Table, TableBody, TableCell, TableHead, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TertiaryButton, Token, TokenStack } from "@olympusdao/component-library";
import { FC } from "react";

import { Capacity, OperatorPrice } from "./hooks";

const useStyles = makeStyles<Theme>(theme => ({}));

//export interface OHMRangeTableProps {}

/**
 * Component for Displaying RangeTable
 */
const RangeTable: FC = () => {
  const classes = useStyles();

  const { data: capacity } = Capacity("operator");

  const { data: price } = OperatorPrice("operator");

  return (
    <>
      <Table>
        <TableHead>
          <TableCell>Asset</TableCell>
          <TableCell>Operator</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Capacity</TableCell>
          <TableCell></TableCell>
        </TableHead>
        <TableBody>
          <TableCell>
            <Token name="ETH" /> ETH
          </TableCell>
          <TableCell>
            <TokenStack tokens={["OHM", "ETH"]} /> OHM-ETH
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
