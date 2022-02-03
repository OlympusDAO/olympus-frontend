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
      if (tenderTokenContract) {
        const testing = await tenderTokenContract.balanceOf(address);
        return parseBigNumber(testing);
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
      const bal = await balancesOf(address, NetworkId.FANTOM);
      const chicken = bal.find(address => address.contractAddress === TENDER_ADDRESSES[NetworkId.FANTOM]);
      if (chicken && parseInt(chicken.balance) > 0) {
        return true;
      }
      return false;
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
//Call deposits. Should return amount of Token Deposited.
export const Deposits = (address: string) => {
  const { data } = useQuery(["deposits", address], () => {
    return 10;
  });
  return data;
};

//TODO: Replace with Redeemable Balance Contract Call
//How much of which token can I claim? Which Function to use?
export const RedeemableBalance = (address: string) => {
  const { data } = useQuery(["redeemableBalance", address], () => {
    return 0;
  });
  return data;
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
