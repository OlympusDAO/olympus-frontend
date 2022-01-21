import "./sidebar.scss";

import { Drawer } from "@material-ui/core";

import NavContent from "./NavContent.jsx";

function Sidebar() {
  return (
    <div className={`sidebar`} id="sidebarContent">
      <Drawer variant="permanent" anchor="left">
        <NavContent />
      </Drawer>
    </div>
  );
}

export default Sidebar;
