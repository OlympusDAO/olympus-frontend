import { rest } from "msw";

// We use msw to intercept the network request during the test
const handlers = [
  rest.get("https://api.coingecko.com/api/v3/simple/price", (req, res, ctx) => {
    return res(ctx.json({ olympus: { usd: 945.14 } }));
  }),
  rest.post("https://ipaddress/:port", (req, res, ctx) => {
    return res(ctx.json({}));
  }),
  rest.get("https://api.covalenthq.com/*", (req, res, ctx) => {
    return res(ctx.json({}));
  }),
  rest.post("https://api.thegraph.com/subgraphs/name/drondin/olympus-graph", (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          _meta: {
            __typename: "_Meta_",
            block: {
              __typename: "_Block_",
              number: 13404804,
            },
          },
          protocolMetrics: [
            {
              __typename: "ProtocolMetric",
              marketCap: "2850404741.408880328568714963827889",
              nextDistributedOhm: "9536.348673867",
              nextEpochRebase: "0.3984399885022833379898967937151319",
              ohmCirculatingSupply: "2606164.580244948",
              ohmPrice: "1093.716322835212771836103791185812",
              sOhmCirculatingSupply: "2393421.581431541",
              timestamp: "1633996882",
              totalSupply: "3217915.76256185",
              totalValueLocked: "2617724251.037744790511990363550964",
            },
          ],
        },
      }),
      // ctx.delay(150),
    );
  }),
];

// override render method
export default handlers;
