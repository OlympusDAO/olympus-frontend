import axios from "axios";
import { resetAllWhenMocks, when } from "jest-when";

import { getTokenPrice } from "./index";

beforeEach(() => {
  resetAllWhenMocks(); //
});

test("getTokenPrice returns expected value", async () => {
  const theSpiedMethod = jest.spyOn(axios, "get");
  const resp = { data: { olympus: { usd: 300 } } };
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
