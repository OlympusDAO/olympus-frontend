import { Environment } from "src/helpers/environment/Environment/Environment";
import { NetworkId } from "src/networkDetails";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.spyOn(console, "warn");
});

afterEach(() => {
  delete import.meta.env.VITE_GOOGLE_ANALYTICS_API_KEY;
  delete import.meta.env.VITE_GA_4_API_KEY;
  delete import.meta.env.VITE_COVALENT_API_KEY;
  delete import.meta.env.VITE_ZAPPER_API;
  vi.spyOn(console, "warn").mockReset();
});

describe("Environment", () => {
  describe("Google Analytics - Original", () => {
    it("should return a Google Analytics key", () => {
      import.meta.env.VITE_GOOGLE_ANALYTICS_API_KEY = "UA-123456789-1";
      expect(Environment.getGoogleAnalyticsApiKey()).toEqual("UA-123456789-1");
    });

    it("should return a Warning when Google Analytics key is not present", () => {
      expect(Environment.getGoogleAnalyticsApiKey()).toBeUndefined();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Please provide an Google Analytics API key in your .env file"),
      );
    });
  });

  describe("Google Analytics - GA4", () => {
    it("should return a GA4 key", () => {
      import.meta.env.VITE_GA_4_API_KEY = "G-ABCDEFGHIJ";
      expect(Environment.getGA4ApiKey()).toEqual("G-ABCDEFGHIJ");
    });

    it("should return a Warning when GA4 key is not present", () => {
      expect(Environment.getGA4ApiKey()).toBeUndefined();
      // assert the expected warning
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Please provide an Google Analytics 4 API key in your .env file"),
      );
    });
  });

  describe("Covalent", () => {
    it("should return a Covalent API key", () => {
      import.meta.env.VITE_COVALENT_API_KEY = "ckey_442d47723592868l8764adf15bf";
      expect(Environment.getCovalentApiKey()).toEqual("ckey_442d47723592868l8764adf15bf");
    });

    it("should return a Warning when Covalent API key is not present", () => {
      expect(Environment.getCovalentApiKey()).toBeUndefined();
      // assert the expected warning
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Please provide an API key for Covalent (https://www.covalenthq.com) in your .env file",
        ),
      );
    });
  });

  describe("Zapper", () => {
    it("should return a Zapper API key", () => {
      import.meta.env.VITE_ZAPPER_API = "somekey";
      expect(Environment.getZapperApiKey()).toEqual("somekey");
    });
  });

  describe("StagingEnv", () => {
    it("should return a StagingEnv", () => {
      import.meta.env.VITE_STAGING_ENV = "false";
      expect(Environment.getStagingFlag()).toEqual("false");

      import.meta.env.VITE_STAGING_ENV = "true";
      expect(Environment.getStagingFlag()).toEqual("true");
    });
  });

  describe("WalletNewsDisabled", () => {
    it("should return WalletNewsDisabled", () => {
      import.meta.env.VITE_DISABLE_NEWS = "true";
      expect(Environment.isWalletNewsEnabled()).toEqual(false);

      import.meta.env.VITE_DISABLE_NEWS = "false";
      expect(Environment.isWalletNewsEnabled()).toEqual(true);
    });
  });

  describe("Node URLs", () => {
    it("should return appropriate NodeURLs by default", () => {
      expect(Environment.getNodeUrls(NetworkId.MAINNET)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.TESTNET_GOERLI)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.ARBITRUM)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.ARBITRUM_TESTNET)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.AVALANCHE)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.AVALANCHE_TESTNET)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.POLYGON)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.POLYGON_TESTNET)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.FANTOM)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.FANTOM_TESTNET)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.OPTIMISM)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.OPTIMISM_TESTNET)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.BOBA)).not.toBeUndefined();
      expect(Environment.getNodeUrls(NetworkId.BOBA_TESTNET)).not.toBeUndefined();
    });
  });
});
