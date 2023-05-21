import { Box, Paper } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import NavItem from "src/components/library/NavItem";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/NavItem",
  component: NavItem,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {
    actions: { argTypesRegex: null },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/J9pbZ330V6V6Hau7MtuhtC/DS-V2?node-id=35%3A7740",
    },
  },
} as ComponentMeta<typeof NavItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NavItem> = args => <NavItem {...args} />;

export const MultipleItems = () => (
  <Box width="280px">
    <Paper>
      <NavItem to="dash-nav" icon="dashboard" label="Dashboard" />
      <NavItem to="bond" icon="bond" label="Bond">
        <NavItem to="bond-nav" icon="bond" label="Bond" />
      </NavItem>
      <NavItem to="stake" icon="stake" label="Stake" />
      <NavItem to="wrap" icon="wrap" label="Wrap" />
      <NavItem to="give" icon="give" label="Give" chip="New" />
      <NavItem to="bridge" icon="bridge" label="Bridge" />
      <NavItem href="https://pro.olympusdao.finance/" icon="olympus" label="Olympus Pro" />
    </Paper>
  </Box>
);
export const Item = Template.bind({});
export const ItemWithChip = Template.bind({});
export const ItemWithChildren = Template.bind({});
export const ItemWithChipAndChildren = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Item.args = {
  to: "dash-nav",
  icon: "dashboard",
  label: "Dashboard",
};

ItemWithChildren.args = {
  to: "dash-nav",
  icon: "dashboard",
  label: "Dashboard",
  children: (
    <div>
      <NavItem to="bridge" icon="bridge" label="Bridge" />
      <NavItem to="pro" icon="olympus" label="Olympus Pro" />
    </div>
  ),
};

ItemWithChip.args = {
  to: "dash-nav",
  icon: "dashboard",
  label: "Dashboard",
  chip: "New",
};

ItemWithChipAndChildren.args = {
  to: "dash-nav",
  icon: "dashboard",
  label: "Dashboard",
  chip: "New",
  children: (
    <div>
      <NavItem href="https://pro.olympusdao.finance/" icon="bridge" label="Bridge" />
      <NavItem href="https://pro.olympusdao.finance/" icon="olympus" label="Olympus Pro" />
    </div>
  ),
};
