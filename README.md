[![Lighthouse PWA Test](https://github.com/OlympusDAO/olympus-frontend/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/OlympusDAO/olympus-frontend/actions/workflows/lighthouse.yml)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![OHM Discord](https://img.shields.io/badge/chat-on%20discord-7289DA.svg)](https://discord.gg/gGZUMVDuhQ)
![Branches Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/appleseed-iii/d630a3bd1cf13bb3dc3c1925df28efcd/raw/olympus-frontend__coverage__branches__heads_develop.json)
![Lines Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/appleseed-iii/d630a3bd1cf13bb3dc3c1925df28efcd/raw/olympus-frontend__coverage__lines__heads_develop.json)
![Statements Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/appleseed-iii/d630a3bd1cf13bb3dc3c1925df28efcd/raw/olympus-frontend__coverage__statements__heads_develop.json)
![Functions Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/appleseed-iii/d630a3bd1cf13bb3dc3c1925df28efcd/raw/olympus-frontend__coverage__functions__heads_develop.json)

# [Ω Olympus Frontend](https://app.olympusdao.finance/)

This is the front-end repo for Olympus that allows users to be part of the future of _Meta Greece_.

We are moving at web3 speed and we are looking for talented contributors to boost this rocket. Take a look at our [CONTRIBUTING GUIDE](CONTRIBUTING.md) if you are considering joining a world class DAO.

## 🔧 Setting up Local Development

Required:

- [Node v16.15.0](https://nodejs.org/download/release/latest-v16.x/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)

```bash
$ git clone https://github.com/OlympusDAO/olympus-frontend.git
$ cd olympus-frontend

# set up your environment variables
# read the comments in the .env files for what is required/optional
$ cp .env.example .env

# fill in your own values in .env, then =>
$ yarn
$ yarn start

# Set up Husky (for pre-commit hooks) by running:
$ yarn prepare
```

The site is now running at `http://localhost:3000`!
Open the source code and start editing!

If you would like to run the frontend in a Docker image (e.g. to isolate dependencies and the nodejs version), run `yarn docker-start`.

## Testing

We use the [React Jest](https://jestjs.io/docs/tutorial-react) test driver for unit tests, snapshot tests and e2e tests.

To run tests in interactive mode during development:

```
yarn test
```

### Unit Testing

Unit test files are co-located with the source code files that they test and follow the naming convention `*.unit.test.ts`.
For example unit tests for `OriginalSourceFile.ts` are located in `OriginalSourceFile.unit.test.ts`.
Valid extensions for test files are `.js` (JavaScript), `.ts` (TypeScript), `.jsx` (React JSX), `.tsx` (React TSX).

To run all unit test and see a coverage report:

```bash
yarn test:unit
```

Note that the focus of unit testing is to exercise all paths through the code hosted in this repo and **only** code hosted in this repo. To the extent possible, unit tests should abstract out dependencies such as remote API calls as well as crypto wallet APIs via [`mock functions`](https://jestjs.io/docs/mock-functions).

Coverage thresholds are enforced via CI checks. If a new PR introduces regression in code coverage, the CI will fail. The goal is to keep us at a minimum level of test automation coverage as we introduce new code into the repo. To see the current coverage thresholds, see the `coverageThreshold` in [`package.json`](package.json).

For integration testing automation that runs browser and remote API code as well as our own code, see the End-to-end (E2E) testing section below.

### Mocking Remote API Calls

Unit tests should minimize dependency on remote API calls. Remote API calls slow down test execution and they also occasionally error, which may fail tests for reasons outside the app code being tested. Live API calls should be tested in End-to-end/Integration tests.

[Here is an example unit test](src/helpers/index.unit.test.js) that conditionally mocks API calls.

### Generative Testing

We use [`fast-check`](https://github.com/dubzzz/fast-check) for generative testing which provides property-based coverage for ranges of input values.
[Here is an example](src/helpers/33Together.unit.test.ts) of a unit test case in this repo that uses generative testing.

### Snapshot Testing

We use [Jest Snapshot tests](https://jestjs.io/docs/snapshot-testing) to make sure the UI does not change unexpectedly.
When you make changes to the UI (intentionally), you likely will have to update the Snapshots. You can do so by running:
`yarn snapshot`.

[Here is an example](src/views/Stake/__tests__/Stake.unit.test.tsx) snapshot test and [here is the correspoding recorded snapshot](https://github.com/OlympusDAO/olympus-frontend/blob/develop/src/views/Stake/__tests__/__snapshots__/Stake.unit.test.tsx.snap). Keep in mind that for snapshot tests to be meaningful, they have to pre-populate components with variety of data sets (realistic, edge case, invalid).

[Here is a good blog post](https://dev.to/tobiastimm/property-based-testing-with-react-and-fast-check-3dce) about testing React components with generative data sets.

### React Component Testing

We use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) to test behavior of UI components.
Here is an [example component test](src/components/Migration/__tests__/MigrationModal.unit.test.jsx).
Here is a useful [cheat sheet](https://testing-library.com/docs/react-testing-library/cheatsheet).

### Mocking React Hooks

When testing components that use React Hooks to third party libraries such as React Query or Web3Provider, it is sometimes convenient to mock these hooks in order to simulate various data inputs and edge cases.

[Here is an example test case](src/views/Stake/components/StakeArea/components/StakeActionArea/components/__tests__/StakeBalances.unit.test.jsx) that shows how to mock React Hooks that use Web3Provider and React Query APIs.
### Troubleshooting

If all tests are failing in your local environment (in particular, due to a "cannot find module" error with `node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault.js`), but they should be passing (and the CI tests are passing), it's likely to be an issue with your local cache. Run the following command: `yarn test --clearCache`

## End-to-end testing

Puppeteer (with the Dappeteer addition) is used to do browser-based end-to-end testing.

To run the tests:

- Run the frontend, using `yarn start`
- In another terminal, run the tests, using `yarn test:e2e`

### Rinkeby Testing

### sOHM Faucet

- [0x800B3d87b77361F0D1d903246cA1F51b5acb43c9](https://rinkeby.etherscan.io/address/0x800B3d87b77361F0D1d903246cA1F51b5acb43c9#writeContract)
- to retrieve test sOHMv1 click `Connect to Web3` and use function #3: `dripSOHM`.
- After connecting to web3, click `Write` to execute and 10 sOHM will automatically be transferred to your connected wallet.

_Note_: The faucet is limited to one transfer per wallet every 6500 blocks (~1 day)

_Note_: This faucet drips sOHM v1 tokens. If you need to test v2 token flows (sOHM, OHM, gOHM), you will first need to use the migration steps in the UI to convert from sOHM v1 to sOHM v2.

### wETH Faucet

[Wrap rinkeby eth on rinkeby uniswap](https://app.uniswap.org/#/swap)

### DAI Faucets

- [0xb2180448f8945c8cc8ae9809e67d6bd27d8b2f2c](https://rinkeby.etherscan.io/address/0xb2180448f8945c8cc8ae9809e67d6bd27d8b2f2c#writeContract)
- [0x5ed8bd53b0c3fa3deabd345430b1a3a6a4e8bd7c](https://rinkeby.etherscan.io/address/0x5ed8bd53b0c3fa3deabd345430b1a3a6a4e8bd7c#writeContract)
- use the `mint` function. You can use the number helper for 10^18 & then add four more zeros for 10,000 units of whichever reserve you are minting.

### FRAX Faucet

- [0x2f7249cb599139e560f0c81c269ab9b04799e453](https://rinkeby.etherscan.io/address/0x2f7249cb599139e560f0c81c269ab9b04799e453#writeContract)
- use the `mint` function. You can use the number helper for 10^18 & then add four more zeros for 10,000 units of whichever reserve you are minting.

### Avax Fuji Testnet

1. [avax faucet](https://faucet.avax-test.network/)
2. [explorer](https://explorer.avax-test.network/)

## Rinkeby V2-Bond Creation

1. `create` [here](https://rinkeby.etherscan.io/address/0x9810C5c97C57Ef3F23d9ee06813eF7FD51E13042#writeContract)
2. _name: `DAI` <- name is not used in the frontend / does not matter
3. _quoteToken: `0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C` <- this is DAI, make it whatever asset you want to bond
4. _market: `[10000000000000000000000000,60000000000,1000000]` <- [capacity (in OHM or quote), initial price (9 decimals), debt buffer (3 decimals)]
5. _booleans: `[true,true]` <- [capacity in quote, fixed term]
6. _terms: `[100,1677008640]` <- [vesting length (if fixed term) or vested timestamp, conclusion timestamp], grab a timestamp [here](https://www.unixtimestamp.com/index.php)
7. _intervals: `[14400,86400]` <- [deposit interval, tune interval]

## Rinkeby Inverse-Bond Creation (must have a whitelisted wallet to create)

1. `create` [here](https://rinkeby.etherscan.io/address/0x22AE99D07584A2AE1af748De573c83f1B9Cdb4c0#writeContract)
2. _token: `0xbC9eE0D911739cBc72cd094ADA26F56E0C49EeAE` <- this is the payout token, the deposit token will be OHM
3. _market: `[10000000000000000000000000,25000000000000000,10000000000000000,10000]`
4. _intervals: `[14400,3600]`
5. _conclusion: `1680760325` <- a unix timestamp

## Gitpod Continuous Dev Environment (optional)

This repo is configured to work with Gitpod.

### New Contributors

If you are a new contributor, you can fork the repo and start a pre-configured gitpod environment by prefixing your fork URL with `gitpod.io/#`. For example:

`https://gitpod.io/#https://github.com/.../...`

Then follow the standard [Github fork & PR workflow](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

### Permissioned Contributors

If you are an established contributor with access rights to create and push to branches in this repo, you can use a simpler flow.

1. Obtain a Personal Access Token from your github UI.
2. In your gitpod dashboard, set a new variable named `GITHUB_OHM_PERSONAL_ACCESS_TOKEN` to the value of the access token.
3. Use the button below to start a pre-configured gidpod environment.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/OlympusDAO/olympus-frontend)

4. Follow the simplified [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow) to create new branches in the repo and submit PRs.

## Architecture/Layout

The app is written in [React](https://reactjs.org/) using [Redux](https://redux.js.org/) as the state container.

The files/folder structure are a **WIP** and may contain some unused files. The project is rapidly evolving so please update this section if you see it is inaccurate!

```
./src/
├── App.jsx       // Main app page
├── abi/          // Contract ABIs from etherscan.io
├── actions/      // Redux actions
├── assets/       // Static assets (SVGs)
├── components/   // Reusable individual components
├── constants.js/ // Mainnet Addresses & common ABI
├── contracts/    // TODO: The contracts be here as submodules
├── helpers/      // Helper methods to use in the app
├── hooks/        // Shared reactHooks
├── themes/       // Style sheets for dark vs light theme
└── views/        // Individual Views
```

## Theme Support

Themes are available, but it can be difficult to access the theme's colors.

Material UI components, such as `Button`, can use the current theme's color scheme through the `color` property. For example:

```JSX
 <Button variant="contained" color="primary" className="cause-give-button">
  Give Yield
 </Button>
```

If you wish to use a theme's color scheme manually, follow these steps:

1. Import `useTheme`: `import { useTheme } from "@material-ui/core/styles";`
1. Instantiate the theme: `const theme = useTheme();`
1. Add a style property to the component, for example:

```JSX
 <Grid item className="cause-category" style={{ backgroundColor: theme.palette.background.default }}>
 {category}
 </Grid>
```

For the available theme properties, take a look at the themes in `src/themes`.

## Application translation

Olympus uses [linguijs](https://github.com/lingui/js-lingui) to manage translation.

The language files are located in a submodule deployed in `src/locales/translations`. This submodule points to the [olympus translation repository](https://github.com/OlympusDAO/olympus-translations)

In order to mark text for translation you can use:

- The <Trans> component in jsx templates eg. `<Trans>Translate me!</Trans>`
- The t function in javascript code and jsx templates. `` t`Translate me` ``
  You can also add comments for the translators. eg.

```JSX
t({
 message: "Bond",
 comment: "The action of bonding (verb)",
})
```

- Where a variable/javascript function is required within a block of translatable text, string interpolation can be used:

```JSX
{t`Your current Staked Balance is ${getSOhmBalance().toFixed(2)} sOHM`}
```

When new texts are created or existing texts are modified in the application please leave a message in the OlympusDao app-translation channel for the translators to translate them.

### Resolving merge conflicts with translations

```bash
$ git diff
# shows two commits in conflict below (fbdd867,e6e0919)
diff --cc src/locales/translations
index fbdd867,e6e0919..0000000
--- a/src/locales/translations
+++ b/src/locales/translations

cd src/locales/translations
# first commit
git checkout fbdd867
# merge in second commit
git merge e6e0919
git commit

cd ../../..
git add src/locales/translations
git commit
```

## ESLint

We use ESLint to find/automatically fix problems.

- react-app and react-hooks/recommended are important with react stuff.
- @typescript-eslint/recommended and @typescript-eslint/eslint-recommended as recommended defaults.
- unused-imports to automatically remove unused imports.
- simple-import-sort to automatically sort imports alphabetically. This is opinionated, but useful because it helps avoid merge conflicts with imports (and who doesn't like neat alphabetically sorted imports anyway).
- @typescript-eslint/explicit-function-return-type and @typescript-eslint/explicit-module-boundary-types are turned off to prioritise inferred return types over explicit return types. This is opinionated, but often times the inference Typescript makes is good enough, and sometimes help prevents type mismatches that are a pain to debug.
- @typescript-eslint/ban-ts-comment and @typescript-eslint/ban-ts-ignore are also turned off. This could possibly be temporary, but the ability to use @ts-ignore-like directives is certainly handy as an escape hatch as we encounter errors during the migration to TS.

## Reusable Components (Component Library)

Our codebase uses a custom component library extended from Material UI to make common UI patterns easy to implement on the frontend.
An up-to-date list of available components, implementation examples as well as documentation is available here:

[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](https://master--61c4d644c064da004aebdd97.chromatic.com/)

Contributions are welcome and encouraged to our Component Library. If you see repeated UI patterns not represented in the library, or would like to enhance functionality (such as adding assets to our Icon or Token components), you're welcome to [submit a PR to the component-library project](https://github.com/OlympusDAO/component-library). Please fully review component documentation in Storybook before submitting a PR.

## 🚀 Deployment

Auto deployed on [Fleek.co](http://fleek.co/) fronted by [Cloudflare](https://www.cloudflare.com/). Since it is hosted via IPFS there is no running "server" component and we don't have server sided business logic. Users are served an `index.html` and javascript to run our applications.

_**TODO**: TheGraph implementation/how/why we use it._

### Continuous deployment

Commits to the follow branches are automatically deployed to their respective URLs.
| Branch | URL |
| --- | --- |
| master | <https://app.olympusdao.finance> |
| deploy | <https://staging.olympusdao.finance> |

**Pull Requests**:
Each PR into master will get its own custom URL that is visible on the PR page. QA & validate changes on that URL before merging into the deploy branch.

### Feature Flags

- Give: by default it is enabled. It can be disabled by setting the `REACT_APP_GIVE_ENABLED` environment variable to "false".

## 👏🏽 Contributing Guidelines

First, take a look at our [CONTRIBUTING GUIDE](CONTRIBUTING.md) .

We keep an updated list of bugs/feature requests in [Github Issues](https://github.com/OlympusDAO/olympusdao/issues).

![GitHub issues](https://img.shields.io/github/issues/olympusdao/olympusdao?style=flat-square)

Filter by ["good first issue"](https://github.com/OlympusDAO/olympusdao/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) to get your feet wet!
Once you submit a PR, our CI will generate a temporary testing URL where you can validate your changes. Tag any of the gatekeepers on the review to merge them into master.

_**NOTE**_: For big changes associated with feature releases/milestones, they will be merged onto the `develop` branch for more thorough QA before a final merge to `master`

**Defenders of the code**:

Only the following people have merge access for the master branch.

- [@Girth Brooks](https://github.com/dwjanus)
- [@Unbanksy](https://github.com/unbanksy)
- [@ZayenX](https://github.com/lolchocotaco)

## 🗣 Community

- [Join our Discord](https://discord.gg/gGZUMVDuhQ) and ask how you can get involved with the DAO!
