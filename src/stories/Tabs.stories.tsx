import { Box } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React, { ChangeEvent } from "react";
import Tab from "src/components/library/Tab";
import TabPanel from "src/components/library/TabPanel";
import Tabs from "src/components/library/Tabs";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Tabs",
  component: Tabs,
  parameters: {},
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Tabs>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tabs> = args => {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  const handleChange: any = (e: ChangeEvent<{}>, value: any) => {
    setActiveTab(value);
  };

  return (
    <Box>
      <Tabs {...args} value={activeTab} onChange={handleChange}>
        <Tab label="Tab 1" />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
        <Tab label="Tab 4" />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <>Tab Panel Content 1</>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <>Tab Panel Content 2</>
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <>Tab Panel Content 3</>
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <>Tab Panel Content 4</>
      </TabPanel>
    </Box>
  );
};

export const Default = Template.bind({});

Default.args = {
  centered: true,
  textColor: "primary",
  indicatorColor: "primary",
};
