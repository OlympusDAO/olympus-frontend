import React from "react";
import Wallet from "src/components/TopBar/Wallet/index";
import { render, screen } from "src/testUtils";
import { beforeEach, describe, expect, it, vi } from "vitest";

// describe("Wallet Drawer Disconnected", () => {
//   it("Default State Should Prompt to Connect Wallet", async () => {
//     render(<Wallet component="wallet" open={true} />);
//     expect(screen.getByText("Please Connect Your Wallet"));
//   });

//   it("Should Display Utility View", async () => {
//     render(<Wallet component="utility" open={true} />);
//     expect(screen.getByText("Exchanges"));
//     expect(screen.getByText("Farm Pool"));
//   });

//   it("Should Display Info View", async () => {
//     render(<Wallet component="info" open={true} />);
//     expect(screen.getByText("Votes"));
//   });
// });

describe("Wallet Drawer Connected", () => {
  beforeEach(() => {
    vi.mock("wagmi", async () => {
      const wagmiImport: any = await vi.importActual("wagmi");
      return {
        ...wagmiImport,
        useAccount: vi.fn().mockReturnValue({
          address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          isConnected: true,
          error: null,
          fetchStatus: "idle",
          internal: {
            dataUpdatedAt: 1654570110046,
            errorUpdatedAt: 0,
            failureCount: 0,
            isFetchedAfterMount: true,
            isLoadingError: false,
            isPaused: false,
            isPlaceholderData: false,
            isPreviousData: false,
            isRefetchError: false,
            isStale: true,
          },
          isError: false,
          isFetched: true,
          isFetching: false,
          isIdle: false,
          isLoading: false,
          isRefetching: false,
          isSuccess: true,
          refetch: vi.fn(),
          status: "success",
        }),
      };
    });
  });
  it("Default State Should Prompt to Connect Wallet", async () => {
    // console.log(test, "test");
    render(<Wallet component="wallet" open={true} />);
    expect(screen.getByText("My Wallet"));
    expect(screen.getByText("Disconnect"));
  });
});
