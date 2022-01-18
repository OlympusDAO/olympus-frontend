import { getTokenPrice } from "./index";
import axios from "axios";
import { when, resetAllWhenMocks } from "jest-when";

beforeEach(() => {
  resetAllWhenMocks();
});

test("getTokenPrice returns expected value", async () => {
  const theSpiedMethod = jest.spyOn(axios, "get");
  const resp = { data: { coingeckoTicker: { value: 300 } } };
  when(theSpiedMethod).calledWith(expect.anything()).mockReturnValue(resp);
  let price = await getTokenPrice("olympus");
  expect(price).toEqual(300);
});

test("getTokenPrice returns 0 on remote call exceptions", async () => {
  const theSpiedMethod = jest.spyOn(axios, "get");
  when(theSpiedMethod)
    .calledWith(expect.anything())
    .mockImplementation(async () => {
      throw Error("Remote API down");
    });

  let price = await getTokenPrice("olympus");
  expect(price).toEqual(0);
});

test("getTokenPrice via api.olympusdao.finance (real)", async () => {
  const theSpiedMethod = jest.spyOn(axios, "get");
  when(theSpiedMethod)
    .calledWith(expect.stringMatching("https://api.coingecko.com"))
    .mockImplementation(async () => {
      throw Error("Should not reach this API call if OHM API works.");
    });

  let price = await getTokenPrice("olympus");
  expect(price).toBeGreaterThan(1);
});

test("getTokenPrice via api.olympusdao.finance (mock)", async () => {
  const resp = { data: { coingeckoTicker: { value: 356 } } };
  const theSpiedMethod = jest.spyOn(axios, "get");
  when(theSpiedMethod).calledWith(expect.stringMatching("https://api.olympusdao.finance")).mockReturnValue(resp);
  when(theSpiedMethod)
    .calledWith(expect.stringMatching("https://api.coingecko.com"))
    .mockImplementation(async () => {
      throw Error("Should not reach this API call if OHM API works.");
    });
  let price = await getTokenPrice("olympus");
  expect(price).toEqual(356);
});

test("getTokenPrice fallback via api.coingecko.com (real)", async () => {
  const theSpiedMethod = jest.spyOn(axios, "get");
  when(theSpiedMethod)
    .calledWith(expect.stringMatching("https://api.olympusdao.finance"))
    .mockImplementation(async () => {
      throw Error("Remote OHM API down");
    });

  let price = await getTokenPrice("olympus");
  expect(price).toBeGreaterThan(1);
});

test("getTokenPrice fallback via api.coingecko.com (mock)", async () => {
  const theSpiedMethod = jest.spyOn(axios, "get");
  when(theSpiedMethod)
    .calledWith(expect.stringMatching("https://api.olympusdao.finance"))
    .mockImplementation(async () => {
      throw Error("Remote OHM API down");
    });

  const resp = { data: { olympus: { usd: 478 } } };
  when(theSpiedMethod).calledWith(expect.stringMatching("https://api.coingecko.com")).mockReturnValue(resp);

  let price = await getTokenPrice("olympus");
  expect(price).toEqual(478);
});
