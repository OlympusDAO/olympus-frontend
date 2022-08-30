import { t } from "@lingui/macro";
import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { Modal, PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { CancelCallback } from "src/views/Give/Interfaces";

type FilterModalProps = {
  isModalOpen: boolean;
  cancelFunc: CancelCallback;
};

export const FilterModal = ({ isModalOpen, cancelFunc }: FilterModalProps) => {
  const [checkedActive, setCheckedActive] = useState(false);
  const [checkedEndorsements, setCheckedEndorsements] = useState(false);
  const [checkedDiscussions, setCheckedDiscussions] = useState(false);
  const [checkedDraft, setCheckedDraft] = useState(false);
  const [checkedClosed, setCheckedClosed] = useState(false);

  return (
    <Modal open={isModalOpen} onClose={cancelFunc} headerText="Filter by" closePosition="right" minHeight="450px">
      <>
        <Box mt="28px">
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedActive}
                onChange={event => setCheckedActive(event.target.checked)}
                icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
              />
            }
            label={t`Active`}
          />
        </Box>
        <Box mt="28px">
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedEndorsements}
                onChange={event => setCheckedEndorsements(event.target.checked)}
                icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
              />
            }
            label={t`Endorsements`}
          />
        </Box>
        <Box mt="28px">
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedDiscussions}
                onChange={event => setCheckedDiscussions(event.target.checked)}
                icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
              />
            }
            label={t`Discussions`}
          />
        </Box>
        <Box mt="28px">
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedDraft}
                onChange={event => setCheckedDraft(event.target.checked)}
                icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
              />
            }
            label={t`Draft`}
          />
        </Box>
        <Box mt="28px">
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedClosed}
                onChange={event => setCheckedClosed(event.target.checked)}
                icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
              />
            }
            label={t`Closed`}
          />
        </Box>
        <Box display="flex" justifyContent="center" mt="28px">
          <SecondaryButton template="secondary" sx={{ flexGrow: "1" }}>
            Cancel
          </SecondaryButton>
          <PrimaryButton sx={{ flexGrow: "1" }}>Save</PrimaryButton>
        </Box>
      </>
    </Modal>
  );
};
