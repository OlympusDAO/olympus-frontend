import { useMutation } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { useSigner } from "wagmi";

export const useCreateProposal = () => {
  const { data: signer } = useSigner();
  return useMutation(async () => {
    if (signer) {
      const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
      const a = contract.connect(signer);

      const test = await a.propose(
        ["0x1505f3aD833e9C82FACD8b4D3Ff4319B1Ef6eb99"],
        [0],
        [""],
        ["0x546869732069732061207465737420657865637574696F6E2066726F6D204F6C796D70757320476F7665726E6F7220427261766F"],
        `# Send a Test Message
# Proposal Motivation

We at she256 are submitting this proposal on behalf of Zora Labs. Zora Network is an emergent ETH L2 built with the OP stack that has grown to more than [90k weekly active users](https://dune.com/queries/3102622/5177887) who drive [600k transactions every week](https://dune.com/jhackworth/zora-network). We propose a canonical deployment of Uniswap v3 on Zora benefitting creators, collectors, and builders of both ecosystems.

Zora Network is onboarding thousands of creators and collectors to Ethereum L2s through a distinctly creative brand and support from protocols like Mint.Fun, Holograph, PartyDAO, and the Zora Creator Toolkit. It is important for Zora Networkâs ecosystem of creators, collectors, and developers to have access to premier crypto tooling, including DeFi protocols, that can help them protect and expand the value they are creating onchain.

We believe offering these tools is a material step in supporting creators as they explore and innovate with onchain media. This is particularly true as the amount of people and teams that earn ETH on Zora Network continues to grow from features like Zoraâs Protocol Rewards.

This collaboration will position Uniswap to win long term market share on an emergent L2 network with a uniquely differentiated user base. And, it will signal the DAOâs ongoing support of the growing population of creators, collectors, and builders that transact on Zora Network everyday.

## List of actors

* Proposer [Zora Labs](https://zora.co) â [Twitter](http://@ourzora), [Website](http://zora.co), [About](http://zora.co/about), [Network Details and Docs](https://docs.zora.co/docs/zora-network/network)
* Deployer: [Zora Labs](https://twitter.com/ZORAEngineering)
* Bridge Provider: Bedrock (Optimism native bridge)
* Proposal Sponsor: [she256](https://she256.org/)

# Background

Zora Network is an L2 built on top of Ethereum using the OP stack [with over half a million addresses onchain](https://dune.com/sealaunch/zora-network) and just under 1000 ETH in transaction fees. Zora Network launched last summer on June 21st, the Summer Solstice. It is currently supported by industry leading infrastructure partners such as Rainbow, Opensea, Zerion, Dune, Layer Zero and many more. Zora Network supports a bustling ecosystem of creators, collectors and developers that are exploring creativity onchain.

## Creator and Collector Ecosystem

Zora Network brings a uniquely creative and NFT native audience to the Uniswap ecosystem. Many of the active users on Zora Network are the artists, collectors, and builders that makeup the onchain creative community. Zora Network makes up [30-34% of mint marketshare ](https://dune.com/queries/3216404/5377012)across Ethereum and its L2s ecosystem. In the last month, there were more than 40,000 NFT contracts created on Zora Network, and today [36% of all unique collectors ](https://dune.com/jhackworth/zora-network)across Ethereum and its L2 ecosystem are active on Zora Network.

Adoption of Zora Network comes alongside easy to use product features in the Zora Creator Toolkit like email signup and free creation, which position Zora to easily onboard first time users to crypto. As these users grow in their understanding of crypto, itâs important that Zora Network has brand aligned partners, like Uniswap, available to facilitate our usersâ next steps in their crypto journey.

## Developer Ecosystem

The Zora Network developer ecosystem includes a lot of the core infrastructure that developer teams need to get started with a new project in crypto. There are [over 10,000 contracts deployed to Zora Network everyday](https://dune.com/queries/3102645/5177911). Examples of teams that support Zora Network today include infrastructure teams like Dune, Third Web, Tenderly, and Gelato as well key developer tools like Wagmi and Privy.

NFT native protocols like those mentioned above, Mint.Fun, Holograph, and Highlight, have also integrated Zora Network alongside others like [Gallery](https://zora.co/collect/zora:0x5921a344e85553d8ec7f8510917d38aaa8d21081) and [Fair XYZ](https://fair.xyz/). One of the more exciting integrations of late has been the [Warpcast](https://warpcast.com/) teamâs launch of in-app minting of Zora Network NFTs powered by Warps. Lastly on the developer front â Protocol Rewards on Zora Network, specifically referral rewards, are proving to be [a new revenue stream](https://twitter.com/kylemccollom/status/1697237856962720076) for developers building aggregators, recommendation systems like [Daylight](https://www.daylight.xyz/), and mobile notification rails like [Interface](https://twitter.com/interfacedapp). Zora Network is still early, but it's proving to be valuable for developer teams of all types.

# Rationale for Uniswap on Zora Network

[Protocol Rewards on Zora Network](https://support.zora.co/en/articles/8192123-understanding-protocol-rewards-on-zora) makes the need for stablecoins and fiat on/off-ramps increasingly apparent. Creators, collectors, and developers in the Zora ecosystem are [earning six figures of ETH in protocol rewards everyday](https://dune.com/queries/3216223/5376687). For some creators, protocol rewards are helping to [pay their rent ](https://warpcast.com/tokenart.eth/0xfb0ded63)or just grab a slice of pizza. And for platforms, rewards are quickly becoming a core part of their business model and a key to their success.

There is a growing need on Zora Network for swaps and stablecoins that can better protect the value these individuals and teams create. Today, creators are required to bridge their ETH from Zora Network to a chain where Uniswap is supported, which costs gas and eats into their earnings. Only then will they be able to swap to a stablecoin. Adding swaps natively on Zora Network will make taking this action cheaper and easier for onchain creators that are making their living with Protocol Rewards.

Our goal with this proposal is to bring a canonical instance of world class DeFi tooling to Zora Network participants to help them more efficiently convert and expand their Protocol Rewards into value that they can transact with in their everyday lives. We think this is an exciting long tail opportunity for Uniswap.

### Uniswap on Zora Network enables

* Stablecoins for thousands of creators, collectors, and builders on Zora Network
* Swaps for Zora Network participants without needing to bridge funds
* Fiat payment rails to easily on and off ramps, for our creators, collectors, and builders
* Creating and transacting in additional token types ERC20 tokens
* Developer teams requiring liquidity pools for markets or experimentation

# Benefits to Uniswap

Uniswap would be the first DeFi protocol on Zora Network giving it a first mover advantage to win consideration from the networkâs unique audience of creators and collectors.

## Expand the Uniswap Audience

Recent market data from cross-chain minting activations indicate that, when given the option and equal incentive, creators [tend to choose Zora Network](https://x.com/js_horne/status/1744719299460337785?s=20) as the destination for their work onchain. Uniswap and Zora Network coming together is a great opportunity to expand the Uniswap audience to Zora Networkâs creative community.

Zora Network is home to tens of thousands of creators of all disciplines: visual artists, musicians, photographers, podcasters, and more. Incredible crypto native talent like Chase Chapman, Nick Hollins from UFO, and more have made Zora Network their L2 of choice. This is all happening alongside some of the worldâs best YouTube channels like [Color Studios](https://colorsxstudios.com/collect) or breakout brands like [KidSuper ](https://zora.co/collect/zora:0x3a669992d78cf9fd0f23a589c152ea4d2c5e7ed0/1)making Zora their home as well.

Uniswap V3 on Zora Network is an opportunity for Uniswap to market to a new, non-DeFi audience that is excited to support one anotherâs creativity. You can get a feel for who makes up the Zora community in the latest [Me + My Imagination campaign](https://twitter.com/ourZORA/status/1735359375840297265/quotes).

## Increase DEX Marketshare

Uniswap will be the first DEX to come to market on Zora Network. It will start out with 100% marketshare on this emergent L2 network. The more than half a million addresses on Zora Network will have a single destination for DeFi.

Zora Network has an increasingly active user base with active addresses on Zora Network are up 50% MoM from December to January. And, that user base is earning ETH at a good rate with more than $100k of ETH paid out daily on Zora Network in Protocol Rewards. Given these earnings and these levels of activity, there is a good chance these users will need stablecoins and other opportunities to protect the value their creating.

## Commemorative Mint

Zora will mint a commemorative artwork to celebrate the launch of Uniswap V3. Zora plans to [split the creator rewards](https://support.zora.co/en/articles/8730492-split-contracts-on-zora) from this mint 70-30, with 70% of rewards from this mint at the discretion of the Uniswap DAO and 30% going to Zora. We will add the [Protocol Guild](https://protocol-guild.readthedocs.io/en/latest/index.html) as the beneficiary split recipient on this commemorative mint for Uniswap DAO's share of the split, benefitting core protocol development as collectors mint the artwork in celebration of the launch.

# Success Criteria

For Uniswap, this is a unique opportunity to become the sole DEX on Zora Network, a breakout L2 for onchain creativity. This will help Uniswap win increasing amounts of creator affinity as you support the thousands of active creators and collectors around the world using Zora Network.

In addition, we consider this successful for Uniswap if we are able to:

* Launch a successful commemorative mint to excite Zoraâs community about Uniswap
* Onboard Zoraâs onchain creative and developer community to Uniswap
* Partner with Zora on future Uniswap DAO activations, hackathons, etc.

We want to give network participants the tools they need to convert the value they create on Zora Network into stablecoins and real world currencies they can use everyday. By weaving Uniswap V3 seamlessly into this emergent network, we aspire to strengthen the ties between Uniswap and Zora, ensuring a mutually beneficial collaboration between both thriving communities.

## KPI Summary

**Brand Marketing**

* 7,777 unique collectors from Uniswap x Zora commemorative mint
* Increase Uniswap followers on Zora by at least 10k followers

**Mint Performance**

* 55k mints on Uniswap x Zora commemorative mint

**Uniswap Core Metrics**

* 111 creators on Zora Network swapping on Uniswap
* 11 of erc20 tokens and LP pools launched on Zora Network

**Dev Education**

* At least 1 Zora Network platform offers swaps on Uniswap

# Deployment Details

As is the case with all canonical v3 deployments, this deployment will be subject to Ethereum Layer 1 Uniswap Protocol governance. The text record of the uniswap.eth ENS subdomain titled v3-deployments.uniswap.eth will be amended to include the reference to the Uniswap v3 Factory contract on Zora Network.

Uniswap V3 contracts have been deployed on Zora at the following addresses:

| Contract Name                                                                                                                              | Zora Mainnet Address                       |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| [v3CoreFactory](https://explorer.zora.energy/address/0x7145F8aeef1f6510E92164038E1B6F8cB2c42Cbb?tab=contract)                              | 0x7145F8aeef1f6510E92164038E1B6F8cB2c42Cbb |
| [multicall2](https://explorer.zora.energy/address/0xA51c76bEE6746cB487a7e9312E43e2b8f4A37C15?tab=contract)                                 | 0xA51c76bEE6746cB487a7e9312E43e2b8f4A37C15 |
| [proxyAdmin](https://explorer.zora.energy/address/0xd4109824FC80dD41ca6ee8D304ec74B8bEdEd03b)                                              | 0xd4109824FC80dD41ca6ee8D304ec74B8bEdEd03b |
| [tickLens](https://explorer.zora.energy/address/0x209AAda09D74Ad3B8D0E92910Eaf85D2357e3044?tab=contract)                                   | 0x209AAda09D74Ad3B8D0E92910Eaf85D2357e3044 |
| [nftDescriptorLibraryV1\_3\_0](https://explorer.zora.energy/address/0xffF2BffC03474F361B7f92cCfF2fD01CFBBDCdd1?tab=contract)               | 0xffF2BffC03474F361B7f92cCfF2fD01CFBBDCdd1 |
| [nonfungibleTokenPositionDescriptorV1\_3\_0](https://explorer.zora.energy/address/0xf15D9e794d39A3b4Ea9EfC2376b2Cd9562996422?tab=contract) | 0xf15D9e794d39A3b4Ea9EfC2376b2Cd9562996422 |
| [descriptorProxy](https://explorer.zora.energy/address/0x843b0b03c3B3B0434B9cb00AD9cD1D9218E7741b)                                         | 0x843b0b03c3B3B0434B9cb00AD9cD1D9218E7741b |
| [nonfungibleTokenPositionManager](https://explorer.zora.energy/address/0xbC91e8DfA3fF18De43853372A3d7dfe585137D78?tab=contract)            | 0xbC91e8DfA3fF18De43853372A3d7dfe585137D78 |
| [v3Migrator](https://explorer.zora.energy/address/0x048352d8dCF13686982C799da63fA6426a9D0b60?tab=contract)                                 | 0x048352d8dCF13686982C799da63fA6426a9D0b60 |
| [v3Staker](https://explorer.zora.energy/address/0x5eF5A6923d2f566F65f363b78EF7A88ab1E4206f?tab=contract)                                   | 0x5eF5A6923d2f566F65f363b78EF7A88ab1E4206f |
| [quoterV2](https://explorer.zora.energy/address/0x11867e1b3348F3ce4FcC170BC5af3d23E07E64Df?tab=contract)                                   | 0x11867e1b3348F3ce4FcC170BC5af3d23E07E64Df |

## Front End Considerations

Zora will deploy the [open source Uniswap UI](https://github.com/Uniswap/interface) to a subdomain at <https://zora.energy.> This front end will be made available to all Zora Network users similar to <https://bridge.zora.energy.> Our goal is to ensure that there is an easy to use frontend interface for users to access the superpowers of Uniswap. Overtime, we will work with the Uniswap Labs team to get Zora Network added to the primary Uniswap website over time.

# Bridge Details

Zora Network is built on the open-source OP Stack. As a result, the bridge for Zora Network operates functionally identical to both OP Mainnet and Base â two OP Stack chains with canonical Uniswap V3 deployments already live. The bridge address is listed below, and more information on the OP Stack Bridge design is available [here](https://docs.optimism.io/builders/dapp-developers/bridging/basics). As a further convenience, Zora Network hosts a bridging interface at <https://bridge.zora.energy.>

| Contract Name                                                                                        | Address of Proxy                           |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Optimism Portal](https://etherscan.io/address/0x1a0ad011913A150f69f6A19DF447A0CfD9551054)           | 0x1a0ad011913A150f69f6A19DF447A0CfD9551054 |
| [L1 ERC721 Bridge](https://etherscan.io/address/0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3)          | 0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3 |
| [L1 Standard Bridge](https://etherscan.io/address/0x3e2ea9b92b7e48a52296fd261dc26fd995284631)        | 0x3e2ea9b92b7e48a52296fd261dc26fd995284631 |
| [L1 Cross Domain Messenger](https://etherscan.io/address/0xdc40a14d9abd6f410226f1e6de71ae03441ca506) | 0xdc40a14d9abd6f410226f1e6de71ae03441ca506 |

## Timeline

This proposal has passed the RFC and temperature check phases. The relevant Uniswap v3 contracts have also been deployed on Zora mainnet. If this onchain vote passes, this deployment will be officially recognized as a canonical v3 deployment through an amendment to the v3deployments.uniswap.eth subdomain.`,
      );
    }
    return true;
  });
};
