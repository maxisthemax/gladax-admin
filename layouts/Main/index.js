//*lodash

//*components
import MainAppBar from "./MainAppBar";
import MainDrawer from "./MainDrawer";

//*material-ui
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

//*assets

//*redux

//*utils

//*helpers

//*style

//*custom components

const drawerWidth = 240;

function Main({ children }) {
  //*define

  //*states

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions

  return (
    <Box sx={{ display: "flex" }}>
      <MainAppBar />
      <MainDrawer drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar variant="dense" />
        <div>{children}</div>
      </Box>
    </Box>
  );
}

export default Main;
