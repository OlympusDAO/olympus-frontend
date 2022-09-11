import { cleanup } from "@testing-library/react";
// import * as matchers from "jest-extended";
import React from "react";
import { afterEach, beforeEach, vi } from "vitest";

//expect.extend(matchers);

//@ts-ignore
global.CSS = { supports: vi.fn() };

//vi.setTimeout(20000);
beforeEach(() => {
  vi.mock("src/components/ConnectButton/ConnectButton", () => ({
    ConnectButton: vi.fn().mockReturnValue(<>Connect Wallet</>),
    InPageConnectButton: vi.fn().mockReturnValue(<>Connect Wallet</>),
  }));
  vi.mock("@rainbow-me/rainbowkit", () => ({
    RainbowKitProvider: vi.fn(),
    wallet: {
      metaMask: vi.fn(),
      brave: vi.fn(),
      rainbow: vi.fn(),
      walletConnect: vi.fn(),
      coinbase: vi.fn(),
    },
    connectorsForWallets: vi.fn(),
    darkTheme: vi.fn().mockReturnValue({}),
    lightTheme: vi.fn().mockReturnValue({}),
    ConnectButton: vi.fn().mockReturnValue({
      Custom: vi.fn(),
    }),
  }));
});

afterEach(() => {
  cleanup();
});

/*
afterAll(() => {
});
 */
