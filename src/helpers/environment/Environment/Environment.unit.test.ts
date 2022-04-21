import { Environment } from "./Environment";

beforeEach(() => {
  jest.spyOn(console, "warn").mockImplementation();
});

afterEach(() => {
  delete process.env.REACT_APP_GOOGLE_ANALYTICS_API_KEY;
  delete process.env.REACT_APP_GA_4_API_KEY;
  delete process.env.REACT_APP_COVALENT_API_KEY;
  jest.spyOn(console, "warn").mockReset();
});

describe("Environment", () => {
  describe("Google Analytics - Original", () => {
    it("should return a Google Analytics key", () => {
      process.env.REACT_APP_GOOGLE_ANALYTICS_API_KEY = "UA-123456789-1";
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
      process.env.REACT_APP_GA_4_API_KEY = "G-ABCDEFGHIJ";
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
      process.env.REACT_APP_COVALENT_API_KEY = "ckey_442d47723592868l8764adf15bf";
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
});
