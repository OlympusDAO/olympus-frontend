import { Box, styled } from "@mui/material";
import { Input } from "@olympusdao/component-library";

type TextEntryProps = {
  label: "Title" | "Description" | "Discussion" | "Target";
  handleChange: (value: string) => void;
  placeholder?: string;
};

const StyledProposalBox = styled(Box)(() => ({
  padding: "10px 0px 10px 0px",
}));
export const TextEntry = ({ label, handleChange, placeholder }: TextEntryProps) => {
  return (
    <StyledProposalBox>
      <Input id={label} label={label} placeholder={placeholder} onChange={(e: any) => handleChange(e.target.value)} />
    </StyledProposalBox>
  );
};
