import { ethers } from "ethers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { NetworkId } from "src/constants";
import {
  STAKED_TENDER_ADDRESSES,
  TENDER_ADDRESSES,
  TENDER_ESCROW_ADDRESSES,
  WRAPPED_TENDER_ADDRESSES,
} from "src/constants/addresses";
import { parseBigNumber } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useTenderEscrowContract, useTokenContract } from "src/hooks/useContract";
import { balancesOf } from "src/lib/fetchBalances";
import { queryClient } from "src/lib/react-query";
import { IERC20 } from "src/typechain";

export const Balance = (address: string) => {
  const tenderTokenContract = useTokenContract(TENDER_ADDRESSES);
  return BalanceHelper(tenderTokenContract);
};

const BalanceHelper = (contractAddress: IERC20) => {
  const { address } = useWeb3Context();
  const { isLoading, data } = useQuery(
    ["tenderBalanceOf", address],
    async () => {
      if (contractAddress && address) {
        const balance = await contractAddress.balanceOf(address);
        return parseBigNumber(balance);
      }
    },
    { enabled: !!contractAddress && !!address },
  );
  return data;
};

export const StakedBalance = () => {
  const stakingContract = useTokenContract(STAKED_TENDER_ADDRESSES);
  return BalanceHelper(stakingContract);
};

export const WrappedBalance = () => {
  const wrappedContract = useTokenContract(WRAPPED_TENDER_ADDRESSES);
  return BalanceHelper(wrappedContract);
};

export const CrossChainBalanceCheck = (address: string) => {
  const { data } = useQuery(
    ["CrossChainCheck", address],
    async () => {
      if (address) {
        const bal = await balancesOf(address, NetworkId.FANTOM);
        const chicken = bal.find(address => address.contractAddress === TENDER_ADDRESSES[NetworkId.FANTOM]);
        if (chicken && parseInt(chicken.balance) > 0) {
          return true;
        }
        return false;
      }
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  return data;
};

export const GOhmExchangeRate = () => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["gOhmExchangeRate"],
    async () => {
      if (tenderEscrowContract) {
        const data = await tenderEscrowContract.gohmExchangeRate();
        return parseBigNumber(data) / 1e9;
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data;
};

export const DaiExchangeRate = () => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["daiExchangeRate"],
    async () => {
      if (tenderEscrowContract) {
        const data = await tenderEscrowContract.daiExchangeRate();
        return parseBigNumber(data) / 1e9;
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data;
};

export const Deposits = (address: string) => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["deposits", address],
    async () => {
      if (tenderEscrowContract && address) {
        const data = await tenderEscrowContract.deposits(address);
        return {
          ...data,
          amount: parseBigNumber(data.amount),
          index: parseBigNumber(data.index),
          ohmPrice: parseBigNumber(data.ohmPrice),
        };
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return { ...data };
};

export const TotalDeposits = () => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["totalDeposits"],
    async () => {
      if (tenderEscrowContract) {
        const data = await tenderEscrowContract.totalDeposits();
        return parseBigNumber(data);
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data;
};

export const MaxDeposits = () => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["maxDeposits"],
    async () => {
      if (tenderEscrowContract) {
        const data = await tenderEscrowContract.maxDeposits();
        return parseBigNumber(data);
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data;
};

//
//0=PENDING
//1=FAILED
//2=PASSED
export const EscrowState = () => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["escrowStateCall"],
    async () => {
      if (tenderEscrowContract) {
        const data = await tenderEscrowContract.state();
        return data;
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data;
};

export const Withdraw = () => {
  const { provider } = useWeb3Context();
  const signer = provider.getSigner();
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES, signer);
  return useMutation(
    async () => {
      const data = await tenderEscrowContract.withdraw();
      return data.wait();
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("deposits");
      },
    },
  );
};

export const Redeem = () => {
  const { provider } = useWeb3Context();
  const signer = provider.getSigner();
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES, signer);
  return useMutation(
    async () => {
      const data = await tenderEscrowContract.redeem();
      return data.wait();
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["deposits"]);
      },
    },
  );
};

export const Deposit = (quantity: number, redemptionToken: number) => {
  const queryClient = useQueryClient();
  const { provider } = useWeb3Context();
  const signer = provider.getSigner();
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES, signer);
  const amount = quantity * 1e9;
  return useMutation(
    async () => {
      const data = await tenderEscrowContract.deposit(amount, redemptionToken);
      return data.wait();
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["totalDeposits"]);
        queryClient.invalidateQueries(["deposits"]);
        queryClient.invalidateQueries(["tenderBalanceOf"]);
      },
    },
  );
};

export const Allowance = (address: string) => {
  const tenderTokenContract = useTokenContract(TENDER_ADDRESSES);
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["Allowance", address],
    async () => {
      const data = await tenderTokenContract.allowance(address, tenderEscrowContract.address);
      return parseBigNumber(data);
    },
    { enabled: !!tenderTokenContract && !!tenderEscrowContract },
  );
  return data;
};

export const Approve = () => {
  const queryClient = useQueryClient();
  const { provider, networkId } = useWeb3Context();
  const signer = provider.getSigner();
  const tenderTokenContract = useTokenContract(TENDER_ADDRESSES, signer);
  const escrowAddress = TENDER_ESCROW_ADDRESSES[networkId];
  return useMutation(
    async () => {
      const data = await tenderTokenContract.approve(
        escrowAddress,
        ethers.utils.parseUnits("1000000000", "gwei").toString(),
      );
      return data.wait();
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["Allowance"]);
      },
    },
  );
};
