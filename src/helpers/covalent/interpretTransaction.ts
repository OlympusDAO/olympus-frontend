import { BigNumber } from "ethers";
import {
  BOND_DEPOSITORY_CONTRACT,
  FIATDAO_WSOHM_CONTRACT,
  FUSE_POOL_6_CONTRACT,
  FUSE_POOL_18_CONTRACT,
  FUSE_POOL_36_CONTRACT,
  MIGRATOR_CONTRACT,
  PT_PRIZE_POOL_CONTRACT,
  STAKING_CONTRACT,
  ZAP_CONTRACT,
} from "src/constants/contracts";
import { OHM_TOKEN } from "src/constants/tokens";
import { CovalentTransaction } from "src/lib/covalent.types";

import { Contract } from "../contracts/Contract";
import { Token } from "../contracts/Token";
import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";
import { assert } from "../types/assert";

export interface Transaction {
  type: "bond" | "zap" | "staking" | "zap" | "migration" | "33together" | "borrow" | "transfer";
  token: Token;
  details: string;
  value: DecimalBigNumber;
  transaction: CovalentTransaction;
}

const isContract = (contract: Contract | Token, address: string) =>
  Object.values(contract.addresses)
    .map(address => address.toLowerCase())
    .includes(address.toLowerCase());

export const interpretTransaction = (transactions: CovalentTransaction[], address: string) => {
  const results: Transaction[] = [];

  for (const transaction of transactions) {
    if (!transaction.log_events || transaction.log_events.length === 0) continue;

    assert(transaction.log_events, "Transactions w/o logs are ignored");
    const [first, second] = transaction.log_events;

    if (isContract(BOND_DEPOSITORY_CONTRACT, transaction.to_address)) {
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

    if (isContract(STAKING_CONTRACT, transaction.to_address)) {
      if (isContract(STAKING_CONTRACT, first.decoded.params[0].value) && isContract(OHM_TOKEN, first.sender_address))
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

    if (isContract(ZAP_CONTRACT, transaction.to_address))
      results.push({
        token: OHM_TOKEN,
        transaction,
        type: "zap",
        details: `Zap to ${second?.sender_contract_ticker_symbol}`,
        value: new DecimalBigNumber(BigNumber.from(second.decoded.params[2].value), second.sender_contract_decimals),
      });

    if (isContract(MIGRATOR_CONTRACT, transaction.to_address))
      results.push({
        token: OHM_TOKEN,
        transaction,
        type: "migration",
        details: "Migration",
        value: new DecimalBigNumber(BigNumber.from(first.decoded.params[2].value), first.sender_contract_decimals),
      });

    if (isContract(PT_PRIZE_POOL_CONTRACT, transaction.to_address))
      results.push({
        token: OHM_TOKEN,
        transaction,
        type: "33together",
        details: "33Together Claim",
        value: new DecimalBigNumber(BigNumber.from(second.decoded.params[2].value), second.sender_contract_decimals),
      });

    if (isContract(FUSE_POOL_36_CONTRACT, transaction.to_address)) {
      const event = transaction.log_events.filter((event: { decoded: { name: string }; sender_address: string }) => {
        return (
          event.decoded.name == "Transfer" &&
          isContract(FUSE_POOL_36_CONTRACT, event.sender_address) &&
          isContract(FUSE_POOL_18_CONTRACT, event.sender_address) &&
          isContract(FUSE_POOL_6_CONTRACT, event.sender_address)
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

    if (isContract(FIATDAO_WSOHM_CONTRACT, transaction.to_address)) {
      if (isContract(FIATDAO_WSOHM_CONTRACT, first.sender_address))
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
