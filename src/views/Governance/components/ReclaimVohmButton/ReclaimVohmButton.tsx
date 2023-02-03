import { TertiaryButton } from "@olympusdao/component-library";
import { useReClaimVohm } from "src/hooks/useProposal";
import { proposalDateFormat } from "src/views/Governance/components/ProposalPage/ProposalPage";
import { ProposalTabProps } from "src/views/Governance/interfaces";
import { useAccount } from "wagmi";

/**
 * Component for Displaying ReclaimVohm button
 */
const ReclaimVohmButton = ({ proposal }: ProposalTabProps) => {
  const { address: connectedWallet } = useAccount();

  const reclaimCollateral = useReClaimVohm();
  return (
    <>
      {connectedWallet?.toLowerCase() === proposal.submitter.toLowerCase() && (
        <TertiaryButton
          disabled={Date.now() < proposal.collateralClaimableAt}
          onClick={() => reclaimCollateral.mutate(proposal.id)}
        >
          {`Claim Your gOHM on or after ${proposalDateFormat.format(proposal.collateralClaimableAt)}`}
        </TertiaryButton>
      )}
    </>
  );
};

export default ReclaimVohmButton;
