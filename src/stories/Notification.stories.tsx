import { Button } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import {
  DefaultNotification,
  ErrorNotification,
  InfoNotification,
  SuccessNotification,
  WarningNotification,
} from "src/components/library/Notification";
import Notification from "src/components/library/Notification/Notification";
import { withDesign } from "storybook-addon-designs";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Notification",
  component: Notification,
  parameters: {
    actions: { argTypesRegex: null },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/J9pbZ330V6V6Hau7MtuhtC/DS-V2?node-id=27%3A9614",
    },
  },
  decorators: [withDesign],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Notification>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const InfoTemplate: ComponentStory<typeof Notification> = args => <InfoNotification {...args} />;
const InfoDarkTemplate: ComponentStory<typeof Notification> = args => <WarningNotification {...args} />;
const ErrorTemplate: ComponentStory<typeof Notification> = args => <ErrorNotification {...args} />;
const SuccessTemplate: ComponentStory<typeof Notification> = args => <SuccessNotification {...args} />;
const DefaultTemplate: ComponentStory<typeof Notification> = args => <DefaultNotification {...args} />;

export const AllNotificationStyles = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <InfoNotification>This is an Info notification</InfoNotification>
      <WarningNotification>This is a Warning notification</WarningNotification>
      <ErrorNotification>This is an error notification</ErrorNotification>
      <SuccessNotification>This is Success notification</SuccessNotification>
      <DefaultNotification>This is a default notification</DefaultNotification>
      <DefaultNotification dismissible>This is a dismissible notification. </DefaultNotification>
      <InfoNotification dismissible>
        More is more and less is a bore Versace Versace Versace I only date supermodels when in doubt, wear red hand
        stitched Absolutely Fabulous Hermes Christian Dior denim flow.{" "}
      </InfoNotification>
      <DefaultNotification show={open} onDismiss={() => setOpen(false)} dismissible style={{ width: "833px" }}>
        This is a dismissible notification with custom width
      </DefaultNotification>
      <Button onClick={() => setOpen(true)}>Reappear After Dismiss</Button>
    </>
  );
};

export const Info = InfoTemplate.bind({});
export const InfoDark = InfoDarkTemplate.bind({});
export const Dismissible = InfoTemplate.bind({});
export const Error = ErrorTemplate.bind({});
export const Success = SuccessTemplate.bind({});
export const Default = DefaultTemplate.bind({});

Info.args = { children: "This is an Info notification" };
InfoDark.args = { children: "This is a Dark Info notification" };
Dismissible.args = { ...Info.args, dismissible: true };
Error.args = { children: "This is an error notification" };
Success.args = { children: "This is Success notification" };
Default.args = { children: "This is a default notification" };
