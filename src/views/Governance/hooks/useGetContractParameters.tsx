import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { parseBigNumber } from "src/helpers";
import { NetworkId } from "src/networkDetails";
import { GOHM__factory, Timelock__factory } from "src/typechain";
import { useProvider } from "wagmi";

export const useGetContractParameters = () => {
  const provider = useProvider();
  return useQuery(["getContractParameters", NetworkId.MAINNET], async () => {
    const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
    const gohmContract = GOHM__factory.connect(GOHM_ADDRESSES[NetworkId.MAINNET], provider);
    const precisionFactor = BigNumber.from("100000000");
    const totalSupply = await gohmContract.totalSupply();
    const proposalThreshold = await contract.proposalThreshold();
    const proposalApprovalThreshold = await contract.approvalThresholdPct();
    const proposalQuorum = await contract.quorumPct();
    const votingDelay = await contract.votingDelay();
    const votingPeriod = await contract.votingPeriod();
    const activationGracePeriod = await contract.activationGracePeriod();
    const timelockContract = await contract.timelock();
    const governanceContract = GOVERNANCE_CONTRACT.addresses[NetworkId.MAINNET];
    const timelockCon = Timelock__factory.connect(timelockContract, provider);
    const timelockDelay = await timelockCon.delay(); //seconds

    return {
      proposalThreshold: formatUnits(totalSupply.mul(proposalThreshold).div(precisionFactor), 18),
      proposalApprovalThreshold: parseBigNumber(proposalApprovalThreshold, 8) * 100,
      proposalQuorum: formatUnits(totalSupply.mul(proposalQuorum).div(precisionFactor)),
      votingDelay: `${votingDelay.div(BigNumber.from(7200)).toString()} Days`,
      votingPeriod: `${votingPeriod.div(BigNumber.from(7200)).toString()} Days`,
      executionDelay: `${timelockDelay.div(BigNumber.from(86400)).toString()} Day `,
      activationGracePeriod: `${activationGracePeriod.div(BigNumber.from(7200)).toString()} Day `,
      timelockContract,
      governanceContract,
      gohmContract: GOHM_ADDRESSES[NetworkId.MAINNET],
    };
  });
};
