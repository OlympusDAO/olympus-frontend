import "./Sidebar.scss";

import { Drawer } from "@material-ui/core";
import React from "react";

import NavContent from "./NavContent";

const Sidebar: React.FC = () => (
  <div className="sidebar" id="sidebarContent">
    <Drawer variant="permanent" anchor="left">
      <NavContent />
    </Drawer>
  </div>
);

export default Sidebar;
