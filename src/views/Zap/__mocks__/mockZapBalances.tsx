export const zapAPIResponse = {
  balances: {
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266": {
      products: [
        {
          label: "Tokens",
          assets: [
            {
              hide: false,
              type: "base",
              network: "ethereum",
              address: "0x6b175474e89094c44da98b954eedeac495271d0f",
              decimals: 18,
              symbol: "DAI",
              price: 0.998646,
              balance: 10000,
              balanceRaw: "10000",
              balanceUSD: 10000.0,
              displayProps: {
                images: [
                  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png",
                ],
              },
            },
            {
              hide: false,
              type: "base",
              network: "ethereum",
              address: "0x0000000000000000000000000000000000000000",
              decimals: 18,
              symbol: "ETH",
              price: 3397.72,
              balance: 1,
              balanceRaw: "1",
              balanceUSD: 3397.72,
              displayProps: {
                images: [
                  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png",
                ],
              },
            },
            {
              hide: false,
              type: "base",
              network: "ethereum",
              address: "0x0000000000000000000000000000000000000000",
              decimals: 18,
              symbol: "OHM",
              price: "30",
              balance: 10,
              balanceRaw: "10",
              balanceUSD: 300,
              displayProps: {
                images: [
                  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png",
                ],
              },
            },
          ],
          meta: [],
        },
      ],
      meta: [
        {
          label: "Total",
          value: 10000,
          type: "dollar",
        },
        {
          label: "Assets",
          value: 10000,
          type: "dollar",
        },
        {
          label: "Debt",
          value: 0,
          type: "dollar",
        },
      ],
    },
  },
};
