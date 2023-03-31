import { chains } from "src/hooks/wagmi";
import { describe, expect, it } from "vitest";

describe("Chain object tests", () => {
  it("should return correct values for BOBA", () => {
    const boba = chains.find(chain => chain.id === 288);
    expect(boba).toBeDefined();
    expect(boba?.name).toEqual("Boba Network");
    expect(boba?.nativeCurrency?.symbol).toEqual("BOBA");
    expect(boba?.nativeCurrency?.decimals).toEqual(18);
    expect(boba?.rpcUrls?.default).toEqual("https://mainnet.boba.network");
    expect(boba?.testnet).toEqual(false);
  });

  it("should return correct values for Avalanche", () => {
    const avalanche = chains.find(chain => chain.id === 43114);
    expect(avalanche).toBeDefined();
    expect(avalanche?.name).toEqual("Avalanche");
    expect(avalanche?.nativeCurrency?.symbol).toEqual("AVAX");
    expect(avalanche?.nativeCurrency?.decimals).toEqual(18);
    expect(avalanche?.rpcUrls?.default).toEqual("https://rpc.ankr.com/avalanche");
  });

  it("should return correct values for Avalanche", () => {
    const fantom = chains.find(chain => chain.id === 250);
    expect(fantom).toBeDefined();
    expect(fantom?.name).toEqual("Fantom");
    expect(fantom?.nativeCurrency?.symbol).toEqual("FTM");
    expect(fantom?.nativeCurrency?.decimals).toEqual(18);
    expect(fantom?.rpcUrls?.default).toEqual("https://rpc.ankr.com/fantom");
  });

  it("should return correct values for Mainnet", () => {
    const mainnet = chains.find(chain => chain.id === 1);
    expect(mainnet).toBeDefined();
    expect(mainnet?.rpcUrls?.default).toEqual("https://rpc.ankr.com/eth");
  });

  it("should return correct values for Polygon", () => {
    const polygon = chains.find(chain => chain.id === 137);
    expect(polygon).toBeDefined();
    expect(polygon?.rpcUrls?.default).toEqual("https://rpc.ankr.com/polygon");
  });

  it("should return correct values for Optimism", () => {
    const optimism = chains.find(chain => chain.id === 10);
    expect(optimism).toBeDefined();
    expect(optimism?.rpcUrls?.default).toEqual("https://rpc.ankr.com/optimism");
  });

  it("should return correct values for Arbitrum", () => {
    const arbitrum = chains.find(chain => chain.id === 42161);
    expect(arbitrum).toBeDefined();
    expect(arbitrum?.rpcUrls?.default).toEqual("https://rpc.ankr.com/arbitrum");
  });
});
