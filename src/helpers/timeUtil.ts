import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useNetwork } from "wagmi";

export function prettifySecondsInDays(seconds: number): string {
  let prettifiedSeconds = "";
  if (seconds > 86400) {
    prettifiedSeconds = prettifySeconds(seconds, "day");
  } else {
    prettifiedSeconds = prettifySeconds(seconds);
  }
  return prettifiedSeconds;
}

export function prettifySeconds(seconds: number, resolution?: string) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

  let result = dDisplay + hDisplay + mDisplay;
  if (mDisplay === "") {
    result = result.slice(0, result.length - 2);
  }

  return result;
}

const getDateTimeFromBlockNumber = async (blockNumber: number, chainId: number) => {
  const provider = Providers.getStaticProvider(chainId);
  let dateTime;
  try {
    const block = await provider.getBlock(blockNumber);
    if (block.timestamp) {
      dateTime = DateTime.fromSeconds(block.timestamp);
    }
  } catch (e) {
    console.log("block error", e);
    dateTime = undefined;
  }
  return dateTime;
};

/** @return a luxon datetime */
export const useGetDateTimeFromBlockNumber = ({ blockNumber }: { blockNumber: string }) => {
  const { chain } = useNetwork();
  return useQuery<{ dateTime: DateTime | undefined; isInvalid: boolean }, Error>(
    ["getDateTimeFromBlockNumber", blockNumber, chain?.id],
    async () => {
      const dateTime = await getDateTimeFromBlockNumber(Number(blockNumber), chain?.id || 1);
      return { dateTime, isInvalid: !dateTime };
    },
    {
      enabled: !!chain,
      cacheTime: Number.POSITIVE_INFINITY,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
};
