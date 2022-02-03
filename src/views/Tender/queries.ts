import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { TENDER_ADDRESSES } from "src/constants/addresses";
import { parseBigNumber } from "src/helpers";
import { useTokenContract } from "src/hooks/useContract";
import { balancesOf } from "src/lib/fetchBalances";
//TODO Add tenderEscrowContract

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
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
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

//TODO: Replace with gohmExchangeRate Contract Call
export const GOhmExchangeRate = () => {
  const { data } = useQuery(["gOhmExchangeRate"], () => {
    return 55;
  });
  return data;
};

//TODO: Replace with daiExchangeRate  Call
export const DaiExchangeRate = () => {
  const { data } = useQuery(["daiExchangeRate"], () => {
    return 50;
  });
  return data;
};

//TODO: Replace with deposits Contract Call
//Call deposit. Should return amount of Token Deposited.
export const Deposits = (address: string) => {
  const { data } = useQuery(["deposits", address], () => {
    return {
      amount: 10, // amount of tender tokens (18 decimals)
      index: 77, // OHM index
      ohmPrice: 62, // OHM / USD price
      choice: 1, // 0 - DAI, 1 - gOHM
      didRedeem: false,
    };
  });
  return { ...data };
};

//TODO: Replace with totalDeposits Contract Call
export const TotalDeposits = () => {
  const { data } = useQuery(["totalDeposits"], () => {
    return 500000;
  });
  return data;
};

//TODO: Replace with maxDeposits Contract Call
export const MaxDeposits = () => {
  const { data } = useQuery(["maxDeposits"], () => {
    return 970000;
  });
  return data;
};

//TODO: Replace with daiExchangeRate Contract Call
export const EscrowState = () => {
  const { data } = useQuery(["escrowStateCall"], () => {
    return "PENDING";
  });
  return data;
};

//TODO: Replace with withdraw Contract Call
export const Withdraw = () => {
  const { data } = useQuery(["withdrawCall"], () => {
    return "";
  });
  return data;
};

//TODO: Replace with withdraw Contract Call
export const Redeem = () => {
  const { data } = useQuery(["RedeemCall"], () => {
    return "";
  });
  return data;
};

//TODO: Replace with Deposits Contract Call
export const Deposit = (quantity: number, redemptionToken: boolean) => {
  const { data } = useQuery(["DepositsCall"], () => {
    return "";
  });
  return data;
};
