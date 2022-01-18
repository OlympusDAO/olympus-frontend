import { getTokenPrice } from "./index";
import axios from "axios";

jest.mock("axios");

test("getTokenPrice returns expected value", async () => {
  const resp = { data: { coingeckoTicker: { value: 300 } } };
  axios.get.mockResolvedValue(resp);

  let price = await getTokenPrice("olympus");
  expect(price).toEqual(300);
});

test("getTokenPrice returns 0 on remote call exception", async () => {
  axios.get.mockImplementation(async () => {
    throw Error("Remote API down");
  });

  let price = await getTokenPrice("olympus");
  expect(price).toEqual(0);
});
