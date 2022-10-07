export const BondInfoText: React.VFC<{ isInverseBond: boolean }> = ({ isInverseBond }) => (
  <>
    {isInverseBond
      ? `Important: Inverse bonds allow you to bond your OHM for treasury assets. Vesting time is 0 and payouts are instant.`
      : `Important: New bonds are auto-staked (accrue rebase rewards) and no longer vest linearly. Simply claim as gOHM at the end of the term.`}
  </>
);
