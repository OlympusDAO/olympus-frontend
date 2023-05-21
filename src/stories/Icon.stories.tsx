import { Box } from "@mui/material";
import { ComponentMeta } from "@storybook/react";
import Icon, { OHMIconProps } from "src/components/library/Icon";
import iconsLib from "src/components/library/iconsLib";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Icon",
  component: Icon,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof Icon>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Library = () => {
  const icons = Object.keys(iconsLib).map(name => {
    const iconName = name as OHMIconProps["name"];
    return (
      <Box mr={2} flexDirection="column">
        <Icon key={iconName} name={iconName} />
        <p>{iconName}</p>
      </Box>
    );
  });
  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" textAlign="center">
      {icons}
    </Box>
  );
};
// More on args: https://storybook.js.org/docs/react/writing-stories/args
