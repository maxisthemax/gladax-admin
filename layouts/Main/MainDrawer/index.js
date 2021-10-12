import { useEffect } from "react";
import { useDispatch, useTrackedState } from "reactive-react-redux";

//*lodash

//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";

//*assets

//*redux
import { closeDrawer } from "../mainLayoutState";

//*utils
import routes from "utils/routes";
import { pageData } from "utils/constant";

//*helpers
import { useGetScreen } from "helpers/screenSizeHelpers";
import DrawerItem from "./DrawerItem";

//*style

//*custom components

function MainDrawer({ drawerWidth }) {
  //*define
  const mdUp = useGetScreen("md", "up");
  const {
    mainLayout: { drawerOpen },
  } = useTrackedState();
  const dispatch = useDispatch();

  //*states

  //*const

  //*let

  //*ref

  //*useEffect
  useEffect(() => {
    if (mdUp) dispatch(closeDrawer());
  }, [mdUp]);

  //*functions
  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
  };

  return (
    <>
      <Drawer
        onClose={handleCloseDrawer}
        open={drawerOpen}
        variant={mdUp ? "permanent" : "temporary"}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {mdUp && <Toolbar />}
        <Box sx={{ overflow: "auto" }}>
          <List component="nav">
            {!mdUp && (
              <>
                <ListItem>
                  <ListItemIcon
                    sx={{ cursor: "pointer" }}
                    onClick={handleCloseDrawer}
                  >
                    <CustomIcon icon="menu" />
                  </ListItemIcon>
                  <ListItemText primary={pageData.mainTitle} />
                </ListItem>
                <Divider />
              </>
            )}

            {routes.map(({ label, icon, href }) => (
              <DrawerItem key={href} label={label} icon={icon} href={href} />
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default MainDrawer;
