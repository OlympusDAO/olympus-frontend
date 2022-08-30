import "src/components/Sidebar/Sidebar.scss";

import { Drawer } from "@mui/material";
import React from "react";
import NavContent from "src/components/Sidebar/NavContent";

const Sidebar: React.FC = () => (
  <div className="sidebar" id="sidebarContent">
    <Drawer variant="permanent" anchor="left">
      <NavContent />
    </Drawer>
  </div>
);

export default Sidebar;
