import { BN } from "@coral-xyz/anchor";
import * as borsh from "@coral-xyz/borsh";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createApproveInstruction,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  AccountMeta,
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { utils as ethersUtils } from "ethers";
import { NetworkId } from "src/constants";
import {
  CCIP_BRIDGE_ADDRESSES,
  CCIP_FEE_QUOTER_ADDRESSES,
  CCIP_LINK_TOKEN_ADDRESSES,
  CCIP_RMN_REMOTE_ADDRESSES,
  SVM_OHM_ADDRESSES,
} from "src/constants/addresses";
import { solanaChainIdsFromEVM } from "src/views/Bridge/helpers";

// CCIP Configuration Types
interface CCIPCoreConfig {
  ccipRouterProgramId: PublicKey;
  feeQuoterProgramId: PublicKey;
  rmnRemoteProgramId: PublicKey;
  linkTokenMint: PublicKey;
}

interface CCIPTokenAmount {
  token: PublicKey;
  amount: BN;
}

interface CCIPSendRequest {
  receiver: Uint8Array;
  data: Uint8Array;
  tokenAmounts: CCIPTokenAmount[];
  feeToken: PublicKey;
  extraArgs: Uint8Array;
  destChainSelector: BN;
}

interface CCIPContext {
  provider: {
    connection: any;
    getAddress: () => PublicKey;
    signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>;
  };
  config: CCIPCoreConfig;
  logger: CCIPLogger;
}

interface CCIPLogger {
  info: (msg: string) => void;
  debug: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
  trace: (msg: string, data?: any) => void;
}

interface TokenAdminRegistry {
  lookupTable: PublicKey;
  writableIndexes: BN[];
}

// CCIP Types from starter kit
interface SVMTokenAmountFields {
  token: PublicKey;
  amount: BN;
}

interface SVM2AnyMessageFields {
  receiver: Uint8Array;
  data: Uint8Array;
  tokenAmounts: Array<SVMTokenAmountFields>;
  feeToken: PublicKey;
  extraArgs: Uint8Array;
}

interface CcipSendArgs {
  destChainSelector: BN;
  message: SVM2AnyMessageFields;
  tokenIndexes: Uint8Array;
}

interface CcipSendAccounts {
  config: PublicKey;
  destChainState: PublicKey;
  nonce: PublicKey;
  authority: PublicKey;
  systemProgram: PublicKey;
  feeTokenProgram: PublicKey;
  feeTokenMint: PublicKey;
  feeTokenUserAssociatedAccount: PublicKey;
  feeTokenReceiver: PublicKey;
  feeBillingSigner: PublicKey;
  feeQuoter: PublicKey;
  feeQuoterConfig: PublicKey;
  feeQuoterDestChain: PublicKey;
  feeQuoterBillingTokenConfig: PublicKey;
  feeQuoterLinkTokenConfig: PublicKey;
  rmnRemote: PublicKey;
  rmnRemoteCurses: PublicKey;
  rmnRemoteConfig: PublicKey;
}

// Helper function to determine network from CCIP router address
function getNetworkFromCCIPRouter(ccipRouter: string): NetworkId {
  if (ccipRouter === CCIP_BRIDGE_ADDRESSES[NetworkId.SOLANA_DEVNET]) {
    return NetworkId.SOLANA_DEVNET;
  } else if (ccipRouter === CCIP_BRIDGE_ADDRESSES[NetworkId.SOLANA]) {
    return NetworkId.SOLANA;
  }
  // Default to devnet for development
  return NetworkId.SOLANA_DEVNET;
}

// Helper function to get CCIP program addresses for a given network
function getCCIPProgramAddresses(networkId: NetworkId) {
  const feeQuoterAddress = CCIP_FEE_QUOTER_ADDRESSES[NetworkId.SOLANA];
  const rmnRemoteAddress = CCIP_RMN_REMOTE_ADDRESSES[NetworkId.SOLANA];
  const linkTokenAddress = CCIP_LINK_TOKEN_ADDRESSES[NetworkId.SOLANA];

  if (!feeQuoterAddress || !rmnRemoteAddress || !linkTokenAddress) {
    throw new Error(`CCIP program addresses not configured for network: ${networkId}`);
  }

  return {
    feeQuoterProgramId: new PublicKey(feeQuoterAddress),
    rmnRemoteProgramId: new PublicKey(rmnRemoteAddress),
    linkTokenMint: new PublicKey(linkTokenAddress),
  };
}

const createLogger = (): CCIPLogger => ({
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  debug: (msg: string) => console.log(`[DEBUG] ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  trace: (msg: string, data?: any) => console.log(`[TRACE] ${msg}`, data || ""),
});

// PDA derivation utilities
const findConfigPDA = (programId: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
};

const findDestChainStatePDA = (destChainSelector: bigint, programId: PublicKey): [PublicKey, number] => {
  const selectorBuffer = bigIntToLEBuffer(destChainSelector);
  return PublicKey.findProgramAddressSync([Buffer.from("dest_chain_state"), selectorBuffer], programId);
};

const findNoncePDA = (destChainSelector: bigint, authority: PublicKey, programId: PublicKey): [PublicKey, number] => {
  const selectorBuffer = bigIntToLEBuffer(destChainSelector);
  return PublicKey.findProgramAddressSync([Buffer.from("nonce"), selectorBuffer, authority.toBuffer()], programId);
};

const findFeeBillingSignerPDA = (programId: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync([Buffer.from("fee_billing_signer")], programId);
};

const findFqConfigPDA = (programId: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
};

const findFqDestChainPDA = (destChainSelector: bigint, programId: PublicKey): [PublicKey, number] => {
  const selectorBuffer = bigIntToLEBuffer(destChainSelector);
  return PublicKey.findProgramAddressSync([Buffer.from("dest_chain"), selectorBuffer], programId);
};

const findFqBillingTokenConfigPDA = (tokenMint: PublicKey, programId: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync([Buffer.from("fee_billing_token_config"), tokenMint.toBuffer()], programId);
};

const findFqPerChainPerTokenConfigPDA = (
  destChainSelector: bigint,
  tokenMint: PublicKey,
  programId: PublicKey,
): [PublicKey, number] => {
  const selectorBuffer = bigIntToLEBuffer(destChainSelector);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("per_chain_per_token_config"), selectorBuffer, tokenMint.toBuffer()],
    programId,
  );
};

const findRMNRemoteCursesPDA = (programId: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync([Buffer.from("curses")], programId);
};

const findRMNRemoteConfigPDA = (programId: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
};

const findTokenPoolChainConfigPDA = (
  destChainSelector: bigint,
  tokenMint: PublicKey,
  poolProgram: PublicKey,
): [PublicKey, number] => {
  const selectorBuffer = bigIntToLEBuffer(destChainSelector);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("ccip_tokenpool_chainconfig"), selectorBuffer, tokenMint.toBuffer()],
    poolProgram,
  );
};

// Utility function to convert bigint to little-endian buffer (cross-platform)
function bigIntToLEBuffer(value: bigint): Uint8Array {
  const buffer = new Uint8Array(8);
  let n = value;
  for (let i = 0; i < 8; i++) {
    buffer[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return buffer;
}

// Fetch lookup table account from chain
async function fetchLookupTableAccount(
  connection: any,
  lookupTableAddress: PublicKey,
  logger: CCIPLogger,
): Promise<AddressLookupTableAccount> {
  logger.debug(`Fetching lookup table: ${lookupTableAddress.toString()}`);

  const { value: lookupTableAccount } = await connection.getAddressLookupTable(lookupTableAddress);

  if (!lookupTableAccount) {
    throw new Error(`Lookup table not found: ${lookupTableAddress.toString()}`);
  }

  if (lookupTableAccount.state.addresses.length < 7) {
    throw new Error(
      `Lookup table has insufficient accounts: ${lookupTableAccount.state.addresses.length} (needs at least 7)`,
    );
  }

  logger.trace(`Lookup table fetched with ${lookupTableAccount.state.addresses.length} addresses`);

  // Log all addresses in the lookup table with their indexes
  logger.info(`Lookup table addresses for ${lookupTableAddress.toString()}:`);
  lookupTableAccount.state.addresses.forEach((address: PublicKey, index: number) => {
    logger.info(`Index ${index}: ${address.toString()}`);
  });

  return lookupTableAccount;
}

// Extract pool program from lookup table addresses
function getPoolProgram(lookupTableAddresses: PublicKey[], logger: CCIPLogger): PublicKey {
  // The pool program is at index 2 in the lookup table
  if (lookupTableAddresses.length <= 2) {
    throw new Error("Lookup table doesn't have enough entries to determine pool program");
  }

  const poolProgram = lookupTableAddresses[2];
  logger.debug(`Using pool program: ${poolProgram.toString()} (index 2 in lookup table)`);

  return poolProgram;
}

// Encode extraArgs for CCIP using the correct format from starter kit
function encodeExtraArgs(gasLimit = 0, allowOutOfOrderExecution = true): Uint8Array {
  // Use the GENERIC_EXTRA_ARGS_V2_TAG which is bytes4(keccak256("CCIP EVMExtraArgsV2"))
  // 0x181dcf10 in big-endian format
  const typeTag = new Uint8Array([0x18, 0x1d, 0xcf, 0x10]);

  // Convert gas limit to little-endian bytes (Anchor uses little endian) - 16 bytes for u128
  const gasLimitLE = new Uint8Array(16);
  const gasLimitBN = new BN(gasLimit);
  const gasLimitBytes = gasLimitBN.toArray("le", 16);
  gasLimitLE.set(gasLimitBytes, 0);

  // Create bool byte for allowOutOfOrderExecution (1 = true, 0 = false)
  const allowOutOfOrderExecutionByte = new Uint8Array([allowOutOfOrderExecution ? 1 : 0]);

  // Concatenate: typeTag + gasLimit (LE) + allowOutOfOrderExecution
  const totalLength = typeTag.length + gasLimitLE.length + allowOutOfOrderExecutionByte.length;
  const result = new Uint8Array(totalLength);
  let offset = 0;

  result.set(typeTag, offset);
  offset += typeTag.length;

  result.set(gasLimitLE, offset);
  offset += gasLimitLE.length;

  result.set(allowOutOfOrderExecutionByte, offset);

  return result;
}

// Real account reader implementation based on CCIP starter kit
class CCIPAccountReader {
  constructor(
    private connection: any,
    private programId: PublicKey,
    private logger: CCIPLogger,
  ) {}

  async getTokenAdminRegistry(tokenMint: PublicKey): Promise<TokenAdminRegistry> {
    try {
      this.logger.debug(`Fetching token admin registry for mint: ${tokenMint.toString()}`);

      // Find the Token Admin Registry PDA using the same pattern as starter kit
      const [tokenAdminRegistryPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("token_admin_registry"), tokenMint.toBuffer()],
        this.programId,
      );

      this.logger.trace(`Token admin registry PDA: ${tokenAdminRegistryPDA.toString()}`);

      // Fetch the account info from chain
      const accountInfo = await this.connection.getAccountInfo(tokenAdminRegistryPDA);

      if (!accountInfo) {
        throw new Error(`Token admin registry not found for mint: ${tokenMint.toString()}`);
      }

      if (!accountInfo.owner.equals(this.programId)) {
        throw new Error("Token admin registry account doesn't belong to CCIP router program");
      }

      // Decode the account data (simplified - in production you'd use proper borsh decoding)
      // For now, we'll extract the key fields we need
      const data = accountInfo.data;

      // Skip discriminator (8 bytes) and version (1 byte) to get to the important data
      // According to the starter kit layout:
      // - discriminator: 8 bytes
      // - version: 1 byte
      // - administrator: 32 bytes
      // - pendingAdministrator: 32 bytes
      // - lookupTable: 32 bytes (this is what we need!)
      // - writableIndexes: 32 bytes (2 x 16-byte BN values)
      // - mint: 32 bytes

      const lookupTableOffset = 8 + 1 + 32 + 32; // Skip discriminator, version, admin, pending admin
      const lookupTableBytes = data.slice(lookupTableOffset, lookupTableOffset + 32);
      const lookupTable = new PublicKey(lookupTableBytes);

      // Extract writable indexes (simplified - assumes they start right after lookupTable)
      const writableIndexesOffset = lookupTableOffset + 32;
      const writableIndexesBytes = data.slice(writableIndexesOffset, writableIndexesOffset + 32);

      // For now, create a simple BN array (in production you'd properly decode the u128 array)
      const writableIndexes = [new BN(writableIndexesBytes.slice(0, 16), "le")];

      this.logger.trace("Retrieved token admin registry:", {
        pda: tokenAdminRegistryPDA.toString(),
        mint: tokenMint.toString(),
        lookupTable: lookupTable.toString(),
      });

      return {
        lookupTable,
        writableIndexes,
      };
    } catch (error) {
      this.logger.error(`Error fetching token admin registry: ${error}`);
      throw new Error(`Failed to fetch token admin registry for ${tokenMint.toString()}: ${error}`);
    }
  }
}

// Build core CCIP send accounts
async function buildCCIPSendAccounts(
  config: CCIPCoreConfig,
  selectorBigInt: bigint,
  request: CCIPSendRequest,
  feeTokenMint: PublicKey,
  feeTokenProgramId: PublicKey,
  isNativeSol: boolean,
  signerPublicKey: PublicKey,
  logger: CCIPLogger,
): Promise<{
  authority: PublicKey;
  config: PublicKey;
  destChainState: PublicKey;
  nonce: PublicKey;
  systemProgram: PublicKey;
  feeTokenProgram: PublicKey;
  feeTokenMint: PublicKey;
  feeTokenUserAssociatedAccount: PublicKey;
  feeTokenReceiver: PublicKey;
  feeBillingSigner: PublicKey;
  feeQuoter: PublicKey;
  feeQuoterConfig: PublicKey;
  feeQuoterDestChain: PublicKey;
  feeQuoterBillingTokenConfig: PublicKey;
  feeQuoterLinkTokenConfig: PublicKey;
  rmnRemote: PublicKey;
  rmnRemoteCurses: PublicKey;
  rmnRemoteConfig: PublicKey;
}> {
  logger.info(`Building accounts for CCIP send to chain ${selectorBigInt.toString()}`);

  // Find all the PDAs needed for the ccipSend instruction
  const [configPDA] = findConfigPDA(config.ccipRouterProgramId);
  const [destChainState] = findDestChainStatePDA(selectorBigInt, config.ccipRouterProgramId);
  const [nonce] = findNoncePDA(selectorBigInt, signerPublicKey, config.ccipRouterProgramId);
  const [feeBillingSigner] = findFeeBillingSignerPDA(config.ccipRouterProgramId);
  const [feeQuoterConfig] = findFqConfigPDA(config.feeQuoterProgramId);
  const [fqDestChain] = findFqDestChainPDA(selectorBigInt, config.feeQuoterProgramId);
  const [fqBillingTokenConfig] = findFqBillingTokenConfigPDA(feeTokenMint, config.feeQuoterProgramId);
  const [fqLinkBillingTokenConfig] = findFqBillingTokenConfigPDA(config.linkTokenMint, config.feeQuoterProgramId);
  const [rmnRemoteCurses] = findRMNRemoteCursesPDA(config.rmnRemoteProgramId);
  const [rmnRemoteConfig] = findRMNRemoteConfigPDA(config.rmnRemoteProgramId);

  // Get the associated token accounts for the user and fee billing signer
  const userFeeTokenAccount = isNativeSol
    ? PublicKey.default // For native SOL we use the default public key
    : await getAssociatedTokenAddress(
        feeTokenMint,
        signerPublicKey,
        true,
        feeTokenProgramId,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

  const feeBillingSignerFeeTokenAccount = await getAssociatedTokenAddress(
    feeTokenMint,
    feeBillingSigner,
    true,
    feeTokenProgramId,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  return {
    authority: signerPublicKey,
    config: configPDA,
    destChainState: destChainState,
    nonce: nonce,
    systemProgram: SystemProgram.programId,
    feeTokenProgram: feeTokenProgramId,
    feeTokenMint: feeTokenMint,
    feeTokenUserAssociatedAccount: userFeeTokenAccount,
    feeTokenReceiver: feeBillingSignerFeeTokenAccount,
    feeBillingSigner: feeBillingSigner,
    feeQuoter: config.feeQuoterProgramId,
    feeQuoterConfig: feeQuoterConfig,
    feeQuoterDestChain: fqDestChain,
    feeQuoterBillingTokenConfig: fqBillingTokenConfig,
    feeQuoterLinkTokenConfig: fqLinkBillingTokenConfig,
    rmnRemote: config.rmnRemoteProgramId,
    rmnRemoteCurses: rmnRemoteCurses,
    rmnRemoteConfig: rmnRemoteConfig,
  };
}

// Build token-specific accounts
async function buildTokenAccountsForSend(
  request: CCIPSendRequest,
  connection: any,
  accountReader: CCIPAccountReader,
  logger: CCIPLogger,
  config: CCIPCoreConfig,
  signerPublicKey: PublicKey,
): Promise<{
  tokenIndexes: number[];
  remainingAccounts: AccountMeta[];
  lookupTableList: AddressLookupTableAccount[];
}> {
  logger.debug(`Building token accounts for ${request.tokenAmounts.length} tokens`);

  const tokenIndexes: number[] = [];
  const remainingAccounts: AccountMeta[] = [];
  const lookupTableList: AddressLookupTableAccount[] = [];
  let lastIndex = 0;

  // Process each token amount
  for (const tokenAmount of request.tokenAmounts) {
    const tokenMint = tokenAmount.token;
    logger.debug(`Processing token: ${tokenMint.toString()}, amount: ${tokenAmount.amount.toString()}`);

    // Determine token program from token mint
    let tokenProgram = TOKEN_PROGRAM_ID;
    try {
      const tokenMintInfo = await connection.getAccountInfo(tokenMint);
      if (tokenMintInfo) {
        tokenProgram = tokenMintInfo.owner;
      } else {
        tokenProgram = TOKEN_2022_PROGRAM_ID;
      }
    } catch (error) {
      logger.warn(`Error determining token program, using fallback: ${error}`);
      tokenProgram = TOKEN_2022_PROGRAM_ID;
    }

    // Get token admin registry for this token
    const tokenAdminRegistry = await accountReader.getTokenAdminRegistry(tokenMint);

    // Fetch the real lookup table from chain
    const lookupTableAccount = await fetchLookupTableAccount(connection, tokenAdminRegistry.lookupTable, logger);
    lookupTableList.push(lookupTableAccount);

    // Get user token account
    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      signerPublicKey,
      true,
      tokenProgram,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Get token chain config
    const [tokenBillingConfig] = findFqPerChainPerTokenConfigPDA(
      BigInt(request.destChainSelector.toString()),
      tokenMint,
      config.feeQuoterProgramId,
    );

    // Get pool chain config - using the pool program from lookup table
    const poolProgram = getPoolProgram(lookupTableAccount.state.addresses, logger);
    const [poolChainConfig] = findTokenPoolChainConfigPDA(
      BigInt(request.destChainSelector.toString()),
      tokenMint,
      poolProgram,
    );

    // Build token accounts using lookup table
    const tokenAccounts = buildTokenLookupAccounts(
      userTokenAccount,
      tokenBillingConfig,
      poolChainConfig,
      lookupTableAccount.state.addresses,
      tokenAdminRegistry.writableIndexes,
      logger,
    );

    tokenIndexes.push(lastIndex);
    const currentLen = tokenAccounts.length;
    lastIndex += currentLen;
    remainingAccounts.push(...tokenAccounts);

    logger.debug(`Added ${currentLen} token-specific accounts for ${tokenMint.toString()}`);
  }

  return { tokenIndexes, remainingAccounts, lookupTableList };
}

// Build token accounts using lookup table
function buildTokenLookupAccounts(
  userTokenAccount: PublicKey,
  tokenBillingConfig: PublicKey,
  poolChainConfig: PublicKey,
  lookupTableEntries: PublicKey[],
  writableIndexes: BN[],
  logger: CCIPLogger,
): AccountMeta[] {
  logger.trace("Building token lookup accounts", {
    userTokenAccount: userTokenAccount.toString(),
    tokenBillingConfig: tokenBillingConfig.toString(),
    poolChainConfig: poolChainConfig.toString(),
    entriesCount: lookupTableEntries.length,
  });

  // Build the token accounts with the correct writable flags
  const accounts = [
    { pubkey: userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: tokenBillingConfig, isSigner: false, isWritable: false },
    { pubkey: poolChainConfig, isSigner: false, isWritable: true },
    // First account is the lookup table - must be non-writable
    { pubkey: lookupTableEntries[0], isSigner: false, isWritable: false },
  ];

  // Add the remaining lookup table entries with correct writable flags
  const remainingAccounts = lookupTableEntries.slice(1).map((pubkey, index) => {
    const isWrit = isWritable(index + 1, writableIndexes, logger);
    return {
      pubkey,
      isSigner: false,
      isWritable: isWrit,
    };
  });

  return [...accounts, ...remainingAccounts];
}

// Check if an account should be writable based on writable indexes bitmap
function isWritable(index: number, writableIndexes: BN[], logger?: CCIPLogger): boolean {
  // For the lookup table access, index 0 is determined by the program requirements
  // The lookup table itself must be NON-writable
  if (index === 0) {
    return false;
  }

  // For other accounts, check the writable indexes bitmap
  // Each BN in writableIndexes represents a 256-bit mask
  const bnIndex = Math.floor(index / 128);
  const bitPosition = bnIndex === 0 ? 127 - (index % 128) : 255 - (index % 128);

  if (bnIndex < writableIndexes.length) {
    const mask = new BN(1).shln(bitPosition);
    const result = writableIndexes[bnIndex].and(mask);
    return !result.isZero();
  }

  // Default to non-writable if index is out of bounds
  return false;
}

// Borsh layouts for CCIP types
const SVMTokenAmountLayout = borsh.struct([borsh.publicKey("token"), borsh.u64("amount")]);

const SVM2AnyMessageLayout = borsh.struct([
  borsh.vecU8("receiver"),
  borsh.vecU8("data"),
  borsh.vec(SVMTokenAmountLayout, "tokenAmounts"),
  borsh.publicKey("feeToken"),
  borsh.vecU8("extraArgs"),
]);

const CcipSendLayout = borsh.struct([
  borsh.u64("destChainSelector"),
  borsh.struct(
    [
      borsh.vecU8("receiver"),
      borsh.vecU8("data"),
      borsh.vec(SVMTokenAmountLayout, "tokenAmounts"),
      borsh.publicKey("feeToken"),
      borsh.vecU8("extraArgs"),
    ],
    "message",
  ),
  borsh.vecU8("tokenIndexes"),
]);

// Helper function to convert SVM2AnyMessageFields to encodable format
function toEncodableSVM2AnyMessage(fields: SVM2AnyMessageFields) {
  return {
    receiver: Buffer.from(fields.receiver),
    data: Buffer.from(fields.data),
    tokenAmounts: fields.tokenAmounts.map(item => ({
      token: item.token,
      amount: item.amount,
    })),
    feeToken: fields.feeToken,
    extraArgs: Buffer.from(fields.extraArgs),
  };
}

// Real ccipSend function using proper Borsh serialization
function ccipSend(args: CcipSendArgs, accounts: CcipSendAccounts, programId: PublicKey): TransactionInstruction {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.config, isSigner: false, isWritable: false },
    { pubkey: accounts.destChainState, isSigner: false, isWritable: true },
    { pubkey: accounts.nonce, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.feeTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.feeTokenMint, isSigner: false, isWritable: false },
    {
      pubkey: accounts.feeTokenUserAssociatedAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.feeTokenReceiver, isSigner: false, isWritable: true },
    { pubkey: accounts.feeBillingSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.feeQuoter, isSigner: false, isWritable: false },
    { pubkey: accounts.feeQuoterConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.feeQuoterDestChain, isSigner: false, isWritable: false },
    {
      pubkey: accounts.feeQuoterBillingTokenConfig,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: accounts.feeQuoterLinkTokenConfig,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.rmnRemote, isSigner: false, isWritable: false },
    { pubkey: accounts.rmnRemoteCurses, isSigner: false, isWritable: false },
    { pubkey: accounts.rmnRemoteConfig, isSigner: false, isWritable: false },
  ];

  const identifier = Buffer.from([108, 216, 134, 191, 249, 234, 33, 84]);
  const buffer = Buffer.alloc(1000);
  const len = CcipSendLayout.encode(
    {
      destChainSelector: args.destChainSelector,
      message: toEncodableSVM2AnyMessage(args.message),
      tokenIndexes: Buffer.from(args.tokenIndexes),
    },
    buffer,
  );
  // @ts-ignore
  const dataBuffer = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  // @ts-ignore
  const data = Buffer.from(dataBuffer);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}

// Main CCIP send function
async function sendCCIPMessage(
  context: CCIPContext,
  request: CCIPSendRequest,
  accountReader: CCIPAccountReader,
  computeBudgetInstruction?: TransactionInstruction,
): Promise<string> {
  const logger = context.logger;
  const config = context.config;
  const connection = context.provider.connection;

  logger.info(`Sending CCIP message to destination chain ${request.destChainSelector.toString()}`);

  // Determine if we're using native SOL
  const isNativeSol = request.feeToken.equals(PublicKey.default);
  const feeTokenMint = isNativeSol ? NATIVE_MINT : request.feeToken;

  // Determine the correct fee token program ID
  let feeTokenProgramId = TOKEN_PROGRAM_ID;
  if (!isNativeSol) {
    try {
      const feeTokenMintInfo = await connection.getAccountInfo(feeTokenMint);
      if (feeTokenMintInfo) {
        feeTokenProgramId = feeTokenMintInfo.owner;
      } else {
        feeTokenProgramId = TOKEN_2022_PROGRAM_ID;
      }
    } catch (error) {
      feeTokenProgramId = TOKEN_2022_PROGRAM_ID;
    }
  }

  const selectorBigInt = BigInt(request.destChainSelector.toString());
  const signerPublicKey = context.provider.getAddress();

  // Build the accounts for the ccipSend instruction
  const accounts = await buildCCIPSendAccounts(
    config,
    selectorBigInt,
    request,
    feeTokenMint,
    feeTokenProgramId,
    isNativeSol,
    signerPublicKey,
    logger,
  );

  // Log all core CCIP accounts
  logger.info("=== CORE CCIP ACCOUNTS ===");
  logger.info(`Authority (Signer): ${accounts.authority.toString()}`);
  logger.info(`Config PDA: ${accounts.config.toString()}`);
  logger.info(`Dest Chain State PDA: ${accounts.destChainState.toString()}`);
  logger.info(`Nonce PDA: ${accounts.nonce.toString()}`);
  logger.info(`System Program: ${accounts.systemProgram.toString()}`);
  logger.info(`Fee Token Program: ${accounts.feeTokenProgram.toString()}`);
  logger.info(`Fee Token Mint: ${accounts.feeTokenMint.toString()}`);
  logger.info(`Fee Token User Account: ${accounts.feeTokenUserAssociatedAccount.toString()}`);
  logger.info(`Fee Token Receiver: ${accounts.feeTokenReceiver.toString()}`);
  logger.info(`Fee Billing Signer: ${accounts.feeBillingSigner.toString()}`);
  logger.info(`Fee Quoter Program: ${accounts.feeQuoter.toString()}`);
  logger.info(`Fee Quoter Config: ${accounts.feeQuoterConfig.toString()}`);
  logger.info(`Fee Quoter Dest Chain: ${accounts.feeQuoterDestChain.toString()}`);
  logger.info(`Fee Quoter Billing Token Config: ${accounts.feeQuoterBillingTokenConfig.toString()}`);
  logger.info(`Fee Quoter LINK Token Config: ${accounts.feeQuoterLinkTokenConfig.toString()}`);
  logger.info(`RMN Remote Program: ${accounts.rmnRemote.toString()}`);
  logger.info(`RMN Remote Curses: ${accounts.rmnRemoteCurses.toString()}`);
  logger.info(`RMN Remote Config: ${accounts.rmnRemoteConfig.toString()}`);

  // Build token indexes and accounts
  const { tokenIndexes, remainingAccounts, lookupTableList } = await buildTokenAccountsForSend(
    request,
    connection,
    accountReader,
    logger,
    config,
    signerPublicKey,
  );

  // Log token-specific information
  logger.info("=== TOKEN INFORMATION ===");
  logger.info(`Number of tokens: ${request.tokenAmounts.length}`);
  request.tokenAmounts.forEach((tokenAmount, index) => {
    logger.info(`Token ${index}: ${tokenAmount.token.toString()}, Amount: ${tokenAmount.amount.toString()}`);
  });
  logger.info(`Token indexes: [${tokenIndexes.join(", ")}]`);

  // Log remaining accounts (token-specific accounts)
  logger.info("=== REMAINING ACCOUNTS (Token-specific) ===");
  remainingAccounts.forEach((account, index) => {
    logger.info(
      `Index ${index}: ${account.pubkey.toString()} (Signer: ${account.isSigner}, Writable: ${account.isWritable})`,
    );
  });

  // Log lookup tables
  logger.info("=== LOOKUP TABLES ===");
  lookupTableList.forEach((lookupTable, tableIndex) => {
    logger.info(`Lookup Table ${tableIndex}: ${lookupTable.key.toString()}`);
    logger.info(`  Addresses in table ${tableIndex}:`);
    lookupTable.state.addresses.forEach((address, addressIndex) => {
      logger.info(`    Index ${addressIndex}: ${address.toString()}`);
    });
  });

  // Delegate tokens to fee billing signer before creating CCIP instruction
  logger.info("=== TOKEN DELEGATION ===");
  const delegationInstructions: TransactionInstruction[] = [];

  for (const tokenAmount of request.tokenAmounts) {
    const tokenDelegationInstructions = await delegateTokensToFeeBillingSigner(
      connection,
      tokenAmount.token,
      tokenAmount.amount,
      signerPublicKey,
      config,
      logger,
    );
    delegationInstructions.push(...tokenDelegationInstructions);
  }

  // Create the ccipSend instruction using real Anchor bindings pattern
  const instruction = ccipSend(
    {
      destChainSelector: request.destChainSelector,
      message: {
        receiver: request.receiver,
        data: request.data,
        tokenAmounts: request.tokenAmounts,
        feeToken: request.feeToken,
        extraArgs: request.extraArgs,
      },
      tokenIndexes: new Uint8Array(tokenIndexes),
    },
    accounts,
    config.ccipRouterProgramId,
  );

  // Add remaining accounts (token-specific accounts) to the instruction
  instruction.keys.push(...remainingAccounts);

  // Log complete instruction details
  logger.info("=== COMPLETE INSTRUCTION ACCOUNTS ===");
  instruction.keys.forEach((key, index) => {
    logger.info(`Account ${index}: ${key.pubkey.toString()} (Signer: ${key.isSigner}, Writable: ${key.isWritable})`);
  });

  // Get recent blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({
    commitment: "finalized",
  });

  // Create the transaction instructions array
  const instructions: TransactionInstruction[] = [];

  // Add compute budget instruction if provided
  if (computeBudgetInstruction) {
    instructions.push(computeBudgetInstruction);
    logger.info("=== COMPUTE BUDGET INSTRUCTION ===");
    logger.info(`Compute Units: ${computeBudgetInstruction.data.toString()}`);
  }

  // Add token delegation instructions first
  if (delegationInstructions.length > 0) {
    instructions.push(...delegationInstructions);
    logger.info(`=== ADDED ${delegationInstructions.length} TOKEN DELEGATION INSTRUCTIONS ===`);
  }

  // Add the ccipSend instruction
  instructions.push(instruction);

  // Create the transaction
  const messageV0 = new TransactionMessage({
    payerKey: signerPublicKey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message(lookupTableList);

  const tx = new VersionedTransaction(messageV0);

  // Log transaction summary
  logger.info("=== TRANSACTION SUMMARY ===");
  logger.info(`Payer: ${signerPublicKey.toString()}`);
  logger.info(`Recent Blockhash: ${blockhash}`);
  logger.info(`Last Valid Block Height: ${lastValidBlockHeight}`);
  logger.info(`Number of Instructions: ${instructions.length}`);
  logger.info(`Number of Lookup Tables: ${lookupTableList.length}`);
  logger.info(`Total Instruction Accounts: ${instruction.keys.length}`);

  const signedTx = await context.provider.signTransaction(tx);

  // Send the transaction
  const signature = await connection.sendTransaction(signedTx, {
    skipPreflight: false,
    preflightCommitment: "processed",
    maxRetries: 5,
  });

  // Wait for transaction confirmation
  await connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight,
    },
    "finalized",
  );

  logger.info(`CCIP message sent successfully: ${signature}`);
  return signature;
}

// Helper function to delegate tokens to fee billing signer
async function delegateTokensToFeeBillingSigner(
  connection: any,
  tokenMint: PublicKey,
  amount: BN,
  signerPublicKey: PublicKey,
  config: CCIPCoreConfig,
  logger: CCIPLogger,
): Promise<TransactionInstruction[]> {
  logger.info(`Delegating tokens to fee billing signer for token: ${tokenMint.toString()}`);

  // Find the fee billing signer PDA
  const [feeBillingSigner] = findFeeBillingSignerPDA(config.ccipRouterProgramId);

  // Determine token program
  let tokenProgram = TOKEN_PROGRAM_ID;
  try {
    const tokenMintInfo = await connection.getAccountInfo(tokenMint);
    if (tokenMintInfo) {
      tokenProgram = tokenMintInfo.owner;
    } else {
      tokenProgram = TOKEN_2022_PROGRAM_ID;
    }
  } catch (error) {
    tokenProgram = TOKEN_2022_PROGRAM_ID;
  }

  // Get user's token account
  const userTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    signerPublicKey,
    true,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  logger.info(
    `Delegating ${amount.toString()} tokens from ${userTokenAccount.toString()} to ${feeBillingSigner.toString()}`,
  );

  // Create approve instruction to delegate tokens to fee billing signer
  const approveInstruction = createApproveInstruction(
    userTokenAccount, // source account
    feeBillingSigner, // delegate
    signerPublicKey, // owner
    amount, // amount to delegate
    [], // multi-signers
    tokenProgram, // token program
  );

  return [approveInstruction];
}

export const useBridgeOhmFromSolana = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const isDevnet = connection.rpcEndpoint.includes("devnet");

  return useMutation(
    async ({
      evmAddress,
      amount,
      destinationChainSelector = solanaChainIdsFromEVM({
        evmChainId: isDevnet ? NetworkId.SEPOLIA : NetworkId.MAINNET,
      }),
      tokenAddress = SVM_OHM_ADDRESSES[isDevnet ? NetworkId.SOLANA_DEVNET : NetworkId.SOLANA],
      ccipRouter = CCIP_BRIDGE_ADDRESSES[isDevnet ? NetworkId.SOLANA_DEVNET : NetworkId.SOLANA],
      decimals = 9, // OHM decimals
    }: {
      evmAddress: string;
      amount: string;
      destinationChainSelector?: string;
      tokenAddress?: string;
      ccipRouter?: string;
      decimals?: number;
    }) => {
      if (!connected || !publicKey || !signTransaction) {
        throw new Error("Solana wallet not connected");
      }

      const logger = createLogger();

      // Log network information for debugging
      logger.info(`Solana RPC Endpoint: ${connection.rpcEndpoint}`);
      logger.info(`Token Address: ${tokenAddress}`);
      logger.info(`CCIP Router: ${ccipRouter}`);
      logger.info(`Destination Chain Selector: ${destinationChainSelector}`);

      // Pad EVM address to bytes32
      let paddedEvmAddress: Uint8Array;
      try {
        paddedEvmAddress = ethersUtils.arrayify(ethersUtils.hexZeroPad(evmAddress, 32));
      } catch (e) {
        throw new Error("Invalid EVM address");
      }

      // Convert amount to smallest units using parseUnits to handle decimals
      const amountBN = ethersUtils.parseUnits(amount, decimals);
      const amountBNSolana = new BN(amountBN.toString()); //solana handles bignumbers differenly

      // Determine network and get CCIP program addresses
      const network = getNetworkFromCCIPRouter(ccipRouter);
      const ccipAddresses = getCCIPProgramAddresses(network);

      // Create CCIP configuration
      const config: CCIPCoreConfig = {
        ccipRouterProgramId: new PublicKey(ccipRouter),
        feeQuoterProgramId: ccipAddresses.feeQuoterProgramId,
        rmnRemoteProgramId: ccipAddresses.rmnRemoteProgramId,
        linkTokenMint: ccipAddresses.linkTokenMint,
      };

      // Create CCIP context
      const context: CCIPContext = {
        provider: {
          connection,
          getAddress: () => publicKey,
          signTransaction,
        },
        config,
        logger,
      };

      // Build the CCIP send request
      const request: CCIPSendRequest = {
        receiver: paddedEvmAddress,
        data: new Uint8Array(0), // Empty for token-only transfers
        tokenAmounts: [
          {
            token: new PublicKey(tokenAddress),
            amount: amountBNSolana,
          },
        ],
        feeToken: PublicKey.default, // Native SOL for fees
        extraArgs: encodeExtraArgs(0, true), // gasLimit=0, allowOutOfOrderExecution=true
        destChainSelector: new BN(destinationChainSelector),
      };

      // Create account reader
      const accountReader = new CCIPAccountReader(connection, new PublicKey(ccipRouter), logger);

      // Add compute budget instruction for higher compute units
      const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_400_000,
      });

      // Send the CCIP message
      const txid = await sendCCIPMessage(context, request, accountReader, computeBudgetInstruction);

      return { txid };
    },
  );
};
