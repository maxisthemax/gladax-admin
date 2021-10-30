import { useDispatch } from "reactive-react-redux";
import { useRouter } from "next/router";
//*lodash

//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

//*assets

//*redux
import { toggleDrawer } from "./mainLayoutState";

//*utils
import { pageData } from "utils/constant";

//*helpers
import { useGetScreen } from "helpers/screenSizeHelpers";

//*style

//*custom components

function MainAppBar() {
  //*define
  const dispatch = useDispatch();
  const mdUp = useGetScreen("md", "up");
  const router = useRouter();

  //*states

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions
  const handleGoToMainPage = () => {
    router.push("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={mdUp && { zIndex: (theme) => theme.zIndex.drawer + 1 }}
        variant="dense"
      >
        <Toolbar variant="dense">
          {!mdUp && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => dispatch(toggleDrawer())}
              edge="start"
              sx={{ mr: 2 }}
            >
              <CustomIcon icon="menu" color="white" />
            </IconButton>
          )}

          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={handleGoToMainPage}
            sx={{ cursor: "pointer" }}
          >
            {pageData.mainTitle}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default MainAppBar;
