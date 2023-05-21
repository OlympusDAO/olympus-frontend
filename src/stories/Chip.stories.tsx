import { ComponentMeta } from "@storybook/react";
import Chip from "src/components/library/Chip";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/Chip",
  component: Chip,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof Chip>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

//const Template: ComponentStory<typeof Chip> = args => <Chip {...args} />;

export const Default = () => (
  <>
    <Chip label="12.25%" template="success" />
    <Chip label="12.25%" template="error" />
    <Chip label="12.25%" template="userFeedback" />
    <Chip label="12.25%" template="warning" />
    <Chip label="12.25%" />
  </>
);
