import { IAnyProposal } from "src/hooks/useProposals";

export type ProposalTabProps = {
  proposal: IAnyProposal;
};

export interface CancelCallback {
  (): void;
}
