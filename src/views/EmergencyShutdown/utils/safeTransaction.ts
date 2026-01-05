import { ethers } from "ethers";

/**
 * Safe Transaction Service API URLs per network
 * @see https://docs.safe.global/core-api/transaction-service-overview
 */
export const SAFE_TX_SERVICE_URLS: Record<number, string> = {
  1: "https://safe-transaction-mainnet.safe.global/api/v1",
  11155111: "https://safe-transaction-sepolia.safe.global/api/v1",
  42161: "https://safe-transaction-arbitrum.safe.global/api/v1",
  8453: "https://safe-transaction-base.safe.global/api/v1",
  10: "https://safe-transaction-optimism.safe.global/api/v1",
};

/**
 * Safe App URL for viewing transactions
 */
export const SAFE_APP_URLS: Record<number, string> = {
  1: "https://app.safe.global/eth:",
  11155111: "https://app.safe.global/sep:",
  42161: "https://app.safe.global/arb1:",
  8453: "https://app.safe.global/base:",
  10: "https://app.safe.global/oeth:",
};

/**
 * MultiSend contract addresses (same on most networks)
 * @see https://github.com/safe-global/safe-deployments
 */
export const MULTISEND_ADDRESS = "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761";

/**
 * Operation types for Safe transactions
 */
export enum OperationType {
  Call = 0,
  DelegateCall = 1,
}

/**
 * Safe transaction data structure
 */
export interface SafeTransactionData {
  to: string;
  value: string;
  data: string;
  operation: OperationType;
  safeTxGas: string;
  baseGas: string;
  gasPrice: string;
  gasToken: string;
  refundReceiver: string;
  nonce: number;
}

/**
 * MetaTransaction for MultiSend batching
 */
export interface MetaTransaction {
  to: string;
  value: string;
  data: string;
  operation: OperationType;
}

/**
 * Encodes multiple transactions for MultiSend
 *
 * @param transactions - Array of meta transactions
 * @returns Encoded MultiSend data
 */
export function encodeMultiSendData(transactions: MetaTransaction[]): string {
  return (
    "0x" +
    transactions
      .map(tx => {
        const data = ethers.utils.arrayify(tx.data);
        const encoded = ethers.utils.solidityPack(
          ["uint8", "address", "uint256", "uint256", "bytes"],
          [tx.operation, tx.to, tx.value, data.length, data],
        );
        return encoded.slice(2);
      })
      .join("")
  );
}

/**
 * Builds MultiSend transaction data
 *
 * @param transactions - Array of meta transactions to batch
 * @returns Transaction data for MultiSend call
 */
export function buildMultiSendTx(transactions: MetaTransaction[]): MetaTransaction {
  const multiSendInterface = new ethers.utils.Interface([
    "function multiSend(bytes memory transactions) public payable",
  ]);

  const encodedTxs = encodeMultiSendData(transactions);
  const data = multiSendInterface.encodeFunctionData("multiSend", [encodedTxs]);

  return {
    to: MULTISEND_ADDRESS,
    value: "0",
    data,
    operation: OperationType.DelegateCall, // MultiSend must use DelegateCall
  };
}

/**
 * Calculates the Safe transaction hash (EIP-712)
 *
 * @param safeAddress - Safe contract address
 * @param tx - Transaction data
 * @param chainId - Chain ID
 * @returns Transaction hash to sign
 */
export function calculateSafeTxHash(safeAddress: string, tx: SafeTransactionData, chainId: number): string {
  const SAFE_TX_TYPEHASH = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(
      "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)",
    ),
  );

  const DOMAIN_SEPARATOR_TYPEHASH = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("EIP712Domain(uint256 chainId,address verifyingContract)"),
  );

  const domainSeparator = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "uint256", "address"],
      [DOMAIN_SEPARATOR_TYPEHASH, chainId, safeAddress],
    ),
  );

  const safeTxHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      [
        "bytes32",
        "address",
        "uint256",
        "bytes32",
        "uint8",
        "uint256",
        "uint256",
        "uint256",
        "address",
        "address",
        "uint256",
      ],
      [
        SAFE_TX_TYPEHASH,
        tx.to,
        tx.value,
        ethers.utils.keccak256(tx.data),
        tx.operation,
        tx.safeTxGas,
        tx.baseGas,
        tx.gasPrice,
        tx.gasToken,
        tx.refundReceiver,
        tx.nonce,
      ],
    ),
  );

  return ethers.utils.keccak256(
    ethers.utils.solidityPack(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      ["0x19", "0x01", domainSeparator, safeTxHash],
    ),
  );
}

/**
 * Fetches the current nonce for a Safe
 *
 * @param safeAddress - Safe contract address
 * @param chainId - Chain ID
 * @returns Current nonce
 */
export async function getSafeNonce(safeAddress: string, chainId: number): Promise<number> {
  const baseUrl = SAFE_TX_SERVICE_URLS[chainId];
  if (!baseUrl) throw new Error(`Unsupported chain ID: ${chainId}`);

  const response = await fetch(`${baseUrl}/safes/${safeAddress}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Safe info: ${response.statusText}`);
  }

  const data = await response.json();
  return data.nonce;
}

/**
 * Proposes a transaction to the Safe Transaction Service
 *
 * @param safeAddress - Safe contract address
 * @param tx - Transaction data
 * @param signature - Owner signature
 * @param senderAddress - Address of the signer
 * @param chainId - Chain ID
 * @returns Safe transaction hash
 */
export async function proposeTransaction(
  safeAddress: string,
  tx: SafeTransactionData,
  safeTxHash: string,
  signature: string,
  senderAddress: string,
  chainId: number,
): Promise<string> {
  const baseUrl = SAFE_TX_SERVICE_URLS[chainId];
  if (!baseUrl) throw new Error(`Unsupported chain ID: ${chainId}`);

  const payload = {
    to: tx.to,
    value: tx.value,
    data: tx.data,
    operation: tx.operation,
    safeTxGas: tx.safeTxGas,
    baseGas: tx.baseGas,
    gasPrice: tx.gasPrice,
    gasToken: tx.gasToken,
    refundReceiver: tx.refundReceiver,
    nonce: tx.nonce,
    contractTransactionHash: safeTxHash,
    sender: senderAddress,
    signature,
    origin: "Olympus Emergency Shutdown Dashboard",
  };

  const response = await fetch(`${baseUrl}/safes/${safeAddress}/multisig-transactions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to propose transaction: ${error}`);
  }

  return safeTxHash;
}

/**
 * Gets the Safe App URL for a transaction
 *
 * @param safeAddress - Safe contract address
 * @param safeTxHash - Safe transaction hash
 * @param chainId - Chain ID
 * @returns URL to view transaction in Safe App
 */
export function getSafeAppTxUrl(safeAddress: string, safeTxHash: string, chainId: number): string {
  const baseUrl = SAFE_APP_URLS[chainId];
  if (!baseUrl) return "";
  return `${baseUrl}${safeAddress}/transactions/tx?id=multisig_${safeAddress}_${safeTxHash}`;
}
