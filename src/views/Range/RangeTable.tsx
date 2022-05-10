import { Table, TableBody, TableCell, TableHead, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TertiaryButton } from "@olympusdao/component-library";
import { FC } from "react";

const useStyles = makeStyles<Theme>(theme => ({}));

//export interface OHMRangeTableProps {}

/**
 * Component for Displaying RangeTable
 */
const RangeTable: FC = () => {
  const classes = useStyles();

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
          <TableCell>Asset 1</TableCell>
          <TableCell>Operator 1</TableCell>
          <TableCell>$15.15</TableCell>
          <TableCell>1,000</TableCell>
          <TableCell>
            <TertiaryButton>Swap for OHM</TertiaryButton>
          </TableCell>
        </TableBody>
      </Table>
    </>
  );
};

export default RangeTable;
