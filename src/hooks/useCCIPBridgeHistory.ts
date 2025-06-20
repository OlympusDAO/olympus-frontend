import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { CCIP_BRIDGE_ADDRESSES } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";
import { CCIPBridge__factory } from "src/typechain";
import { useAccount, useBlockNumber, useNetwork, useSigner } from "wagmi";

export interface ICCIPHistoryTx {
  messageId: string;
  timestamp: string;
  amount: string;
  txHash: string;
  fromChain: string;
  toChain: string;
  fromAddress: string;
  toAddress: string;
  status: "pending" | "success" | "failed";
  ccipExplorerUrl: string;
  isUnixTimestamp?: boolean; // Flag to indicate if timestamp is Unix timestamp vs block number
}

interface CCIPBridgeHistoryParams {
  sendingChain: number;
  receivingChain: number;
}

export const useCCIPBridgeHistory = ({ sendingChain, receivingChain }: CCIPBridgeHistoryParams) => {
  const { address } = useAccount();
  const { publicKey } = useWallet();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { data: blockNumber } = useBlockNumber({ chainId: sendingChain });

  // Determine if we're dealing with CCIP bridge (to/from Solana)
  const isCCIPBridge =
    sendingChain === NetworkId.SOLANA ||
    sendingChain === NetworkId.SOLANA_DEVNET ||
    receivingChain === NetworkId.SOLANA ||
    receivingChain === NetworkId.SOLANA_DEVNET;

  // Determine bridge type
  const isEVMToSVM =
    sendingChain !== NetworkId.SOLANA &&
    sendingChain !== NetworkId.SOLANA_DEVNET &&
    (receivingChain === NetworkId.SOLANA || receivingChain === NetworkId.SOLANA_DEVNET);

  const isSVMToEVM =
    (sendingChain === NetworkId.SOLANA || sendingChain === NetworkId.SOLANA_DEVNET) &&
    receivingChain !== NetworkId.SOLANA &&
    receivingChain !== NetworkId.SOLANA_DEVNET;

  const getCCIPBridgeAddress = (chainId: number) => {
    return CCIP_BRIDGE_ADDRESSES[chainId as keyof typeof CCIP_BRIDGE_ADDRESSES];
  };

  const fetchCCIPHistory = async (): Promise<ICCIPHistoryTx[]> => {
    if (!isCCIPBridge) return [];

    // For EVM to SVM: get transactions from current EOA to EVM CCIP bridge address
    if (isEVMToSVM && address && signer) {
      const bridgeAddress = getCCIPBridgeAddress(sendingChain);
      if (!bridgeAddress) return [];

      return fetchEVMTransactionsToCCIPBridge(address, bridgeAddress, sendingChain, signer, blockNumber);
    }

    // For SVM to EVM: get transactions from SVM address to Solana CCIP bridge address
    if (isSVMToEVM && publicKey) {
      const bridgeAddress = getCCIPBridgeAddress(sendingChain);
      if (!bridgeAddress) return [];

      return fetchSolanaTransactionsToCCIPBridge(publicKey.toBase58(), bridgeAddress, sendingChain);
    }

    return [];
  };

  return useQuery<ICCIPHistoryTx[], Error>(
    ["ccipBridgeHistory", sendingChain, receivingChain, address, publicKey?.toBase58()],
    fetchCCIPHistory,
    {
      enabled: isCCIPBridge && (!!address || !!publicKey) && (!!signer || !!publicKey),
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  );
};

// Helper function to fetch EVM transactions to CCIP bridge
const fetchEVMTransactionsToCCIPBridge = async (
  userAddress: string,
  bridgeAddress: string,
  chainId: number,
  signer: ethers.Signer,
  currentBlockNumber?: number,
): Promise<ICCIPHistoryTx[]> => {
  try {
    const contract = CCIPBridge__factory.connect(bridgeAddress, signer);

    // Calculate from block (go back ~1 week for most chains, less for chains with block limits)
    let fromBlockNumber: number | undefined;
    if (chainId === NetworkId.BERACHAIN || chainId === NetworkId.BERACHAIN_TESTNET) {
      fromBlockNumber = currentBlockNumber && currentBlockNumber - 10000;
    } else {
      // Go back approximately 1 week (assuming ~12 second block times)
      fromBlockNumber = currentBlockNumber && currentBlockNumber - 50400; // ~7 days
    }

    // Get Bridged events (outgoing transactions)
    const bridgedFilter = contract.filters.Bridged(null, null, userAddress, null, null);
    const bridgedEvents = await contract.queryFilter(bridgedFilter, fromBlockNumber);

    // Get Received events (incoming transactions)
    const receivedFilter = contract.filters.Received(null, null, userAddress, null);
    const receivedEvents = await contract.queryFilter(receivedFilter, fromBlockNumber);

    const transactions: ICCIPHistoryTx[] = [];

    // Process bridged (outgoing) events
    for (const event of bridgedEvents) {
      if (event.args) {
        const chainName = getChainName(chainId);
        const destinationChainName = getChainNameFromSelector(event.args.destinationChainSelector.toString());

        transactions.push({
          messageId: event.args.messageId,
          timestamp: event.blockNumber.toString(),
          amount: ethers.utils.formatUnits(event.args.amount, 9), // OHM has 9 decimals
          txHash: event.transactionHash,
          fromChain: chainName,
          toChain: destinationChainName,
          fromAddress: userAddress,
          toAddress: "", // Would need to decode from event data
          status: "success", // Events only appear if successful
          ccipExplorerUrl: getCCIPExplorerUrl(event.transactionHash),
        });
      }
    }

    // Process received (incoming) events
    for (const event of receivedEvents) {
      if (event.args) {
        const chainName = getChainName(chainId);
        const sourceChainName = getChainNameFromSelector(event.args.sourceChainSelector.toString());

        transactions.push({
          messageId: event.args.messageId,
          timestamp: event.blockNumber.toString(),
          amount: ethers.utils.formatUnits(event.args.amount, 9), // OHM has 9 decimals
          txHash: event.transactionHash,
          fromChain: sourceChainName,
          toChain: chainName,
          fromAddress: "", // Would need to decode from sender bytes
          toAddress: userAddress,
          status: "success", // Events only appear if successful
          ccipExplorerUrl: getCCIPExplorerUrl(event.transactionHash),
        });
      }
    }

    return transactions.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
  } catch (error) {
    console.error(`Error fetching EVM CCIP history for chain ${chainId}:`, error);
    return [];
  }
};

// Helper function to fetch Solana transactions to CCIP bridge
const fetchSolanaTransactionsToCCIPBridge = async (
  userAddress: string,
  bridgeAddress: string,
  chainId: number,
): Promise<ICCIPHistoryTx[]> => {
  try {
    // Determine Solana RPC endpoint
    const endpoint =
      chainId === NetworkId.SOLANA_DEVNET ? "https://api.devnet.solana.com" : "https://solana-rpc.publicnode.com";

    const connection = new Connection(endpoint);
    const userPublicKey = new PublicKey(userAddress);
    const bridgePublicKey = new PublicKey(bridgeAddress);

    // Get transaction signatures involving the user and bridge program
    const signatures = await connection.getSignaturesForAddress(userPublicKey, {
      limit: 100, // Last 100 transactions
    });

    const transactions: ICCIPHistoryTx[] = [];

    // Filter and process relevant transactions
    for (const signatureInfo of signatures) {
      try {
        const transaction = await connection.getTransaction(signatureInfo.signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (!transaction) continue;

        // Check if transaction involves the bridge program
        // Handle both legacy and versioned transactions, including those with lookup tables
        let involvesBridge = false;
        try {
          // Try to get account keys - this works for transactions without lookup tables
          const accountKeys = transaction.transaction.message.getAccountKeys();
          involvesBridge = accountKeys.staticAccountKeys.some((key: PublicKey) => key.equals(bridgePublicKey));
        } catch (error) {
          // For transactions with unresolved lookup tables, check static accounts only
          console.warn(
            `Unable to resolve account keys for transaction ${signatureInfo.signature}, checking static accounts only`,
          );
          const message = transaction.transaction.message;
          if ("staticAccountKeys" in message) {
            involvesBridge = message.staticAccountKeys.some((key: PublicKey) => key.equals(bridgePublicKey));
          } else if ("accountKeys" in message) {
            // For legacy transactions
            involvesBridge = (message as any).accountKeys.some((key: PublicKey) => key.equals(bridgePublicKey));
          }
        }

        if (!involvesBridge) continue;

        // Determine transaction type and extract relevant data
        const chainName = getChainName(chainId);

        // Try to parse basic transaction details
        let amount = "0";
        let toChain = "Unknown";

        // Parse transaction data to extract actual amounts and destination chain
        try {
          // Look for token transfer amounts in the transaction
          const parsedAmount = await parseTokenAmountFromSolanaTransaction(transaction, connection);
          if (parsedAmount !== null) {
            amount = parsedAmount;
          } else {
            // If we can't parse the amount, use a placeholder but log it for debugging
            console.warn(`Could not parse token amount for transaction ${signatureInfo.signature}, using placeholder`);
            amount = "0.0"; // Changed from hardcoded 1.0 to 0.0 to indicate unknown
          }

          // Try to determine destination chain from transaction logs or instruction data
          const destChain = parseDestinationChainFromSolanaTransaction(transaction);
          if (destChain) {
            toChain = destChain;
          }
        } catch (error) {
          console.warn(`Could not parse instruction data for transaction ${signatureInfo.signature}:`, error);
          // Ensure we have some amount even on error
          if (amount === "0") {
            amount = "0.0";
          }
        }

        transactions.push({
          messageId: signatureInfo.signature,
          timestamp: signatureInfo.blockTime ? (signatureInfo.blockTime * 1000).toString() : Date.now().toString(), // Convert to milliseconds
          amount,
          txHash: signatureInfo.signature,
          fromChain: chainName,
          toChain,
          fromAddress: userAddress,
          toAddress: "", // Would need to parse from instruction data
          status: signatureInfo.err ? "failed" : "success",
          ccipExplorerUrl: getCCIPExplorerUrl(signatureInfo.signature),
          isUnixTimestamp: true, // Mark as Unix timestamp for proper formatting
        });
      } catch (error) {
        console.error(`Error processing Solana transaction ${signatureInfo.signature}:`, error);
        continue;
      }
    }

    return transactions;
  } catch (error) {
    console.error(`Error fetching Solana CCIP history for chain ${chainId}:`, error);
    return [];
  }
};

// Helper function to parse token amount from Solana transaction
const parseTokenAmountFromSolanaTransaction = async (
  transaction: any,
  connection: Connection,
): Promise<string | null> => {
  try {
    // Look for token balance changes in pre/post token balances
    const preTokenBalances = transaction.meta?.preTokenBalances || [];
    const postTokenBalances = transaction.meta?.postTokenBalances || [];

    // Find token balance changes (this is a simplified approach)
    for (let i = 0; i < preTokenBalances.length; i++) {
      const preBal = preTokenBalances[i];
      const postBal = postTokenBalances.find((pb: any) => pb.accountIndex === preBal.accountIndex);

      if (postBal && preBal.uiTokenAmount && postBal.uiTokenAmount) {
        const preAmount = parseFloat(preBal.uiTokenAmount.uiAmountString || "0");
        const postAmount = parseFloat(postBal.uiTokenAmount.uiAmountString || "0");
        const difference = Math.abs(preAmount - postAmount);

        // If there's a significant difference, this is likely the transfer amount
        if (difference > 0) {
          return difference.toString();
        }
      }
    }

    // Alternative: Look for SPL token transfer instructions
    const message = transaction.transaction.message;
    const accountKeys = message.staticAccountKeys || message.accountKeys || [];

    // Check for SPL token program instructions
    const instructions = message.instructions || message.compiledInstructions || [];
    for (const instruction of instructions) {
      // Check if this is an SPL Token program instruction
      const programId = accountKeys[instruction.programIdIndex];
      if (programId && programId.toString() === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
        // This is an SPL token instruction - we'd need to decode the specific instruction data
        // For now, return null to indicate we couldn't parse it
        break;
      }
    }

    return null;
  } catch (error) {
    console.warn("Error parsing token amount from Solana transaction:", error);
    return null;
  }
};

// Helper function to parse destination chain from Solana transaction
const parseDestinationChainFromSolanaTransaction = (transaction: any): string | null => {
  try {
    // Look for CCIP-specific logs or instruction data that might contain destination chain info
    const logs = transaction.meta?.logMessages || [];

    // Search for logs that might contain destination chain information
    for (const log of logs) {
      if (typeof log === "string") {
        // Look for patterns that might indicate destination chain
        if (log.includes("ethereum") || log.includes("Ethereum")) {
          return "Ethereum";
        }
        if (log.includes("arbitrum") || log.includes("Arbitrum")) {
          return "Arbitrum";
        }
        if (log.includes("base") || log.includes("Base")) {
          return "Base";
        }
        if (log.includes("sepolia") || log.includes("Sepolia")) {
          return "Sepolia";
        }
      }
    }

    // Default fallback - could be enhanced with proper instruction data parsing
    return "Ethereum";
  } catch (error) {
    console.warn("Error parsing destination chain from Solana transaction:", error);
    return "Ethereum"; // Default fallback
  }
};

// Helper function to generate CCIP explorer URL
export const getCCIPExplorerUrl = (txHash: string): string => {
  return `https://ccip.chain.link/tx/${txHash}`;
};

// Helper function to get chain name from chain ID
const getChainName = (chainId: number): string => {
  switch (chainId) {
    case NetworkId.MAINNET:
      return "Ethereum";
    case NetworkId.ARBITRUM:
      return "Arbitrum";
    case NetworkId.BASE:
      return "Base";
    case NetworkId.SEPOLIA:
      return "Sepolia";
    case NetworkId.SOLANA:
      return "Solana";
    case NetworkId.SOLANA_DEVNET:
      return "Solana Devnet";
    default:
      return `Chain ${chainId}`;
  }
};

// Helper function to get chain name from CCIP chain selector
const getChainNameFromSelector = (selector: string): string => {
  // Map common CCIP selectors to chain names
  // These would need to be updated with actual CCIP selectors
  switch (selector) {
    case "5009297550715157269": // Ethereum mainnet
      return "Ethereum";
    case "4949039107694359620": // Arbitrum
      return "Arbitrum";
    case "16423721717087811551": // Solana devnet
      return "Solana Devnet";
    case "124615329519749607": // Solana mainnet
      return "Solana";
    default:
      return `Chain ${selector}`;
  }
};
