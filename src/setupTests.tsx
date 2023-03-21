import { cleanup } from "@testing-library/react";
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
  vi.mock("recharts", () => ({
    default: vi.fn(),
    ComposedChart: vi.fn(),
    LineChart: vi.fn(),
    Line: vi.fn(),
    XAxis: vi.fn(),
    YAxis: vi.fn(),
    Tooltip: vi.fn(),
    ResponsiveContainer: vi.fn(),
    Area: vi.fn(),
    AreaChart: vi.fn(),
  }));
  vi.mock("history", () => ({
    length: vi.fn(),
    action: vi.fn(),
    location: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    goBack: vi.fn(),
    goForward: vi.fn(),
    block: vi.fn(),
    listen: vi.fn(),
    createHref: vi.fn(),
  }));

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  cleanup();
});

/*
afterAll(() => {
});
 */
