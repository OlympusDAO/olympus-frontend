import { BigNumber } from "ethers";
import { NetworkId } from "src/constants";
import {
  BOND_DEPOSITORY_ADDRESSES,
  FIATDAO_WSOHM_ADDRESSES,
  FUSE_POOL_6_ADDRESSES,
  FUSE_POOL_18_ADDRESSES,
  FUSE_POOL_36_ADDRESSES,
  MIGRATOR_ADDRESSES,
  PT_PRIZE_POOL_ADDRESSES,
  STAKING_ADDRESSES,
  ZAP_ADDRESSES,
} from "src/constants/addresses";
import { OHM_TOKEN } from "src/constants/tokens";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { assert } from "src/helpers/types/assert";
import { CovalentTransaction } from "src/lib/covalent.types";

export interface Transaction {
  type: "bond" | "zap" | "staking" | "zap" | "migration" | "33together" | "borrow" | "transfer";
  token: Token;
  details: string;
  value: DecimalBigNumber;
  transaction: CovalentTransaction;
}

const isContract = (contractAddresses: Partial<Record<NetworkId, string>> | Token, address: string) =>
  Object.values(contractAddresses)
    .map(address => address.toLowerCase())
    .includes(address.toLowerCase());

export const interpretTransaction = (transactions: CovalentTransaction[], address: string) => {
  const results: Transaction[] = [];
  for (const transaction of transactions) {
    if (!transaction.log_events || transaction.log_events.length === 0) continue;

    assert(transaction.log_events, "Transactions w/o logs are ignored");
    const [first, second] = transaction.log_events;

    if (isContract(BOND_DEPOSITORY_ADDRESSES, transaction.to_address)) {
      if (first.decoded.params[1].value.toLowerCase() === address.toLowerCase())
        results.push({
          token: OHM_TOKEN,
          transaction,
          type: "bond",
          details: "Bond Claimed",
          value: new DecimalBigNumber(BigNumber.from(first.decoded.params[2].value), first.sender_contract_decimals),
        });
      else
        results.push({
          token: OHM_TOKEN,
          transaction,
          type: "bond",
          details: "Bond Purchased",
          value: new DecimalBigNumber(BigNumber.from(second.decoded.params[2].value), second.sender_contract_decimals),
        });
    }

    if (isContract(STAKING_ADDRESSES, transaction.to_address)) {
      if (isContract(STAKING_ADDRESSES, first.decoded.params[0].value) && isContract(OHM_TOKEN, first.sender_address))
        results.push({
          token: OHM_TOKEN,
          transaction,
          type: "staking",
          details: "Unstake",
          value: new DecimalBigNumber(BigNumber.from(first.decoded.params[2].value), first.sender_contract_decimals),
        });
      else
        results.push({
          token: OHM_TOKEN,
          transaction,
          type: "staking",
          details: "Stake",
          value: new DecimalBigNumber(BigNumber.from(first.decoded.params[2].value), first.sender_contract_decimals),
        });
    }

    if (isContract(ZAP_ADDRESSES, transaction.to_address))
      results.push({
        token: OHM_TOKEN,
        transaction,
        type: "zap",
        details: `Zap to ${second?.sender_contract_ticker_symbol}`,
        value: new DecimalBigNumber(BigNumber.from(second.decoded.params[2].value), second.sender_contract_decimals),
      });

    if (isContract(MIGRATOR_ADDRESSES, transaction.to_address))
      results.push({
        token: OHM_TOKEN,
        transaction,
        type: "migration",
        details: "Migration",
        value: new DecimalBigNumber(BigNumber.from(first.decoded.params[2].value), first.sender_contract_decimals),
      });

    if (isContract(PT_PRIZE_POOL_ADDRESSES, transaction.to_address))
      results.push({
        token: OHM_TOKEN,
        transaction,
        type: "33together",
        details: "33Together Claim",
        value: new DecimalBigNumber(BigNumber.from(second.decoded.params[2].value), second.sender_contract_decimals),
      });

    if (isContract(FUSE_POOL_36_ADDRESSES, transaction.to_address)) {
      const event = transaction.log_events.filter((event: { decoded: { name: string }; sender_address: string }) => {
        return (
          event.decoded.name == "Transfer" &&
          isContract(FUSE_POOL_36_ADDRESSES, event.sender_address) &&
          isContract(FUSE_POOL_18_ADDRESSES, event.sender_address) &&
          isContract(FUSE_POOL_6_ADDRESSES, event.sender_address)
        );
      });

      results.push({
        token: OHM_TOKEN,
        transaction,
        type: "borrow",
        details: "Supply to Fuse",
        value: new DecimalBigNumber(
          BigNumber.from(event[0]?.decoded.params[2].value),
          event[0]?.sender_contract_decimals,
        ),
      });
    }

    if (isContract(FIATDAO_WSOHM_ADDRESSES, transaction.to_address)) {
      if (isContract(FIATDAO_WSOHM_ADDRESSES, first.sender_address))
        results.push({
          token: OHM_TOKEN,
          transaction,
          type: "staking",
          details: "FiatDAO Withdraw",
          value: new DecimalBigNumber(BigNumber.from(first.decoded.params[2].value), second.sender_contract_decimals),
        });
      else
        results.push({
          token: OHM_TOKEN,
          transaction,
          type: "staking",
          details: "FiatDAO Deposit",
          value: new DecimalBigNumber(BigNumber.from(first.decoded.params[2].value), second.sender_contract_decimals),
        });
    }
  }

  return results;
};
