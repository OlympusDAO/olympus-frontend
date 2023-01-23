import { BigNumber } from "ethers";
import { RANGEv1 as OlympusRange } from "src/typechain/Range";

export const RangeData: OlympusRange.RangeStruct = {
  cushion: {
    high: {
      price: BigNumber.from("22161077252064087762"),
    },
    low: {
      price: BigNumber.from("18131790478961526351"),
    },
    spread: BigNumber.from("1000"),
  },
  high: {
    active: true,
    lastActive: 1656528651,
    capacity: BigNumber.from("605396958336933"), //9 decimals for OHM
    market: BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935"),
    threshold: BigNumber.from("6054147227010"),
  },
  low: {
    active: true,
    lastActive: 1656015227,
    capacity: BigNumber.from("10000000000000000000000000"), //18 decimals for Reserve
    market: BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935"),
    threshold: BigNumber.from("100000000000000000000000"),
  },
  wall: {
    low: { price: BigNumber.from("13117147092410245645") },
    high: { price: BigNumber.from("24175720638615368468") },
    spread: BigNumber.from(2000),
  },
};

export const ohmPriceHistory = [
  {
    price: "12422690000000000",
    timestamp: "1656706146",
  },
  {
    price: "12437540000000000",
    timestamp: "1656663030",
  },
  {
    price: "12410034672200176",
    timestamp: "1656662408",
  },
  {
    price: "12373563656037676",
    timestamp: "1656648170",
  },
  {
    price: "12119723247737458",
    timestamp: "1656642950",
  },
  {
    price: "12094736037947830",
    timestamp: "1656635658",
  },
  {
    price: "12388803000000000",
    timestamp: "1656633600",
  },
  {
    price: "12677302675926245",
    timestamp: "1656620665",
  },
];

export const reservePriceHistory = [
  [
    {
      price: "922880000000000",
      timestamp: "1656707202",
    },
    {
      price: "932337996953297",
      timestamp: "1656706663",
    },
    {
      price: "943563757672340",
      timestamp: "1656704519",
    },
    {
      price: "933947820524863",
      timestamp: "1656697415",
    },
    {
      price: "943390000000000",
      timestamp: "1656689009",
    },
    {
      price: "953033657245084",
      timestamp: "1656686150",
    },
    {
      price: "944518140157390",
      timestamp: "1656684828",
    },
    {
      price: "943136265529256",
      timestamp: "1656683247",
    },
  ],
];
export const PriceData = [
  {
    price: 13.460785800970875,
    timestamp: "7/1/2022, 3:09:06 PM",
  },
  {
    price: 13.340162087830285,
    timestamp: "7/1/2022, 3:10:30 AM",
  },
  {
    price: 13.15230112569633,
    timestamp: "7/1/2022, 3:00:08 AM",
  },
  {
    price: 13.248666985575213,
    timestamp: "6/30/2022, 11:02:50 PM",
  },
  {
    price: 12.846991432745162,
    timestamp: "6/30/2022, 9:35:50 PM",
  },
  {
    price: 12.690775342509781,
    timestamp: "6/30/2022, 7:34:18 PM",
  },
  {
    price: 13.116532624704899,
    timestamp: "6/30/2022, 7:00:00 PM",
  },
  {
    price: 13.44164479648354,
    timestamp: "6/30/2022, 3:24:25 PM",
  },
];
