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
import {
  useDynamicTokenContract,
  useStaticTokenContract,
  useTenderEscrowContract,
  useWrappedContract,
} from "src/hooks/useContract";
import { balancesOf } from "src/lib/fetchBalances";
import { queryClient } from "src/lib/react-query";
import { IERC20 } from "src/typechain";

export const Balance = () => {
  const { networkId } = useWeb3Context();
  const tenderTokenContract = useStaticTokenContract(TENDER_ADDRESSES[networkId], networkId);
  return BalanceHelper(tenderTokenContract, "tokenContract");
};

const BalanceHelper = (contractAddress: IERC20, key: string, decimals = 9) => {
  const { address } = useWeb3Context();
  const { data } = useQuery(
    ["tenderBalanceOf", address, key],
    async () => {
      if (contractAddress && address) {
        const balance = await contractAddress.balanceOf(address);
        return parseBigNumber(balance, decimals);
      }
      return 0;
    },
    { enabled: !!contractAddress && !!address },
  );
  return data || 0;
};

export const StakedBalance = () => {
  const { networkId } = useWeb3Context();
  const stakingContract = useStaticTokenContract(STAKED_TENDER_ADDRESSES[networkId], networkId);
  return BalanceHelper(stakingContract, "stakedContract");
};

export const WrappedBalance = () => {
  const { networkId } = useWeb3Context();
  const wrappedContract = useStaticTokenContract(WRAPPED_TENDER_ADDRESSES[networkId], networkId);
  return BalanceHelper(wrappedContract, "wrappedContract", 18);
};

export const WrappedToStaked = (quantity: number) => {
  const quantityString = quantity.toString();
  const { networkId } = useWeb3Context();
  const wrappedContract = useWrappedContract(WRAPPED_TENDER_ADDRESSES[networkId], networkId);
  const { data } = useQuery(
    ["wrappedToStaked", quantity],
    async () => {
      if (wrappedContract) {
        const balance = await wrappedContract.wOHMTosOHM(ethers.utils.parseUnits(quantityString, 18));
        return parseBigNumber(balance, 18) * 1e9;
      }
    },
    { enabled: !!wrappedContract },
  );
  return data || 0;
};

export const CrossChainBalanceCheck = (address: string) => {
  const { data } = useQuery(
    ["CrossChainCheck", address],
    async () => {
      if (address) {
        const bal = await balancesOf(address, NetworkId.FANTOM);
        const token = bal.find(address => address.contractAddress === TENDER_ADDRESSES[NetworkId.FANTOM]);
        if (token && parseInt(token.balance) > 0) {
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
  return data || 0;
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
  return data || 0;
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
          amount: parseBigNumber(data.amount, 18),
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
        return parseBigNumber(data, 18);
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data || 0;
};

export const MaxDeposits = () => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["maxDeposits"],
    async () => {
      if (tenderEscrowContract) {
        const data = await tenderEscrowContract.maxDeposits();
        return parseBigNumber(data, 18);
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data || 0;
};

export const LatestIndex = () => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["TenderlatestIndex"],
    async () => {
      if (tenderEscrowContract) {
        const data = await tenderEscrowContract.getLatestOHMIndex();
        return parseBigNumber(data);
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data || 0;
};

export const LatestPrice = () => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["TenderLatestPrice"],
    async () => {
      if (tenderEscrowContract) {
        const data = await tenderEscrowContract.getLatestOHMPrice();
        return parseBigNumber(data);
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data || 0;
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
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES, true);
  return useMutation(
    async () => {
      if (!tenderEscrowContract) throw new Error("Token doesn't exist on current network. Please switch networks.");
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
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  return useMutation(
    async () => {
      if (!tenderEscrowContract) throw new Error("Token doesn't exist on current network. Please switch networks.");
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

export const Deposit = () => {
  const queryClient = useQueryClient();
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES, true);
  return useMutation(
    async (deposit: { quantity: number; redeemToken: number; depositToken: number }) => {
      if (!tenderEscrowContract) throw new Error("Token doesn't exist on current network. Please switch networks.");
      //if depositToken==2, need 18 decimals for wsSPA, else 9 decimals
      const data = await tenderEscrowContract.deposit(
        ethers.utils.parseUnits(deposit.quantity.toString(), deposit.depositToken == 2 ? 18 : 9),
        deposit.redeemToken,
        deposit.depositToken,
      );
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

export const UnstakedAllowance = () => {
  const tenderTokenContract = useStaticTokenContract(
    TENDER_ADDRESSES[NetworkId.FANTOM_TESTNET],
    NetworkId.FANTOM_TESTNET,
  );
  return AllowanceHelper(tenderTokenContract, "unstakedAllowance");
};

export const StakedAllowance = () => {
  const stakedTokenAddress = useStaticTokenContract(
    STAKED_TENDER_ADDRESSES[NetworkId.FANTOM_TESTNET],
    NetworkId.FANTOM_TESTNET,
  );
  return AllowanceHelper(stakedTokenAddress, "stakedAllowance");
};

export const WrappedAllowance = () => {
  const wrappedTokenAddress = useStaticTokenContract(
    WRAPPED_TENDER_ADDRESSES[NetworkId.FANTOM_TESTNET],
    NetworkId.FANTOM_TESTNET,
  );
  return AllowanceHelper(wrappedTokenAddress, "wrappedAllowance");
};

const AllowanceHelper = (contractAddress: IERC20, key: string) => {
  const { address } = useWeb3Context();
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(
    ["Allowance", address, key],
    async () => {
      if (!tenderEscrowContract) throw new Error("Token doesn't exist on current network. Please switch networks.");
      const data = await contractAddress.allowance(address, tenderEscrowContract.address);
      return parseBigNumber(data);
    },
    { enabled: !!contractAddress && !!tenderEscrowContract },
  );
  return data || 0;
};

export const Approve = () => {
  const { networkId } = useWeb3Context();
  const queryClient = useQueryClient();
  const tenderTokenContract = useDynamicTokenContract(TENDER_ADDRESSES, true);
  const stakedTokenContract = useDynamicTokenContract(STAKED_TENDER_ADDRESSES, true);
  const wrappedTokenContract = useDynamicTokenContract(WRAPPED_TENDER_ADDRESSES, true);
  const escrowAddress = TENDER_ESCROW_ADDRESSES[networkId];
  return useMutation(
    async (token: number) => {
      if (!tenderTokenContract) throw new Error("Token doesn't exist on current network. Please switch networks.");
      if (!stakedTokenContract) throw new Error("Token doesn't exist on current network. Please switch networks.");
      if (!wrappedTokenContract) throw new Error("Token doesn't exist on current network. Please switch networks.");
      const contractArray = [tenderTokenContract, stakedTokenContract, wrappedTokenContract];
      const data = await contractArray[token].approve(
        escrowAddress,
        ethers.utils.parseUnits("1000000000", token == 2 ? 18 : 9),
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
