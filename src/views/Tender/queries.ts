import { ethers } from "ethers";
import { useMutation, useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { TENDER_ADDRESSES, TENDER_ESCROW_ADDRESSES } from "src/constants/addresses";
import { parseBigNumber } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useTenderEscrowContract, useTokenContract } from "src/hooks/useContract";
import { balancesOf } from "src/lib/fetchBalances";

export const Balance = (address: string) => {
  const tenderTokenContract = useTokenContract(TENDER_ADDRESSES);
  const { isLoading, data } = useQuery(
    ["tenderBalanceOf", address],
    async () => {
      if (tenderTokenContract && address) {
        const balance = await tenderTokenContract.balanceOf(address);
        return parseBigNumber(balance);
      }
    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false, enabled: !!tenderTokenContract && !!address },
  );
  return data;
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
        console.log(data);
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
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);
  const { data } = useQuery(["withdrawCall"], async () => {
    if (tenderEscrowContract) {
      const data = await tenderEscrowContract.withdraw();
      return data;
    }
  });
  return data;
};

export const Redeem = () => {
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES);

  const { data } = useQuery(
    ["RedeemCall"],
    async () => {
      if (tenderEscrowContract) {
        const data = await tenderEscrowContract.redeem();
        return data;
      }
    },
    { enabled: !!tenderEscrowContract },
  );
  return data;
};

export const Deposit = (quantity: number, redemptionToken: number) => {
  const { provider } = useWeb3Context();
  const signer = provider.getSigner();
  const tenderEscrowContract = useTenderEscrowContract(TENDER_ESCROW_ADDRESSES, signer);
  const amount = quantity * 1e9;
  return useMutation(() => {
    const data = tenderEscrowContract.deposit(amount, redemptionToken);
    return data;
  });
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
  const { provider, networkId } = useWeb3Context();
  const signer = provider.getSigner();
  const tenderTokenContract = useTokenContract(TENDER_ADDRESSES, signer);
  const escrowAddress = TENDER_ESCROW_ADDRESSES[networkId];
  return useMutation(() => {
    const data = tenderTokenContract?.approve(escrowAddress, ethers.utils.parseUnits("1000000000", "gwei").toString());
    return data;
  });
};
