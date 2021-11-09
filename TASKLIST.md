# [Tokenrace Frontend](https://app.tokenracedao.finance/)

_**TODO**: ledgerLiveManifest.json - update icon, content_

```
"icon": "https://res.cloudinary.com/appleseed/image/upload/v1634164239/ohm-gray_xsbilr.png",
...
"content": {
  "shortDescription": "The decentralized reserve infrastructure that's community-owned and liquidity protected.",
  "description": "Tokenrace is building a community-owned decentralized financial infrastructure to bring more stability and transparency for the world."
},
```

_**TODO**: README.md - review and update for reference_

_**TODO**: .github/dependabot.yml - update reviewers_

```
reviewers:
  - 'TokenraceDAO/Frontend'
```

_**TODO**: Setup the following services_

- [dependabot](https://github.com/dependabot) and [dependabot how to](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/enabling-and-disabling-version-updates)
- [ipfs via INFURA](https://infura.io/)
- [s3 for storage](https://aws.amazon.com/pm/serv-s3/) - _Create an aws.json credentials file in packages/react-app/ like { "accessKeyId": "xxx", "secretAccessKey": "xxx", "region": "xxx" } '_
- [Google Analytics / Google Tag Manager](https://analytics.google.com/analytics/web/)
- [Canny.io](https://canny.io/) - used in externalUrls.js
- [AlchemyAPI](https://www.alchemy.com/) - used in src/helpers/Environment.ts
- [SegmentAPI](https://segment.com/) - used in src/helpers/Environment.ts
- [Coingecko](https://www.coingecko.com/en) - used in src/helpers/index.tsx
- [Geoapify](https://www.geoapify.com/) - used in src/helpers/index.tsx
- [DuneAnalytics](https://dune.xyz/home) - used in src/views/Dashboard/Dashboard.jsx

_**TODO**: public/index.html - update GTM and GA ID's_

```
<script>(function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
      'gtm.start':
        new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-PD2T9BC');</script>
<!-- End Google Tag Manager -->

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-196137638-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());

  gtag('config', 'UA-196137638-1');
</script>

```

_**TODO**: public/index.html - update meta description_

```
<meta name="description"
  content="Tokenrace utilizes Treasury Reserves to enable long-term price consistency and scarcity within an infinite supply system" />

```

_**TODO**: Setup IPFS_

- [macOS instructions for IPFS Desktop](https://docs.ipfs.io/install/ipfs-desktop/#macos)
- [IPFS Desktop](https://ipfs.io/#install)

_**TODO**: src/assets/ - review all assets to see what we need to swap in for TKR_

_**TODO**: src/constants.ts - need to update all contract references_

_**TODO**: src/views/Dashboard - will need to update the duneanalytics id for charts_

_**TODO**: src/components/Sidebar/externalUrls.js - setup services; update URLS_

```
const externalUrls = [
  {
    title: "Forum",
    url: "https://forum.olympusdao.finance/",
    icon: <SvgIcon color="primary" component={ForumIcon} />,
  },
  {
    title: "Governance",
    url: "https://vote.olympusdao.finance/",
    icon: <SvgIcon color="primary" component={GovIcon} />,
  },
  {
    title: "Docs",
    url: "https://docs.olympusdao.finance/",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
  {
    title: "Feedback",
    url: "https://olympusdao.canny.io/",
    icon: <SvgIcon color="primary" component={FeedbackIcon} />,
  },
];
```

_**TODO**: src/components/ - update naming space and scss classes for all components; update OHM to TKR or ohm to tkr_

_**TODO**: src/style.css - update naming space and scss classes for all components; update OHM to TKR or ohm to tkr_

_**TODO**: src/helpers/Environment.ts/ - setup services for environment variables_

_**TODO**: src/hooks/userSegmentAnalytics.ts/ - setup services for environment variables_

_**TODO**: src/helpers/index.tsx - update coingeck api_

```
const resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
```

_**TODO**: src/typechain - review how [Typechain is generated and used](https://blog.neufund.org/introducing-typechain-typescript-bindings-for-ethereum-smart-contracts-839fc2becf22)_

_**TODO**: src/views/33Together/poolData.js - update the ID used for the prizeStrategy_

```
prizeStrategy(id: "0xeeb552c4d5e155e50ee3f7402ed379bf72e36f23") {
```

_**TODO**: src/views/TreasuryDashboard/treasuryData.js - update the ID used for the prizeStrategy_

```
rebases(where: {contract: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a"}, orderBy: timestamp, first: 1000, orderDirection: desc) {
```
