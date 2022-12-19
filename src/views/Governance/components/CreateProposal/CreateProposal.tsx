import { Box, Grid, InputLabel, Select, Skeleton, styled, Typography } from "@mui/material";
import { Paper, PrimaryButton } from "@olympusdao/component-library";
import MDEditor from "@uiw/react-md-editor";
import { ethers } from "ethers";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import rehypeSanitize from "rehype-sanitize";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { GOVERNANCE_ADDRESSES, VOTE_TOKEN_ADDRESSES } from "src/constants/addresses";
import { isValidUrl } from "src/helpers";
import { useVoteBalance } from "src/hooks/useBalance";
import { useCreateProposalVotingPowerReqd, useIPFSUpload, useSubmitProposal } from "src/hooks/useProposal";
import { ProposalAction } from "src/hooks/useProposals";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BackButton } from "src/views/Governance/components/BackButton";
import { TextEntry } from "src/views/Governance/components/CreateProposal/components/TextEntry";
import { MarkdownPreview } from "src/views/Governance/components/MarkdownPreview";
import { InstructionsDetails } from "src/views/Governance/components/ProposalPage/components/PollDetailsTab";

export const CreateProposal = () => {
  const ipfsUpload = useIPFSUpload();
  const submitProposal = useSubmitProposal();
  const [proposalTitle, setProposalTitle] = useState<string>();
  const [proposalDescription, setProposalDescription] = useState<string>();
  const [proposalDiscussion, setProposalDiscussion] = useState<string>();
  const { data: collateralRequired, isLoading: collateralRequiredLoading } = useCreateProposalVotingPowerReqd();
  const networks = useTestableNetworks();
  const { data: votesBalance } = useVoteBalance()[networks.MAINNET];
  // TODO(appleseed): need to allow multiple instructions
  const [proposalAction, setProposalAction] = useState<ProposalAction>(ProposalAction.InstallModule);
  const [proposalContract, setProposalContract] = useState<string>();
  const navigate = useNavigate();

  const StyledInputLabel = styled(InputLabel)(() => ({
    lineHeight: "24px",
    fontSize: "15px",
    marginBottom: "3px",
  }));

  const SelectionInput: FC = () => {
    return (
      <Grid item xs={6}>
        <Box paddingTop="10px" paddingBottom="10px">
          <StyledInputLabel>Action</StyledInputLabel>
          {/* // TODO(appleseed): need to allow multiple instructions */}
          <Select
            key="action"
            native={true}
            value={proposalAction}
            sx={{ blur: "none" }}
            onChange={e => setProposalAction(Number(e.target.value))}
            fullWidth
          >
            <option value={ProposalAction.InstallModule}>Install Module</option>
            <option value={ProposalAction.UpgradeModule}>Upgrade Module</option>
            <option value={ProposalAction.ActivatePolicy}>Approve Policy</option>
            <option value={ProposalAction.DeactivatePolicy}>Terminate Policy</option>
            <option value={ProposalAction.ChangeExecutor}>Change Executor</option>
          </Select>
        </Box>
      </Grid>
    );
  };

  const discussionIsValidURL = isValidUrl(proposalDiscussion as string);
  const isValidAddress = ethers.utils.isAddress(proposalContract as string);
  const proposalFieldsComplete = !!proposalTitle && !!proposalDescription && !!discussionIsValidURL && !!isValidAddress;
  const canSubmit = () => {
    if (
      !proposalFieldsComplete ||
      submitProposal.isLoading ||
      collateralRequiredLoading ||
      !votesBalance ||
      collateralRequired.gt(votesBalance)
    )
      return false;
    return true;
  };

  // https://goerli.etherscan.io/tx/0x7150ffcc290038deab9c89b1630df273273d2b428e6ee6fb6bec0ddeefe25b18
  const handleFormSubmission = async () => {
    if (!proposalFieldsComplete) {
      return;
    } else {
      const proposal = {
        name: proposalTitle as string,
        description: proposalDescription as string,
        content: proposalDescription as string,
        external_url: proposalDiscussion as string,
      };
      const fileData = await ipfsUpload.mutateAsync({ proposal });
      if (fileData) {
        const proposalURI = `ipfs://${fileData.path}`;
        // TODO(appleseed): need to allow multiple instructions
        const instructions = [{ action: proposalAction as ProposalAction, target: proposalContract as string }];
        submitProposal.mutate(
          { proposal: { name: proposal.name, instructions, proposalURI } },
          {
            onSuccess: () => {
              navigate("/governance");
            },
          },
        );
      } else {
        // TODO(appleseed): there was a problem uploading your proposal to IPFS
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper>
        <Grid container direction="column" paddingLeft="4.5px" paddingRight="4.5px">
          <BackButton />
          <CollateralRequiredText />
          <TextEntry label="Title" handleChange={setProposalTitle} />
          <StyledInputLabel>Description</StyledInputLabel>
          <MDEditor
            preview="edit"
            value={proposalDescription}
            onChange={value => (value ? setProposalDescription(value) : setProposalDescription(""))}
            height={400}
            visibleDragbar={false}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Typography>{proposalDescription?.length || 0}/14,400</Typography>
          </Box>
          <MarkdownPreview content={proposalDescription || ""} />
          <TextEntry
            label="Discussion"
            placeholder="e.g. https://forum.olympusday.finance/..."
            handleChange={setProposalDiscussion}
          />

          <Grid container direction="row" spacing="10">
            <SelectionInput />
            <Grid item xs={6}>
              <TextEntry label="Target" placeholder="Contract address" handleChange={setProposalContract} />
            </Grid>
          </Grid>
          {!!proposalContract && <InstructionsDetails action={proposalAction} target={proposalContract} />}
        </Grid>
        <Box id="create-proposal-btn-box" display="flex" justifyContent="flex-end">
          <TokenAllowanceGuard
            message={`Creating a Proposal requires a vOHM Collateral deposit. Your vOHM can be redeemed after the proposal passes/fails.`}
            tokenAddressMap={VOTE_TOKEN_ADDRESSES}
            spenderAddressMap={GOVERNANCE_ADDRESSES}
            approvalText={"Approve Collateral"}
            approvalPendingText={"Confirming Approval in your wallet"}
            isVertical
          >
            <PrimaryButton disabled={!canSubmit()} onClick={handleFormSubmission} loading={submitProposal.isLoading}>
              {submitProposal.isLoading ? "Submitting..." : "Continue"}
            </PrimaryButton>
          </TokenAllowanceGuard>
        </Box>
        <Box display={`flex`} justifyContent={`flex-end`}>
          <CollateralRequiredText />
        </Box>
      </Paper>
    </Box>
  );
};

const CollateralRequiredText = () => {
  const { data: collateralRequired, isLoading: collateralRequiredLoading } = useCreateProposalVotingPowerReqd();
  const networks = useTestableNetworks();
  const { data: votesBalance, isLoading: votesLoading } = useVoteBalance()[networks.MAINNET];

  return (
    <Box display={`flex`} flexDirection={`column`}>
      <Box display={`flex`}>
        {collateralRequiredLoading ? (
          <>
            <Typography gutterBottom={false} style={{ lineHeight: 1.4, display: "inline-block" }}>
              &#x2022;{` Creating a Proposal requires `}
            </Typography>
            <Skeleton width={60} sx={{ display: "inline-block" }} />
            <Typography gutterBottom={false} style={{ lineHeight: 1.4, display: "inline-block" }}>
              {` vOHM`}
            </Typography>
          </>
        ) : (
          <Typography gutterBottom={false} style={{ lineHeight: 1.4, display: "inline-block" }}>
            &#x2022;{` Creating a Proposal requires ${collateralRequired.toApproxNumber()} vOHM`}
          </Typography>
        )}
      </Box>
      <Box display={`flex`}>
        {votesLoading || !votesBalance ? (
          <>
            <Typography gutterBottom={false} style={{ lineHeight: 1.4, display: "inline-block" }}>
              &#x2022;{` You have `}
            </Typography>
            <Skeleton width={60} sx={{ display: "inline-block" }} />
            <Typography gutterBottom={false} style={{ lineHeight: 1.4, display: "inline-block" }}>
              {` vOHM`}
            </Typography>
          </>
        ) : (
          <Typography gutterBottom={false} style={{ lineHeight: 1.4, display: "inline-block" }}>
            &#x2022;{` You have ${votesBalance.toApproxNumber()} vOHM`}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
