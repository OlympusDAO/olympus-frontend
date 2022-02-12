import axios from "axios";
import { ethers } from "ethers";

import fuseFeeDistributorAbi from "./abi/FuseFeeDistributor.json";
import fusePoolDirectoryAbi from "./abi/FusePoolDirectory.json";
import fusePoolLensAbi from "./abi/FusePoolLens.json";
import fusePoolLensSecondaryAbi from "./abi/FusePoolLensSecondary.json";
import fuseSafeLiquidatorAbi from "./abi/FuseSafeLiquidator.json";
// import initializableClonesAbi from "./abi/InitializableClones.json";
import uniswapV3PoolAbiSlim from "./abi/UniswapV3Pool.slim.json";
import { contracts } from "./contracts/compound-protocol.min.json";
import { contracts as oracleContracts } from "./contracts/oracles.min.json";
import DAIInterestRateModelV2 from "./irm/DAIInterestRateModelV2.js";
import JumpRateModel from "./irm/JumpRateModel.js";
import JumpRateModelV2 from "./irm/JumpRateModelV2.js";
import WhitePaperInterestRateModel from "./irm/WhitePaperInterestRateModel.js";

export default class Fuse {
  static FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS = "0x835482FE0532f169024d5E9410199369aAD5C77E";
  static FUSE_SAFE_LIQUIDATOR_CONTRACT_ADDRESS = "0xf0f3a1494ae00b5350535b7777abb2f499fc13d4";
  static FUSE_FEE_DISTRIBUTOR_CONTRACT_ADDRESS = "0xa731585ab05fC9f83555cf9Bff8F58ee94e18F85";
  static FUSE_POOL_LENS_CONTRACT_ADDRESS = "0x6Dc585Ad66A10214Ef0502492B0CC02F0e836eec";
  static FUSE_POOL_LENS_SECONDARY_CONTRACT_ADDRESS = "0xc76190E04012f26A364228Cfc41690429C44165d";

  // static COMPTROLLER_IMPLEMENTATION_CONTRACT_ADDRESS = "0xe16db319d9da7ce40b666dd2e365a4b8b3c18217"; // v1.0.0: 0x94b2200d28932679def4a7d08596a229553a994e; v1.0.1 (with _unsupportMarket): 0x8A78A9D35c9C61F9E0Ff526C5d88eC28354543fE
  // static CERC20_DELEGATE_CONTRACT_ADDRESS = "0x67db14e73c2dce786b5bbbfa4d010deab4bbfcf9"; // v1.0.0: 0x67e70eeb9dd170f7b4a9ef620720c9069d5e706c; v1.0.2 (for V2 yVaults): 0x2b3dd0ae288c13a730f6c422e2262a9d3da79ed1
  // static CETHER_DELEGATE_CONTRACT_ADDRESS = "0xd77e28a1b9a9cfe1fc2eee70e391c05d25853cbf"; // v1.0.0: 0x60884c8faad1b30b1c76100da92b76ed3af849ba
  // static REWARDS_DISTRIBUTOR_DELEGATE_CONTRACT_ADDRESS = "0x220f93183a69d1598e8405310cb361cff504146f";

  // static MASTER_PRICE_ORACLE_IMPLEMENTATION_CONTRACT_ADDRESS = "0xb3c8ee7309be658c186f986388c2377da436d8fb";
  // static INITIALIZABLE_CLONES_CONTRACT_ADDRESS = "0x91ce5566dc3170898c5aee4ae4dd314654b47415";

  // static OPEN_ORACLE_PRICE_DATA_CONTRACT_ADDRESS = "0xc629c26dced4277419cde234012f8160a0278a79"; // UniswapAnchoredView NOT IN USE
  // static COINBASE_PRO_REPORTER_ADDRESS = "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC"; // UniswapAnchoredView NOT IN USE

  static PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES = {
    ChainlinkPriceOracle: "0xe102421A85D9C0e71C0Ef1870DaC658EB43E1493",
    ChainlinkPriceOracleV2: "0xb0602af43Ca042550ca9DA3c33bA3aC375d20Df4",
    ChainlinkPriceOracleV3: "0x058c345D3240001088b6280e008F9e78b3B2112d",
    // PreferredPriceOracle: "", // TODO: Set correct mainnet address after deployment
    // UniswapAnchoredView: "", // NOT IN USE
    // UniswapView: "", // NOT IN USE
    // Keep3rPriceOracle_Uniswap: "0xb90de476d438b37a4a143bf729a9b2237e544af6", // NO LONGER IN USE
    // Keep3rPriceOracle_SushiSwap: "0x08d415f90ccfb971dfbfdd6266f9a7cb1c166fc0", // NO LONGER IN USE
    // Keep3rV2PriceOracle_Uniswap: "0xd6a8cac634e59c00a3d4163f839d068458e39869", // NO LONGER IN USE
    UniswapTwapPriceOracle_Uniswap: "0xCd8f1c72Ff98bFE3B307869dDf66f5124D57D3a9",
    UniswapTwapPriceOracle_SushiSwap: "0xfD4B4552c26CeBC54cD80B1BDABEE2AC3E7eB324",
    UniswapLpTokenPriceOracle: "0x50f42c004bd9b0e5acc65c33da133fbfbe86c7c0",
    UniswapV3TwapPriceOracle_Uniswap_3000: "0x80829b8A344741E28ae70374Be02Ec9d4b51CD89",
    UniswapV3TwapPriceOracle_Uniswap_10000: "0xF8731EB567c4C7693cF497849247668c91C9Ed36",
    UniswapV3TwapPriceOracleV2_Uniswap_500_USDC: "0x29490a6F5B4A999601378547Fe681d04d877D29b",
    UniswapV3TwapPriceOracleV2_Uniswap_3000_USDC: "0xf3a36BB3B627A5C8c36BA0714Fe035A401E86B78",
    UniswapV3TwapPriceOracleV2_Uniswap_10000_USDC: "0x3288a2d5f11FcBefbf77754e073cAD2C10325dE2",
    // RecursivePriceOracle: "", // TODO: Set correct mainnet address after deployment
    YVaultV1PriceOracle: "0xb04be6165cf1879310e48f8900ad8c647b9b5c5d", // NOT CURRENTLY IN USE
    YVaultV2PriceOracle: "0xb669d0319fb9de553e5c206e6fbebd58512b668b",
    // AlphaHomoraV1PriceOracle: "", // TODO: Set correct mainnet address after deployment
    // AlphaHomoraV2PriceOracle: "", // TODO: Set correct mainnet address after deployment
    // SynthetixPriceOracle: "", // TODO: Set correct mainnet address after deployment
    // BalancerLpTokenPriceOracle: "", // TODO: Set correct mainnet address after deployment
    MasterPriceOracle: "0x1887118E49e0F4A78Bd71B792a49dE03504A764D",
    CurveLpTokenPriceOracle: "0x43c534203339bbf15f62b8dde91e7d14195e7a60",
    CurveLiquidityGaugeV2PriceOracle: "0xd9eefdb09d75ca848433079ea72ef609a1c1ea21",
    FixedEthPriceOracle: "0xffc9ec4adbf75a537e4d233720f06f0df01fb7f5",
    FixedEurPriceOracle: "0x817158553F4391B0d53d242fC332f2eF82463e2a",
    WSTEthPriceOracle: "0xb11de4c003c80dc36a810254b433d727ac71c517",
    FixedTokenPriceOracle_OHM: "0x71FE48562B816D03Ce9e2bbD5aB28674A8807CC5",
    UniswapTwapPriceOracleV2_SushiSwap_DAI: "0x72fd4c801f5845ab672a12bce1b05bdba1fd851a", // v1.1.2
    UniswapTwapPriceOracleV2_SushiSwap_CRV: "0x552163f2a63f82bb47b686ffc665ddb3ceaca0ea", // v1.1.3
    UniswapTwapPriceOracleV2_SushiSwap_USDC: "0x9ee412a83a52f033d23a0b7e2e030382b3e53208", // v1.1.3
    UniswapTwapPriceOracleV2_Uniswap_FRAX: "0x6127e381756796fb978bc872556bf790f14cde98", // v1.1.3
    SushiBarPriceOracle: "0x290E0f31e96e13f9c0DB14fD328a3C2A94557245",
    BadgerPriceOracle: "0xd0C86943e594640c4598086a2359A0e70b80eF8D",
    HarvestPriceOracle: "0x8D364609cd2716172016838fF9FBC7fBcAC91792",
    StakedSdtPriceOracle: "0x5447c825ee330015418c1a0d840c4a1b5a7176cc",
    TokemakPoolTAssetPriceOracle: "0xd806782b31EC52FcB7f2a009d7D045bB732431Fb",
    MStablePriceOracle: "0xeb988f5492C86584f8D8f1B8662188D5A9BfE357",
  };

  // static UNISWAP_TWAP_PRICE_ORACLE_ROOT_CONTRACT_ADDRESS = "0xa170dba2cd1f68cdd7567cf70184d5492d2e8138";
  // static UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS = "0xf1860b3714f0163838cf9ee3adc287507824ebdb";
  // static UNISWAP_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS = ""; // TODO: Set correct mainnet address after deployment
  // static UNISWAP_V3_TWAP_PRICE_ORACLE_V2_FACTORY_CONTRACT_ADDRESS = "0x8Eed20f31E7d434648fF51114446b3CfFD1FF9F1"; // TODO: Set correct mainnet address after deployment

  // static DAI_POT = "0x197e90f9fad81970ba7976f33cbd77088e5d7cf7"; // DAIInterestRateModelV2 NOT IN USE
  // static DAI_JUG = "0x19c0976f590d67707e62397c87829d896dc0f1f1"; // DAIInterestRateModelV2 NOT IN USE

  static UNISWAP_V2_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  // static UNISWAP_V2_PAIR_INIT_CODE_HASH = "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f";
  // static SUSHISWAP_FACTORY_ADDRESS = "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac";
  // static UNISWAP_V3_FACTORY_ADDRESS = "0x1f98431c8ad98523631ae4a59f267346ea31f984";
  static WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

  static PRICE_ORACLE_RUNTIME_BYTECODE_HASHES = {
    ChainlinkPriceOracle: "0x7a2a5633a99e8abb759f0b52e87875181704b8e29f6567d4a92f12c3f956d313",
    ChainlinkPriceOracleV2: "0x8d2bcaa1429031ae2b19a4516e5fdc68fb9346f158efb642fcf9590c09de2175",
    ChainlinkPriceOracleV3: "0x4b3bef9f57e381dc6b6e32bff270ce8a72d8aae541cb7c686b09555de3526d39",
    UniswapTwapPriceOracle_Uniswap: "0xa2537dcbd2b55b1a690db3b83fa1042f86b21ec3e1557f918bc3930b6bbb9244",
    UniswapTwapPriceOracle_SushiSwap: "0x9b11abfe7bfc1dcef0b1bc513959f1172cfe2cb595c5131b9cabc3b6448d89ac",
    UniswapV3TwapPriceOracle_Uniswap_3000: "0xb300f7f64110b952340e896d33f133482de6715f1b8b7e0acbd2416e0e6593c1",
    UniswapV3TwapPriceOracleV2_Uniswap_10000_USDC: "0xc301f891f1f905e68d1c5df5202cf0eec2ee8abcf3a510d5bd00d46f7dea01b4",
    UniswapV3TwapPriceOracleV2: "0xc844372c8856a5f9569721d3aca38c7804bae2ae4e296605e683aa8d1601e538", // v1.2.0
    YVaultV1PriceOracle: "0xd0dda181a4eb699a966b23edb883cff43377297439822b1b0f99b06af2002cc3",
    YVaultV2PriceOracle: "0x177c22cc7d05280cea84a36782303d17246783be7b8c0b6f9731bb9002ffcc68",
    // fuse-contracts@v1.0.0
    MasterPriceOracleV1: "0xfa1349af05af40ffb5e66605a209dbbdc8355ba7dda76b2be10bafdf5ffd1dc6",
    // fuse-contracts@v1.2.0
    MasterPriceOracleV2: "0xdfa5aa37efea3b16d143a12c4ae7006f3e29768b3e375b59842c7ecd3809f1d1",
    // fuse-contracts@v1.2.1
    MasterPriceOracleV3: "0xe4199a03b164ca492d19d655b85fdf8cc14cf2da6ddedd236712552b7676b03d",
    CurveLpTokenPriceOracle: "0x6742ae836b1f7df0cfd9b858c89d89da3ee814c28c5ee9709a371bcf9dfd2145",
    CurveLiquidityGaugeV2PriceOracle: "0xfcf0d93de474152898668c4ebd963e0237bfc46c3d5f0ce51b7045b60c831734",
    FixedEthPriceOracle: "0xcb669c93632a1c991adced5f4d97202aa219fab3d5d86ebd28f4f62ad7aa6cb3",
    FixedEurPriceOracle: "0x678dbe9f2399a44e89edc934dc17f6d4ee7004d9cbcee83c0fa0ef43de924b84",
    WSTEthPriceOracle: "0x11daa8dfb8957304aa7d926ce6876c523c7567b4052962e65e7d6a324ddcb4cc",
    FixedTokenPriceOracle_OHM: "0x136d369f53594c2f10e3ff3f14eaaf0bada4a63964f3cfeda3923e3531e407dc",
    UniswapTwapPriceOracleV2_SushiSwap_DAI: "0xb4d279232ab52a2fcaee6dc47db486a733c24a499ade9d7de1b0d417d4730817",
    SushiBarPriceOracle: "0x3736e8b6c11fcd413c0b60c3291a3a2e2ebe496a2780f3c45790a123f5ee9705",
  };

  static ORACLES = [
    "SimplePriceOracle",
    "PreferredPriceOracle",
    "ChainlinkPriceOracle",
    // "Keep3rPriceOracle",
    "MasterPriceOracle",
    // "UniswapAnchoredView",
    // "UniswapView",
    "UniswapLpTokenPriceOracle",
    "RecursivePriceOracle",
    "YVaultV1PriceOracle",
    "YVaultV2PriceOracle",
    "AlphaHomoraV1PriceOracle",
    "SynthetixPriceOracle",
    "ChainlinkPriceOracleV2",
    "CurveLpTokenPriceOracle",
    "CurveLiquidityGaugeV2PriceOracle",
    "FixedEthPriceOracle",
    "FixedEurPriceOracle",
    "FixedTokenPriceOracle",
    "WSTEthPriceOracle",
    "UniswapTwapPriceOracle",
    "UniswapTwapPriceOracleV2",
    "UniswapV3TwapPriceOracle",
    "UniswapV3TwapPriceOracleV2",
    "SushiBarPriceOracle",
  ];

  static PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES = {
    JumpRateModel_Compound_Stables: "0x640dce7c7c6349e254b20eccfa2bb902b354c317",
    JumpRateModel_Compound_UNI: "0xc35DB333EF7ce4F246DE9DE11Cc1929d6AA11672",
    JumpRateModel_Cream_Stables_Majors: "0xb579d2761470bba14018959d6dffcc681c09c04b",
    JumpRateModel_Cream_Gov_Seeds: "0xcdC0a449E011249482824efFcfA05c883d36CfC7",

    WhitePaperInterestRateModel_Compound_ETH: "0x14ee0270C80bEd60bDC117d4F218DeE0A4909F28",
    WhitePaperInterestRateModel_Compound_WBTC: "0x7ecAf96C79c2B263AFe4f486eC9a74F8e563E0a6",

    JumpRateModel_Fei_FEI: "0x8f47be5692180079931e2f983db6996647aba0a5",
    JumpRateModel_Fei_TRIBE: "0x075538650a9c69ac8019507a7dd1bd879b12c1d7",
    JumpRateModel_Fei_ETH: "0xbab47e4b692195bf064923178a90ef999a15f819",
    JumpRateModel_Fei_DAI: "0xede47399e2aa8f076d40dc52896331cba8bd40f7",
    JumpRateModel_Olympus_Majors: "0xe1d35fae219e4d74fe11cb4246990784a4fe6680",

    Custom_JumpRateModel: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
  };
  /*
  static COMPTROLLER_ERROR_CODES = [
    "NO_ERROR",
    "UNAUTHORIZED",
    "COMPTROLLER_MISMATCH",
    "INSUFFICIENT_SHORTFALL",
    "INSUFFICIENT_LIQUIDITY",
    "INVALID_CLOSE_FACTOR",
    "INVALID_COLLATERAL_FACTOR",
    "INVALID_LIQUIDATION_INCENTIVE",
    "MARKET_NOT_ENTERED", // no longer possible
    "MARKET_NOT_LISTED",
    "MARKET_ALREADY_LISTED",
    "MATH_ERROR",
    "NONZERO_BORROW_BALANCE",
    "PRICE_ERROR",
    "REJECTION",
    "SNAPSHOT_ERROR",
    "TOO_MANY_ASSETS",
    "TOO_MUCH_REPAY",
    "SUPPLIER_NOT_WHITELISTED",
    "BORROW_BELOW_MIN",
    "SUPPLY_ABOVE_MAX",
    "NONZERO_TOTAL_SUPPLY",
  ];

  static CTOKEN_ERROR_CODES = [
    "NO_ERROR",
    "UNAUTHORIZED",
    "BAD_INPUT",
    "COMPTROLLER_REJECTION",
    "COMPTROLLER_CALCULATION_ERROR",
    "INTEREST_RATE_MODEL_ERROR",
    "INVALID_ACCOUNT_PAIR",
    "INVALID_CLOSE_AMOUNT_REQUESTED",
    "INVALID_COLLATERAL_FACTOR",
    "MATH_ERROR",
    "MARKET_NOT_FRESH",
    "MARKET_NOT_LISTED",
    "TOKEN_INSUFFICIENT_ALLOWANCE",
    "TOKEN_INSUFFICIENT_BALANCE",
    "TOKEN_INSUFFICIENT_CASH",
    "TOKEN_TRANSFER_IN_FAILED",
    "TOKEN_TRANSFER_OUT_FAILED",
    "UTILIZATION_ABOVE_MAX",
  ];
  */
  constructor(web3Provider) {
    this.provider = web3Provider;

    this.getEthUsdPriceBN = async function () {
      return (await axios.get("https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum")).data
        .ethereum.usd;
    };

    this.contracts = {
      FusePoolDirectory: new ethers.Contract(
        Fuse.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS,
        fusePoolDirectoryAbi,
        this.provider,
      ),
      FusePoolLens: new ethers.Contract(Fuse.FUSE_POOL_LENS_CONTRACT_ADDRESS, fusePoolLensAbi, this.provider),
      FusePoolLensSecondary: new ethers.Contract(
        Fuse.FUSE_POOL_LENS_SECONDARY_CONTRACT_ADDRESS,
        fusePoolLensSecondaryAbi,
        this.provider,
      ),
      FuseSafeLiquidator: new ethers.Contract(
        Fuse.FUSE_SAFE_LIQUIDATOR_CONTRACT_ADDRESS,
        fuseSafeLiquidatorAbi,
        this.provider,
      ),
      FuseFeeDistributor: new ethers.Contract(
        Fuse.FUSE_FEE_DISTRIBUTOR_CONTRACT_ADDRESS,
        fuseFeeDistributorAbi,
        this.provider,
      ),
    };

    this.compoundContracts = contracts;
    // this.openOracleContracts = openOracleContracts;
    this.oracleContracts = oracleContracts;

    this.identifyInterestRateModel = async function (interestRateModelAddress) {
      // Get interest rate model type from runtime bytecode hash and init class
      var interestRateModels = {
        JumpRateModel: JumpRateModel,
        JumpRateModelV2: JumpRateModelV2,
        DAIInterestRateModelV2: DAIInterestRateModelV2,
        WhitePaperInterestRateModel: WhitePaperInterestRateModel,
      };

      var runtimeBytecodeHash = ethers.utils.keccak256(await this.provider.getCode(interestRateModelAddress));
      var interestRateModel = null;

      outerLoop: for (const model of [
        "JumpRateModel",
        "JumpRateModelV2",
        "DAIInterestRateModelV2",
        "WhitePaperInterestRateModel",
      ]) {
        if (interestRateModels[model].RUNTIME_BYTECODE_HASHES !== undefined) {
          for (const hash of interestRateModels[model].RUNTIME_BYTECODE_HASHES) {
            if (runtimeBytecodeHash == hash) {
              interestRateModel = new interestRateModels[model]();
              break outerLoop;
            }
          }
        } else if (runtimeBytecodeHash == interestRateModels[model].RUNTIME_BYTECODE_HASH) {
          interestRateModel = new interestRateModels[model]();
          break;
        }
      }

      return interestRateModel;
    };

    this.getInterestRateModel = async function (assetAddress) {
      // Get interest rate model address from asset address
      var assetContract = new ethers.Contract(
        assetAddress,
        JSON.parse(contracts["contracts/CTokenInterfaces.sol:CTokenInterface"].abi),
        this.provider,
      );
      var interestRateModelAddress = await assetContract.interestRateModel();

      var interestRateModel = await this.identifyInterestRateModel(interestRateModelAddress);

      await interestRateModel.init(this.provider, interestRateModelAddress, assetAddress);
      return interestRateModel;
    };

    this.getPriceOracle = async function (oracleAddress) {
      // Get price oracle contract name from runtime bytecode hash
      var runtimeBytecodeHash = ethers.utils.keccak256(await this.provider.getCode(oracleAddress));
      for (const model of Object.keys(Fuse.PRICE_ORACLE_RUNTIME_BYTECODE_HASHES))
        if (runtimeBytecodeHash == Fuse.PRICE_ORACLE_RUNTIME_BYTECODE_HASHES[model]) return model;
      return undefined;
    };

    this.checkCardinality = async function (uniswapV3Pool) {
      var uniswapV3PoolContract = new ethers.Contract(uniswapV3Pool, uniswapV3PoolAbiSlim, this.provider);
      const shouldPrime = (await uniswapV3PoolContract.slot0()).observationCardinalityNext < 64;
      return shouldPrime;
    };

    this.primeUniswapV3Oracle = async function (uniswapV3Pool) {
      var uniswapV3PoolContract = new ethers.Contract(uniswapV3Pool, uniswapV3PoolAbiSlim, this.provider);
      await uniswapV3PoolContract.increaseObservationCardinalityNext(64);
    };

    this.identifyInterestRateModelName = irmAddress => {
      let name = "";

      Object.entries(Fuse.PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES).forEach(([key, value]) => {
        if (value === irmAddress) {
          name = key;
        }
      });
      return name;
    };
  }
}
