import { Drawer } from "@material-ui/core";
import NavContent from "./NavContent";
import "./sidebar.scss";

function Sidebar({ address }: { address: string }) {
  return (
    <div className={`sidebar`} id="sidebarContent">
      <Drawer variant="permanent" anchor="left">
        <NavContent address={address} />
      </Drawer>
    </div>
  );
}

export default Sidebar;
