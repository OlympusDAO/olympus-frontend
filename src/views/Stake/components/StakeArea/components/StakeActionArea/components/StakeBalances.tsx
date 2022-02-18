import { t } from "@lingui/macro";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { DataRow } from "@olympusdao/component-library";
import { BigNumber, BigNumberish } from "ethers";
import { NetworkId } from "src/constants";
import { convertGohmToOhm, formatNumber, nonNullable, parseBigNumber } from "src/helpers";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

const DECIMAL_PLACES_SHOWN = 4;

const hasVisibleBalance = (balance?: BigNumber, units: BigNumberish = 9) =>
  balance && parseBigNumber(balance, units) > 9 / Math.pow(10, DECIMAL_PLACES_SHOWN + 1);

const formatBalance = (balance?: BigNumber, units: BigNumberish = 9) =>
  balance && formatNumber(parseBigNumber(balance, units), DECIMAL_PLACES_SHOWN);

const sumTokenBalOnAllNetworks = (balances: Partial<Record<NetworkId, BigNumber>>) =>
  Object.values(balances).reduce((res, bal) => res.add(bal), BigNumber.from(0));

export const StakeBalances = () => {
  const { data: ohmBalance } = useOhmBalance();
  const { data: sohmBalance } = useSohmBalance();
  const { data: gohmBalance } = useGohmBalance();
  const { data: wsohmBalance } = useWsohmBalance();
  const { data: v1sohmBalance } = useV1SohmBalance();
  const { data: gohmFuseBalance } = useFuseBalance();
  const { data: gohmTokemakBalance } = useGohmTokemakBalance();

  const { data: currentIndex } = useCurrentIndex();

  const totalSohmBalance = [ohmBalance, sohmBalance, v1sohmBalance]
    .filter(nonNullable)
    .map(sumTokenBalOnAllNetworks)
    .reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const totalGohmBalance = [gohmBalance, wsohmBalance, gohmFuseBalance, gohmTokemakBalance]
    .filter(nonNullable)
    .map(sumTokenBalOnAllNetworks)
    .reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const totalStakedBalance = currentIndex
    ? formatBalance(totalSohmBalance.mul(10 ** 9).add(convertGohmToOhm(totalGohmBalance, currentIndex)), 18)
    : BigNumber.from(0);

  const allBalancesLoaded =
    !!ohmBalance &&
    !!sohmBalance &&
    !!v1sohmBalance &&
    !!gohmBalance &&
    !!wsohmBalance &&
    !!gohmFuseBalance &&
    !!gohmTokemakBalance;

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
          <DataRow
            id="user-staked-balance"
            isLoading={!allBalancesLoaded}
            title={t`Total Staked Balance`}
            balance={`${totalStakedBalance} sOHM`}
          />
        </AccordionSummary>

        <AccordionDetails>
          <DataRow
            indented
            title={t`sOHM`}
            id="user-staked-balance"
            isLoading={!sohmBalance}
            balance={`${formatBalance(sohmBalance?.[NetworkId.MAINNET])} sOHM`}
          />

          <DataRow
            indented
            title={t`gOHM`}
            isLoading={!gohmBalance}
            balance={`${formatBalance(gohmBalance?.[NetworkId.MAINNET], 18)} gOHM`}
          />

          {hasVisibleBalance(gohmBalance?.[NetworkId.ARBITRUM], 18) && (
            <DataRow
              indented
              isLoading={!gohmBalance}
              title={t`gOHM (Arbitrum)`}
              balance={`${formatBalance(gohmBalance?.[NetworkId.ARBITRUM], 18)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmBalance?.[NetworkId.AVALANCHE], 18) && (
            <DataRow
              indented
              isLoading={!gohmBalance}
              title={t`gOHM (Avalanche)`}
              balance={`${formatBalance(gohmBalance?.[NetworkId.AVALANCHE], 18)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmBalance?.[NetworkId.POLYGON], 18) && (
            <DataRow
              indented
              isLoading={!gohmBalance}
              title={t`gOHM (Polygon)`}
              balance={`${formatBalance(gohmBalance?.[NetworkId.POLYGON], 18)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmBalance?.[NetworkId.FANTOM], 18) && (
            <DataRow
              indented
              title={t`gOHM (Fantom)`}
              isLoading={!gohmBalance}
              balance={`${formatBalance(gohmBalance?.[NetworkId.FANTOM], 18)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmTokemakBalance?.[NetworkId.MAINNET], 18) && (
            <DataRow
              indented
              title={t`gOHM (Tokemak)`}
              isLoading={!gohmTokemakBalance}
              balance={`${formatBalance(gohmTokemakBalance?.[NetworkId.MAINNET], 18)} gOHM`}
            />
          )}

          {hasVisibleBalance(gohmFuseBalance?.[NetworkId.MAINNET], 18) && (
            <DataRow
              indented
              isLoading={!gohmFuseBalance}
              title={t`gOHM (Fuse)`}
              balance={`${formatBalance(gohmFuseBalance?.[NetworkId.MAINNET], 18)} gOHM`}
            />
          )}

          {hasVisibleBalance(v1sohmBalance?.[NetworkId.MAINNET]) && (
            <DataRow
              indented
              isLoading={!v1sohmBalance}
              title={t`sOHM (v1)`}
              balance={`${formatBalance(v1sohmBalance?.[NetworkId.MAINNET])} sOHM`}
            />
          )}

          {hasVisibleBalance(wsohmBalance?.[NetworkId.MAINNET], 18) && (
            <DataRow
              indented
              title={t`wsOHM`}
              isLoading={!wsohmBalance}
              balance={`${formatBalance(wsohmBalance?.[NetworkId.MAINNET], 18)} wsOHM`}
            />
          )}

          {hasVisibleBalance(wsohmBalance?.[NetworkId.ARBITRUM], 18) && (
            <DataRow
              indented
              isLoading={!wsohmBalance}
              title={t`wsOHM (Arbitrum)`}
              balance={`${formatBalance(wsohmBalance?.[NetworkId.ARBITRUM], 18)} wsOHM`}
            />
          )}

          {hasVisibleBalance(wsohmBalance?.[NetworkId.AVALANCHE], 18) && (
            <DataRow
              indented
              isLoading={!wsohmBalance}
              title={t`wsOHM (Avalanche)`}
              balance={`${formatBalance(wsohmBalance?.[NetworkId.AVALANCHE], 18)} wsOHM`}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
