import { i18n } from "@lingui/core";
import { cleanup } from "@testing-library/react";
// import * as matchers from "jest-extended";
import { en } from "make-plural/plurals";
import React from "react";
import { messages } from "src/locales/translations/olympus-frontend/en/messages";
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
  i18n.loadLocaleData("en", { plurals: en });
  i18n.load("en", messages);
  i18n.activate("en");
  // vi.mock("wagmi", async () => {
  //   const wagmiImport: any = await vi.importActual("wagmi");
  //   return {
  //     ...wagmiImport,
  //   };
  // });
});

afterEach(() => {
  cleanup();
});

/*
afterAll(() => {
});
 */
