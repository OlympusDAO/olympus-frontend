import { t, Trans } from "@lingui/macro";
import { Divider, FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataRow, Metric, PrimaryButton } from "@olympusdao/component-library";
import { useEffect, useMemo, useState } from "react";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { Project } from "src/components/GiveProject/project.type";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useRecipientInfo, useRedeemableBalance, useTotalDonated, useV1RedeemableBalance } from "src/hooks/useGiveInfo";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { GetCorrectContractUnits } from "src/views/Give/helpers/GetCorrectUnits";
import { useRedeem } from "src/views/Give/hooks/useRedeem";
import { useOldRedeem } from "src/views/Give/hooks/useRedeemV1";
import data from "src/views/Give/projects.json";
import { RedeemCancelCallback, RedeemRebasesModal } from "src/views/Give/RedeemRebasesModal";
import { useAccount } from "wagmi";

// Consistent with staking page
const DECIMAL_PLACES = 4;
const ZERO_NUMBER = new DecimalBigNumber("0");
const DECIMAL_FORMAT = { decimals: DECIMAL_PLACES, format: true };
const NO_DECIMAL_FORMAT = { format: true };

export default function RedeemYield() {
  const { address = "" } = useAccount();
  const [isRedeemRebasesModalOpen, setIsRedeemRebasesModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));
  const [contract, setContract] = useState("new");

  const { data: currentIndex } = useCurrentIndex();

  const _useRedeemableBalance = useRedeemableBalance(address);
  const redeemableBalance: DecimalBigNumber = useMemo(() => {
    if (_useRedeemableBalance.isLoading || _useRedeemableBalance.data === undefined) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(_useRedeemableBalance.data, "sOHM", currentIndex);
  }, [_useRedeemableBalance, currentIndex]);

  const _useV1RedeemableBalance = useV1RedeemableBalance();
  const v1RedeemableBalance: DecimalBigNumber = useMemo(() => {
    if (_useV1RedeemableBalance.isLoading || _useV1RedeemableBalance.data === undefined)
      return new DecimalBigNumber("0");

    return new DecimalBigNumber(_useV1RedeemableBalance.data, 9);
  }, [_useV1RedeemableBalance]);

  const _useRecipientInfo = useRecipientInfo(address);
  const isRecipientInfoLoading = _useRecipientInfo.isLoading;

  const _useRebasesDonated = useTotalDonated(address);
  const isRebasesDonatedLoading = _useRebasesDonated.isLoading;

  const _useStakingRebaseRate = useStakingRebaseRate();
  const isStakingRebaseRateLoading = _useStakingRebaseRate.isLoading;
  const stakingRebase: DecimalBigNumber = useMemo(() => {
    if (_useStakingRebaseRate.isLoading || _useStakingRebaseRate.data === undefined) return ZERO_NUMBER;

    return new DecimalBigNumber(_useStakingRebaseRate.data.toString());
  }, [_useStakingRebaseRate]);

  const fiveDayRate: DecimalBigNumber = useMemo(() => {
    if (stakingRebase.eq(ZERO_NUMBER)) return ZERO_NUMBER;

    return new DecimalBigNumber((Math.pow(1 + stakingRebase.toApproxNumber(), 5 * 3) - 1).toString());
  }, [stakingRebase]);

  const totalDebt: DecimalBigNumber = useMemo(() => {
    if (_useRecipientInfo.isLoading || _useRecipientInfo.data == undefined) return ZERO_NUMBER;

    return new DecimalBigNumber(_useRecipientInfo.data.sohmDebt);
  }, [_useRecipientInfo]);

  const totalDonated: DecimalBigNumber = useMemo(() => {
    if (_useRebasesDonated.isLoading || _useRebasesDonated.data == undefined) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(_useRebasesDonated.data, "sOHM", currentIndex);
  }, [_useRebasesDonated]);

  const stakingRebasePercentage = stakingRebase.mul(new DecimalBigNumber("100"));

  const nextRewardValue = stakingRebase.mul(totalDebt);

  const fiveDayRateValue = fiveDayRate.mul(new DecimalBigNumber("100"));

  const isProject = projectMap.get(address);

  const redeemMutation = useRedeem();
  const isMutating = redeemMutation.isLoading;

  const oldRedeemMutation = useOldRedeem();

  useEffect(() => {
    if (isRedeemRebasesModalOpen) setIsRedeemRebasesModalOpen(false);
  }, [redeemMutation.isSuccess, oldRedeemMutation.isSuccess]);

  /**
   * Get project sOHM rebase goal and return as a DecimalBigNumber
   *
   * @param address
   * @returns
   */
  const getRecipientGoal = (address: string): DecimalBigNumber => {
    const project = projectMap.get(address);
    if (project) return new DecimalBigNumber(project.depositGoal.toString());

    return ZERO_NUMBER;
  };

  const getRedeemableBalance = (): DecimalBigNumber => {
    return contract === "new" ? redeemableBalance : v1RedeemableBalance;
  };

  /**
   * Checks that the current user can redeem some quantity of sOHM
   *
   * @returns
   */
  const canRedeem = () => {
    if (!address) return false;

    if (isRecipientInfoLoading) return false;

    if (isMutating) return false;

    if (isRecipientInfoLoading) return false;

    if (contract === "new") {
      if (redeemableBalance.eq(ZERO_NUMBER)) return false;
    } else {
      if (v1RedeemableBalance.eq(ZERO_NUMBER)) return false;
    }

    return true;
  };

  const handleRedeemButtonClick = () => {
    setIsRedeemRebasesModalOpen(true);
  };

  const handleRedeemRebasesModalSubmit = async () => {
    await redeemMutation.mutate({ token: "sOHM" });
  };

  const handleOldRedeemRebasesModalSubmit = async () => {
    await oldRedeemMutation.mutate();
  };

  const handleRedeemRebasesModalCancel: RedeemCancelCallback = () => {
    setIsRedeemRebasesModalOpen(false);
  };

  return (
    <Grid container spacing={2}>
      {v1RedeemableBalance.gt(ZERO_NUMBER) && (
        <Grid container justifyContent="flex-end">
          <Box overrideClass="redeem-selector">
            <Grid item xs={12}>
              <FormControl>
                <Select
                  label="Contract"
                  disableUnderline
                  id="contract-select"
                  value={contract === "new" ? "new" : "old"}
                  onChange={event => setContract(event.target.value === "new" ? "new" : "old")}
                >
                  <MenuItem value="new">Redeem from new contract</MenuItem>
                  <MenuItem value="old">Redeem from old contract</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Box>
        </Grid>
      )}
      <Grid item xs={12} data-testid="redeemable-balance">
        <Metric label={t`Redeemable Amount`} metric={`${getRedeemableBalance().toString(DECIMAL_FORMAT)} sOHM`} />
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs />
          <Grid className="redeem-button" item xs={6}>
            <PrimaryButton
              size="medium"
              data-testid="redeem-rebases-button"
              onClick={() => handleRedeemButtonClick()}
              disabled={!canRedeem()}
            >
              <Trans>Redeem sOHM</Trans>
            </PrimaryButton>
          </Grid>
          <Grid item xs />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="bold">
            Redeem Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <DataRow
            title={t`Your Next Rebase`}
            balance={`${nextRewardValue.toString(DECIMAL_FORMAT)} ${t`sOHM`}`}
            isLoading={isStakingRebaseRateLoading}
            data-testid="data-next-reward-amount"
          />
        </Grid>
        <Grid item xs={12}>
          <DataRow
            title={t`Next Rebase Rate`}
            balance={`${stakingRebasePercentage.toString(DECIMAL_FORMAT)} %`}
            isLoading={isStakingRebaseRateLoading}
            data-testid="data-next-reward-rate"
          />
        </Grid>
        <Grid item xs={12}>
          <DataRow
            title={t`Rebases (5-Day Rate)`}
            balance={`${fiveDayRateValue.toString(DECIMAL_FORMAT)}%`}
            isLoading={isStakingRebaseRateLoading}
            data-testid="data-roi"
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <DataRow
            title={t`Total sOHM Donated`}
            // Exact number
            balance={`${totalDebt.toString(NO_DECIMAL_FORMAT)} ${t`sOHM`}`}
            isLoading={isRecipientInfoLoading}
            data-testid="data-deposited-sohm"
          />
        </Grid>
        <Grid data-testid="data-redeemable-sohm" item xs={12}>
          <DataRow
            title={t`Donated sOHM Rebases`}
            // Exact number
            balance={`${totalDonated.toString(NO_DECIMAL_FORMAT)} ${t`sOHM`}`}
            isLoading={isRebasesDonatedLoading}
          />
        </Grid>
        <Grid item xs={12}>
          {isProject ? (
            <DataRow
              title={t`% of sOHM Goal`}
              balance={totalDebt
                .mul(new DecimalBigNumber("100"))
                .div(getRecipientGoal(address))
                .toString(DECIMAL_FORMAT)}
              data-testid="project-goal-achievement"
              isLoading={isRecipientInfoLoading}
            />
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
      <Grid item>
        <RedeemRebasesModal
          isModalOpen={isRedeemRebasesModalOpen}
          callbackFunc={contract === "new" ? handleRedeemRebasesModalSubmit : handleOldRedeemRebasesModalSubmit}
          cancelFunc={handleRedeemRebasesModalCancel}
          contract={contract}
          deposit={totalDebt}
          redeemableBalance={getRedeemableBalance()}
          isMutationLoading={isMutating}
        />
      </Grid>
    </Grid>
  );
}
