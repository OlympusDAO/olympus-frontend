import {
  bondClaimTransaction,
  bondPurchaseTransaction,
  stakeTransaction,
  supplyToFuseTransaction,
  unstakeTransaction,
} from "src/components/TopBar/Wallet/__mocks__/mockTransactionHistory";
import Wallet from "src/components/TopBar/Wallet/index";
import * as queries from "src/components/TopBar/Wallet/queries";
import { fireEvent, render, screen } from "src/testUtils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("<TransactionHistory />", () => {
  describe("Show no transactions", () => {
    beforeEach(() => {
      const useTransactionHistory = vi.spyOn(queries, "useTransactionHistory");
      useTransactionHistory.mockReturnValue({ data: { pages: [[]] }, isFetched: true });

      const useTransferHistory = vi.spyOn(queries, "useTransferHistory");
      useTransferHistory.mockReturnValue({ data: { pages: [[]] }, isFetched: true });
      render(<Wallet component="wallet/history" open />);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });
    it("Should show no transaction history", () => {
      expect(screen.getByText("No transactions"));
    });

    it("Should filter the list when clicking on Staking", () => {
      fireEvent.click(screen.getByText("Staking"));
      expect(screen.getByText("No transactions"));
    });
  });

  describe("Show important transactions", () => {
    beforeEach(() => {
      const useTransactionHistory = vi.spyOn(queries, "useTransactionHistory");
      useTransactionHistory.mockReturnValue({
        data: {
          pages: [
            [
              stakeTransaction,
              unstakeTransaction,
              supplyToFuseTransaction,
              bondClaimTransaction,
              bondPurchaseTransaction,
            ],
          ],
        },
        isFetched: true,
      });

      const useTransferHistory = vi.spyOn(queries, "useTransferHistory");
      useTransferHistory.mockReturnValue({ data: { pages: [[]] }, isFetched: true });

      render(<Wallet component="wallet/history" open />);
    });

    it("Should display an unstake transaction", () => {
      expect(screen.getByText("Unstake"));
    });

    it("Should display a stake transaction", () => {
      expect(screen.getByText("Stake"));
    });

    it("Should display a bond purchased transaction", () => {
      expect(screen.getByText("Bond Purchased"));
    });

    it("Should display a bond claimed transaction", () => {
      expect(screen.getByText("Bond Claimed"));
    });

    it("Should display a fuse supply transaction", () => {
      expect(screen.getByText("Supply to Fuse"));
    });
  });
});
