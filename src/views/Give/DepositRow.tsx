import { Box, Button, Typography, TableRow, TableCell, Divider } from "@material-ui/core";
import { shorten } from "src/helpers";
import data from "./projects.json";
import { Project } from "../../components/GiveProject/project.type";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./give.scss";

interface IUserDonationInfo {
  date: string;
  deposit: string;
  recipient: string;
  yieldDonated: string;
}

interface DepositRowProps {
  depositObject: IUserDonationInfo;
}

export const DepositTableRow = ({ depositObject }: DepositRowProps) => {
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const getRecipientTitle = (address: string): string => {
    const project = projectMap.get(address);
    if (!project) return shorten(address);

    if (!project.owner) return project.title;

    return project.owner + " - " + project.title;
  };

  return (
    <Box>
      <TableRow>
        {!isSmallScreen && (
          <TableCell align="left" className="deposit-date-cell">
            <Typography variant="body1">{depositObject.date}</Typography>
          </TableCell>
        )}
        <TableCell align="left" className="deposit-recipient-cell">
          <Typography variant="body1">{getRecipientTitle(depositObject.recipient)}</Typography>
        </TableCell>
        {!isSmallScreen && (
          <TableCell align="left" className="deposit-deposited-cell">
            <Typography variant="body1">{parseFloat(depositObject.deposit).toFixed(2)}</Typography>
          </TableCell>
        )}
        <TableCell align="left" className="deposit-yield-cell">
          <Typography variant="body1">{parseFloat(depositObject.yieldDonated).toFixed(2)}</Typography>
        </TableCell>
        <TableCell align="left" className="deposit-manage-cell">
          <Button variant="outlined" color="secondary" style={{ width: "100%" }}>
            <Typography variant="h6">Manage</Typography>
          </Button>
        </TableCell>
      </TableRow>
      <Divider />
    </Box>
  );
};
