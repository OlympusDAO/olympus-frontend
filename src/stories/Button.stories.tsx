import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import {
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
  TertiaryButton,
  TextButton,
} from "src/components/library/Button";
import Button from "src/components/library/Button/Button";
import { withDesign } from "storybook-addon-designs";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {
    actions: { argTypesRegex: null },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/J9pbZ330V6V6Hau7MtuhtC/DS-V2?node-id=1%3A1038",
    },
  },
  decorators: [withDesign],
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const PrimaryTemplate: ComponentStory<typeof Button> = args => <PrimaryButton {...args} />;
const SecondaryTemplate: ComponentStory<typeof Button> = args => <SecondaryButton {...args} />;
const TertiaryTemplate: ComponentStory<typeof Button> = args => <TertiaryButton {...args} />;

export const AllButtonStyles = () => (
  <>
    <PrimaryButton>Primary</PrimaryButton>
    <SecondaryButton>Secondary</SecondaryButton>
    <TertiaryButton>Tertiary</TertiaryButton>
    <PrimaryButton size="small">Small</PrimaryButton>
    <PrimaryButton size="large">Large Button</PrimaryButton>
    <PrimaryButton startIconName="info-fill">Left Icon</PrimaryButton>
    <PrimaryButton endIconName="info-fill">Right Icon</PrimaryButton>
    <PrimaryButton icon="info-fill" />
    <PrimaryButton icon="info-fill" size="small" />
    <PrimaryButton icon="info-fill" size="large" />
    <PrimaryButton fullWidth href="https://www.google.com">
      Default with Link
    </PrimaryButton>
    <SuccessButton>Success Button</SuccessButton>
    <PrimaryButton disabled>Disabled Primary</PrimaryButton>
    <SecondaryButton disabled> Disabled Secondary</SecondaryButton>
    <TertiaryButton disabled> Disabled Tertiary</TertiaryButton>
    <PrimaryButton loading>Loading Button</PrimaryButton>

    <TextButton href="https://www.google.com">Text Button with External Link</TextButton>
  </>
);
export const Primary = PrimaryTemplate.bind({});
export const Secondary = SecondaryTemplate.bind({});
export const Tertiary = TertiaryTemplate.bind({});
export const PrimarySmall = PrimaryTemplate.bind({});
export const PrimaryLarge = PrimaryTemplate.bind({});
export const PrimaryIconLeft = PrimaryTemplate.bind({});
export const PrimaryIconRight = PrimaryTemplate.bind({});
export const PrimaryIcon = PrimaryTemplate.bind({});
export const SecondaryIcon = SecondaryTemplate.bind({});
export const DefaultWithExternalLink = PrimaryTemplate.bind({});

Primary.args = { children: "Label" };
PrimarySmall.args = { ...Primary.args, size: "small" };
PrimaryLarge.args = { ...Primary.args, size: "large" };
Secondary.args = { ...Primary.args, template: "secondary" };
Tertiary.args = { ...Primary.args, template: "tertiary" };
PrimaryIconLeft.args = { ...Primary.args, startIconName: "info-fill" };
PrimaryIconRight.args = { ...Primary.args, endIconName: "info-fill" };
PrimaryIcon.args = { icon: "info-fill" };
SecondaryIcon.args = { icon: "settings", size: "small" };
DefaultWithExternalLink.args = {
  ...Primary.args,
  href: "https://www.google.com",
};
