import { t, Trans } from "@lingui/macro";
import { FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataRow, PrimaryButton } from "@olympusdao/component-library";
import { useEffect, useMemo, useState } from "react";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useRecipientInfo, useRedeemableBalance, useV1RedeemableBalance } from "src/hooks/useGiveInfo";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useWeb3Context } from "src/hooks/web3Context";
import { GetCorrectContractUnits } from "src/views/Give/helpers/GetCorrectUnits";

import { Project } from "../../components/GiveProject/project.type";
import { GIVE_MAX_DECIMALS } from "./constants";
import { useRedeem } from "./hooks/useRedeem";
import { useOldRedeem } from "./hooks/useRedeemV1";
import data from "./projects.json";
import { RedeemCancelCallback, RedeemYieldModal } from "./RedeemYieldModal";

// Consistent with staking page
const DECIMAL_PLACES = 4;
const ZERO_NUMBER = new DecimalBigNumber("0");
const DECIMAL_FORMAT = { decimals: DECIMAL_PLACES, format: true };
const NO_DECIMAL_FORMAT = { format: true };

export default function RedeemYield() {
  const { address } = useWeb3Context();
  const [isRedeemYieldModalOpen, setIsRedeemYieldModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));
  const [contract, setContract] = useState("new");

  const { data: currentIndex } = useCurrentIndex();

  const _useRedeemableBalance = useRedeemableBalance(address);
  const redeemableBalance: DecimalBigNumber = useMemo(() => {
    if (_useRedeemableBalance.isLoading || _useRedeemableBalance.data === undefined) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(_useRedeemableBalance.data, "gOHM", currentIndex);
  }, [_useRedeemableBalance, currentIndex]);

  const _useV1RedeemableBalance = useV1RedeemableBalance(address);
  const v1RedeemableBalance: DecimalBigNumber = useMemo(() => {
    if (_useV1RedeemableBalance.isLoading || _useV1RedeemableBalance.data === undefined)
      return new DecimalBigNumber("0");

    return new DecimalBigNumber(_useV1RedeemableBalance.data, 9);
  }, [_useV1RedeemableBalance]);

  const _useRecipientInfo = useRecipientInfo(address);
  const isRecipientInfoLoading = _useRecipientInfo.isLoading;

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

  const stakingRebasePercentage = stakingRebase.mul(new DecimalBigNumber("100"));

  const nextRewardValue = stakingRebase.mul(totalDebt);

  const fiveDayRateValue = fiveDayRate.mul(new DecimalBigNumber("100"));

  const isProject = projectMap.get(address);

  const redeemMutation = useRedeem();
  const isMutating = redeemMutation.isLoading;

  const oldRedeemMutation = useOldRedeem();

  useEffect(() => {
    if (isRedeemYieldModalOpen) setIsRedeemYieldModalOpen(false);
  }, [redeemMutation.isSuccess, oldRedeemMutation.isSuccess]);

  // Get project sOHM yield goal and return as a number
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

    if (contract === "new") {
      if (redeemableBalance.eq(ZERO_NUMBER)) return false;
    } else {
      if (v1RedeemableBalance.eq(ZERO_NUMBER)) return false;
    }

    return true;
  };

  const handleRedeemButtonClick = () => {
    setIsRedeemYieldModalOpen(true);
  };

  const handleRedeemYieldModalSubmit = async () => {
    await redeemMutation.mutate({ token: "sOHM" });
  };

  const handleOldRedeemYieldModalSubmit = async () => {
    await oldRedeemMutation.mutate();
  };

  const handleRedeemYieldModalCancel: RedeemCancelCallback = () => {
    setIsRedeemYieldModalOpen(false);
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
      <Grid item xs={12}>
        <Typography variant="h3" align="center" data-testid="redeemable-balance">
          {isRecipientInfoLoading ? <Skeleton /> : getRedeemableBalance().toString(DECIMAL_FORMAT)} sOHM
        </Typography>
        <Typography variant="body1" align="center" className="subtext">
          Redeemable Yield
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs />
          <Grid item xs={12} sm={6}>
            <PrimaryButton onClick={() => handleRedeemButtonClick()} disabled={!canRedeem()} fullWidth>
              <Trans>Redeem Yield</Trans>
            </PrimaryButton>
          </Grid>
          <Grid item xs />
        </Grid>
      </Grid>
      {isProject ? (
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center">
                  {getRecipientGoal(address).toString(DECIMAL_FORMAT)}
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  <Trans>sOHM Goal</Trans>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center" data-testid="project-deposit">
                  {totalDebt.toString(DECIMAL_FORMAT)}
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  {isSmallScreen ? "Total Donated" : `Total sOHM Donated`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center" data-testid="project-goal-achievement">
                  {totalDebt
                    .mul(new DecimalBigNumber("100"))
                    .div(getRecipientGoal(address), GIVE_MAX_DECIMALS)
                    .toString(DECIMAL_FORMAT)}
                  %
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  <Trans>of sOHM Goal</Trans>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
      <Grid item xs={12}>
        <Box>
          <DataRow
            title={t`Deposited sOHM`}
            // Exact number
            balance={`${contract === "new" ? totalDebt.toString(NO_DECIMAL_FORMAT) : ZERO_NUMBER} ${t`sOHM`}`}
            isLoading={isRecipientInfoLoading}
            data-testid="data-deposited-sohm"
          />
          <DataRow
            title={t`Redeemable Amount`}
            balance={`${getRedeemableBalance().toString(NO_DECIMAL_FORMAT)} ${t`sOHM`}`}
            isLoading={isRecipientInfoLoading}
            data-testid="data-redeemable-balance"
          />
          <DataRow
            title={t`Next Reward Amount`}
            balance={`${nextRewardValue.toString(DECIMAL_FORMAT)} ${t`sOHM`}`}
            isLoading={isStakingRebaseRateLoading}
            data-testid="data-next-reward-amount"
          />
          <DataRow
            title={t`Next Reward Yield`}
            balance={`${stakingRebasePercentage.toString(DECIMAL_FORMAT)}%`}
            isLoading={isStakingRebaseRateLoading}
            data-testid="data-next-reward-yield"
          />
          <DataRow
            title={t`ROI (5-Day Rate)`}
            balance={`${fiveDayRateValue.toString(DECIMAL_FORMAT)}%`}
            isLoading={isStakingRebaseRateLoading}
            data-testid="data-roi"
          />
        </Box>
      </Grid>
      <Grid item>
        <RedeemYieldModal
          isModalOpen={isRedeemYieldModalOpen}
          callbackFunc={contract === "new" ? handleRedeemYieldModalSubmit : handleOldRedeemYieldModalSubmit}
          cancelFunc={handleRedeemYieldModalCancel}
          contract={contract}
          deposit={totalDebt}
          redeemableBalance={getRedeemableBalance()}
          isMutationLoading={isMutating}
        />
      </Grid>
    </Grid>
  );
}
