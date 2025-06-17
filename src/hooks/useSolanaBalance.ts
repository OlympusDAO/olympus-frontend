import {
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { SVM_OHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const useSolanaOhmBalance = (
  networkId?: NetworkId.SOLANA | NetworkId.SOLANA_DEVNET,
): UseQueryResult<DecimalBigNumber, Error> => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  return useQuery<DecimalBigNumber, Error>(
    ["useSolanaOhmBalance", publicKey?.toString(), networkId],
    async () => {
      if (!publicKey || !networkId) {
        return new DecimalBigNumber("0", 9);
      }

      const tokenMintAddress = SVM_OHM_ADDRESSES[networkId];
      console.log("tokenMintAddress", tokenMintAddress);
      if (!tokenMintAddress) {
        return new DecimalBigNumber("0", 9);
      }

      try {
        const tokenMint = new PublicKey(tokenMintAddress);

        // Try both token programs
        let associatedTokenAccount;
        let tokenProgram = TOKEN_PROGRAM_ID;

        try {
          associatedTokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey, false, TOKEN_PROGRAM_ID);
          await getAccount(connection, associatedTokenAccount, "confirmed", TOKEN_PROGRAM_ID);
        } catch (error) {
          // Try with TOKEN_2022_PROGRAM_ID
          tokenProgram = TOKEN_2022_PROGRAM_ID;
          associatedTokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey, false, TOKEN_2022_PROGRAM_ID);
        }

        const tokenAccount = await getAccount(connection, associatedTokenAccount, "confirmed", tokenProgram);

        // Get the actual decimals from the mint
        const mintInfo = await getMint(connection, tokenMint, "confirmed", tokenProgram);

        console.log("Raw tokenAccount.amount:", tokenAccount.amount.toString());
        console.log("Mint decimals:", mintInfo.decimals);

        // Use the actual decimals from the mint
        return new DecimalBigNumber(tokenAccount.amount.toString(), mintInfo.decimals);
      } catch (error) {
        console.debug("Solana OHM balance fetch error:", error);
        return new DecimalBigNumber("0", 9);
      }
    },
    {
      enabled: !!publicKey && !!networkId,
    },
  );
};
