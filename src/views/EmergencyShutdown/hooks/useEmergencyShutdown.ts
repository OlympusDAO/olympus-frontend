import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { ChainAddresses, EmergencyCall, EmergencyComponent } from "src/generated/emergency";
import * as ABIs from "src/generated/emergency";
import {
  buildMultiSendTx,
  calculateSafeTxHash,
  getSafeAppTxUrl,
  getSafeNonce,
  MetaTransaction,
  OperationType,
  proposeTransaction,
  SAFE_TX_SERVICE_URLS,
  SafeTransactionData,
} from "src/views/EmergencyShutdown/utils/safeTransaction";
import { useAccount, useNetwork, useSigner } from "wagmi";

/**
 * ABI mapping from abiKey to actual ABI
 */
const ABI_MAP: Record<string, ethers.ContractInterface> = {
  emergency: ABIs.emergencyAbi,
  cooler_v2: ABIs.coolerV2Abi,
  heart: ABIs.heartAbi,
  emission_manager: ABIs.emissionManagerAbi,
  cross_chain_bridge: ABIs.crossChainBridgeAbi,
  periphery_enabler: ABIs.peripheryEnablerAbi,
  reserve_migrator: ABIs.reserveMigratorAbi,
  yield_repurchase_facility: ABIs.yieldRepurchaseFacilityAbi,
  bond_manager: ABIs.bondManagerAbi,
};

interface UseEmergencyShutdownParams {
  component: EmergencyComponent;
  chainAddresses: ChainAddresses | undefined;
  safeAddress: string;
}

interface ShutdownResult {
  safeTxHash: string;
  safeAppUrl: string;
}

/**
 * Encodes a single emergency call to calldata
 */
function encodeEmergencyCall(call: EmergencyCall): string {
  const abi = ABI_MAP[call.abiKey];
  if (!abi) {
    throw new Error(`Unknown ABI key: ${call.abiKey}`);
  }

  // @ts-ignore
  const iface = new ethers.utils.Interface(abi as ethers.ContractInterface);

  // Handle args - convert empty strings to "0x" for bytes parameters
  const args = call.args.map(arg => (arg === "" ? "0x" : arg));

  try {
    return iface.encodeFunctionData(call.functionName, args);
  } catch (error) {
    console.error(`Failed to encode ${call.functionName}:`, error);
    throw new Error(`Failed to encode ${call.functionName}: ${error}`);
  }
}

/**
 * Builds MetaTransactions from emergency component calls
 */
function buildMetaTransactions(component: EmergencyComponent, chainAddresses: ChainAddresses): MetaTransaction[] {
  return component.calls.map(call => {
    const contractAddress = chainAddresses[call.contractKey];
    if (!contractAddress) {
      throw new Error(`Contract address not found for key: ${call.contractKey}`);
    }

    const data = encodeEmergencyCall(call);

    return {
      to: contractAddress,
      value: "0",
      data,
      operation: OperationType.Call,
    };
  });
}

/**
 * Hook for executing emergency shutdown via Safe multisig
 *
 * Flow:
 * 1. Build calldata for each emergency call
 * 2. Batch into MultiSend if multiple calls
 * 3. Get current Safe nonce
 * 4. Build Safe transaction data
 * 5. Calculate Safe transaction hash (EIP-712)
 * 6. Sign the hash with connected wallet
 * 7. Propose to Safe Transaction Service
 * 8. Return Safe App URL to view/execute transaction
 */
export const useEmergencyShutdown = ({ component, chainAddresses, safeAddress }: UseEmergencyShutdownParams) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  return useMutation<ShutdownResult, Error, void>({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected");
      if (!chain) throw new Error("Chain not detected");
      if (!signer) throw new Error("Signer not available");
      if (!chainAddresses) throw new Error("Chain addresses not available");
      if (!SAFE_TX_SERVICE_URLS[chain.id])
        throw new Error(`Chain ${chain.id} not supported by Safe Transaction Service`);

      const chainId = chain.id;

      // Step 1: Build meta transactions
      console.log("Building transactions for", component.name);
      const metaTxs = buildMetaTransactions(component, chainAddresses);
      console.log("Built", metaTxs.length, "transactions");

      // Step 2: Determine final transaction (single or batched)
      let finalTx: MetaTransaction;
      if (metaTxs.length === 1) {
        finalTx = metaTxs[0];
      } else {
        // Use MultiSend for batching
        finalTx = buildMultiSendTx(metaTxs);
        console.log("Batched into MultiSend transaction");
      }

      // Step 3: Get current Safe nonce
      console.log("Fetching Safe nonce...");
      const nonce = await getSafeNonce(safeAddress, chainId);
      console.log("Safe nonce:", nonce);

      // Step 4: Build Safe transaction data
      const safeTxData: SafeTransactionData = {
        to: finalTx.to,
        value: finalTx.value,
        data: finalTx.data,
        operation: finalTx.operation,
        safeTxGas: "0",
        baseGas: "0",
        gasPrice: "0",
        gasToken: ethers.constants.AddressZero,
        refundReceiver: ethers.constants.AddressZero,
        nonce,
      };

      // Step 5: Calculate Safe transaction hash
      const safeTxHash = calculateSafeTxHash(safeAddress, safeTxData, chainId);
      console.log("Safe transaction hash:", safeTxHash);

      // Step 6: Sign the hash using eth_sign
      const signature = await signer.signMessage(ethers.utils.arrayify(safeTxHash));

      // Adjust signature for Safe (add 4 to v for eth_sign)
      const adjustedSig = adjustSignatureForSafe(signature);

      // Step 7: Propose to Safe Transaction Service
      await proposeTransaction(safeAddress, safeTxData, safeTxHash, adjustedSig, address, chainId);
      console.log("Transaction proposed successfully!");

      // Step 8: Return result with Safe App URL
      const safeAppUrl = getSafeAppTxUrl(safeAddress, safeTxHash, chainId);

      return {
        safeTxHash,
        safeAppUrl,
      };
    },
    onSuccess: data => {
      toast.success(`Transaction proposed to Safe! Hash: ${data.safeTxHash.slice(0, 10)}...`, { duration: 10000 });
    },
    onError: error => {
      console.error("Emergency shutdown failed:", error);
      toast.error(`Failed to propose transaction: ${error.message}`);
    },
  });
};

/**
 * Adjusts signature for Safe's expected format
 * Safe expects v to be adjusted for eth_sign signatures
 */
function adjustSignatureForSafe(signature: string): string {
  // Safe uses v + 4 for eth_sign signatures (v=31 or v=32 instead of v=27 or v=28)
  // ethers.utils.joinSignature normalizes v back to 27/28, so we manually adjust the last byte
  const sig = ethers.utils.splitSignature(signature);
  const adjustedV = sig.v + 4; // 27 -> 31 or 28 -> 32

  // Manually construct the signature with adjusted v
  // Signature format: r (32 bytes) + s (32 bytes) + v (1 byte) = 65 bytes
  const r = sig.r;
  const s = sig.s;
  const vHex = adjustedV.toString(16).padStart(2, "0");

  return r + s.slice(2) + vHex;
}
