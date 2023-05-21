import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import Icon from "src/components/library/Icon";
import Modal from "src/components/library/Modal";
import Token from "src/components/library/Token/Token";

export default {
  title: "Visualization/Modal",
  component: Modal,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: "800px",
    },
  },
} as ComponentMeta<typeof Modal>;

const DefaultTemplate: ComponentStory<typeof Modal> = args => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  return <Modal {...args} onClose={handleClose} open={open} />;
};
export const Default = DefaultTemplate.bind({});
export const CloseLeft = DefaultTemplate.bind({});
export const LeftAndRightCTA = DefaultTemplate.bind({});
export const CustomHeaderContent = DefaultTemplate.bind({});

Default.args = {
  headerText: "This is a Modal Header",
  children: <div>Modal Content</div>,
};
CloseLeft.args = {
  headerText: "This is a Modal Header",
  closePosition: "left",
  children: <div>Modal Content</div>,
};
LeftAndRightCTA.args = {
  headerText: "This is a Modal Header",
  closePosition: "left",
  topRight: <div>Right CTA</div>,
  topLeft: <div>Left CTA</div>,
  children: <div>Modal Content</div>,
};
CustomHeaderContent.args = {
  headerContent: (
    <Box display="flex" flex-direction="row">
      <Token name="FRAX" style={{ width: "50px" }} />
      <Typography variant="h5">FRAX</Typography>
    </Box>
  ),
  closePosition: "left",
  topRight: <Icon name="settings" />,
  children: <div>Example Showing how to override headerText with headerContent</div>,
};
