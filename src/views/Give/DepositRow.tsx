import { Box, Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { shorten } from "src/helpers";
import data from "./projects.json";
import "./give.scss";

export const  DepositTableRow = ({ deposit }) => {
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));

  const getRecipientTitle = (address: string): string => {
    const project = projectMap.get(address);
    if (!project) return shorten(address);

    if (!project.owner) return project.title;

    return project.owner + " - " + project.title;
  };

  return (
    <TableRow>
      <TableCell align="left" className="deposit-date-cell">
        <Typography variant="body1">{deposit.date}</Typography>
      </TableCell>
      <TableCell align="left" className="deposit-recipient-cell">
        <Typography variant="body1">{getRecipientTitle(deposit.recipient)}</Typography>
      </TableCell>
      <TableCell align="left" className="deposit-deposited-cell">
        <Typography variant="body1">{parseFloat(deposit.deposited).toFixed(2)}</Typography>
      </TableCell>
      <TableCell align="left" className="deposit-yield-cell">
        <Typography variant="body1">{parseFloat(deposit.yield).toFixed(2)}</Typography>
      </TableCell>
      <TableCell align="left" className="deposit-manage-cell">
        <Button variant="outlined" color="secondary" style={{ width: "100%" }}>
          <Typography variant="h6">Manage</Typography>
        </Button>
      </TableCell>
    </TableRow>
  );
}