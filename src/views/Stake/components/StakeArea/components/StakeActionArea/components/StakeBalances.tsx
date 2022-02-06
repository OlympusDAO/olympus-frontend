import { t } from "@lingui/macro";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { DataRow } from "@olympusdao/component-library";
import { BigNumber, BigNumberish } from "ethers";
import { NetworkId } from "src/constants";
import { formatNumber, parseBigNumber } from "src/helpers";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalances";

const DECIMAL_PLACES_SHOWN = 4;

const hasVisibleBalance = (balance?: BigNumber, units: BigNumberish = 18) => {
  return balance && parseBigNumber(balance, units) > 9 / Math.pow(10, DECIMAL_PLACES_SHOWN + 1);
};

const formatBalance = (balance?: BigNumber, units: BigNumberish = 18) => {
  return balance && formatNumber(parseBigNumber(balance, units), DECIMAL_PLACES_SHOWN);
};

// const trimmedBalance = Number(
//   [
//     sohmBalance,
//     gOhmAsSohm,
//     gOhmOnArbAsSohm,
//     gOhmOnAvaxAsSohm,
//     gOhmOnPolygonAsSohm,
//     gOhmOnFantomAsSohm,
//     gOhmOnTokemakAsSohm,
//     sohmV1Balance,
//     wsohmAsSohm,
//     fiatDaoAsSohm,
//     fsohmBalance,
//     fgOHMAsfsOHMBalance,
//   ]
//     .filter(Boolean)
//     .map(balance => Number(balance))
//     .reduce((a, b) => a + b, 0)
//     .toFixed(4),
// );

export const StakeBalances = () => {
  const { data: ohmBalance } = useOhmBalance();
  const { data: sohmBalance } = useSohmBalance();
  const { data: gohmBalance } = useGohmBalance();
  const { data: wsohmBalance } = useWsohmBalance();
  const { data: v1sohmBalance } = useV1SohmBalance();
  const { data: gohmFuseBalance } = useFuseBalance();
  const { data: gohmTokemakBalance } = useGohmTokemakBalance();

  return (
    <>
      <DataRow
        id="user-balance"
        isLoading={!ohmBalance}
        title={t`Unstaked Balance`}
        balance={`${formatBalance(ohmBalance?.[NetworkId.MAINNET])} OHM`}
      />

      <Accordion className="stake-accordion" square defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
          {/* TODO */}
          <DataRow
            id="user-staked-balance"
            isLoading={!sohmBalance}
            title={t`Total Staked Balance`}
            balance={`${formatBalance(sohmBalance?.[NetworkId.MAINNET], 18)} sOHM`}
          />
        </AccordionSummary>

        <AccordionDetails>
          <DataRow
            indented
            title={t`sOHM`}
            id="user-staked-balance"
            isLoading={!sohmBalance}
            balance={`${formatBalance(sohmBalance?.[NetworkId.MAINNET], 18)} sOHM`}
          />

          <DataRow
            indented
            title={t`gOHM`}
            isLoading={!gohmBalance}
            balance={`${formatBalance(gohmBalance?.[NetworkId.MAINNET], 36)} gOHM`}
          />

          {hasVisibleBalance(gohmBalance?.[NetworkId.ARBITRUM], 36) && (
            <DataRow
              indented
              isLoading={!gohmBalance}
              title={t`gOHM (Arbitrum)`}
              balance={`${formatBalance(gohmBalance?.[NetworkId.ARBITRUM], 36)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmBalance?.[NetworkId.AVALANCHE], 36) && (
            <DataRow
              indented
              isLoading={!gohmBalance}
              title={t`gOHM (Avalanche)`}
              balance={`${formatBalance(gohmBalance?.[NetworkId.AVALANCHE], 36)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmBalance?.[NetworkId.POLYGON], 36) && (
            <DataRow
              indented
              isLoading={!gohmBalance}
              title={t`gOHM (Polygon)`}
              balance={`${formatBalance(gohmBalance?.[NetworkId.POLYGON], 36)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmBalance?.[NetworkId.FANTOM], 36) && (
            <DataRow
              indented
              title={t`gOHM (Fantom)`}
              isLoading={!gohmBalance}
              balance={`${formatBalance(gohmBalance?.[NetworkId.FANTOM], 36)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmTokemakBalance?.[NetworkId.MAINNET], 36) && (
            <DataRow
              indented
              title={t`gOHM (Tokemak)`}
              isLoading={!gohmTokemakBalance}
              balance={`${formatBalance(gohmTokemakBalance?.[NetworkId.MAINNET], 36)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmFuseBalance, 18) && (
            <DataRow
              indented
              isLoading={!gohmFuseBalance}
              title={t`gOHM (Fuse)`}
              balance={`${formatBalance(gohmFuseBalance, 18)} gOHM`}
            />
          )}

          {hasVisibleBalance(v1sohmBalance?.[NetworkId.MAINNET], 18) && (
            <DataRow
              indented
              isLoading={!v1sohmBalance}
              title={t`sOHM (v1)`}
              balance={`${formatBalance(v1sohmBalance?.[NetworkId.MAINNET], 18)} sOHM`}
            />
          )}

          {hasVisibleBalance(wsohmBalance?.[NetworkId.MAINNET], 36) && (
            <DataRow
              indented
              title={t`wsOHM`}
              isLoading={!wsohmBalance}
              balance={`${formatBalance(wsohmBalance?.[NetworkId.MAINNET], 36)} wsOHM`}
            />
          )}

          {hasVisibleBalance(wsohmBalance?.[NetworkId.ARBITRUM], 36) && (
            <DataRow
              indented
              isLoading={!wsohmBalance}
              title={t`wsOHM (Arbitrum)`}
              balance={`${formatBalance(wsohmBalance?.[NetworkId.ARBITRUM], 36)} wsOHM`}
            />
          )}

          {hasVisibleBalance(wsohmBalance?.[NetworkId.AVALANCHE], 36) && (
            <DataRow
              indented
              isLoading={!wsohmBalance}
              title={t`wsOHM (Avalanche)`}
              balance={`${formatBalance(wsohmBalance?.[NetworkId.AVALANCHE], 36)} wsOHM`}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
