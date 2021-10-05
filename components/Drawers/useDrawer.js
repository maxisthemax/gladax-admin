import { useState, useCallback } from "react";

//*lodash

//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import makeStyles from "@mui/styles/makeStyles";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import { useGetScreen } from "helpers/screenSizeHelpers";

//*assets

//*redux

//*utils

//*helpers

//*style
const useStyles = makeStyles((theme) => ({
  drawerClose: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: theme.spacing(1),
  },
}));

//*custom components

function DrawerComponent({
  children,
  size = 4,
  anchor = "right",
  maxHeight = "100%",
  handleCancel,
  open,
}) {
  const width = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const classes = useStyles();
  const smDown = useGetScreen("md", "down");

  return (
    <Drawer
      open={open}
      variant="temporary"
      anchor={anchor}
      PaperProps={{
        style: {
          width: `${smDown ? 100 : width[size]}%`,
          maxHeight: maxHeight,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      onClose={handleCancel}
    >
      {smDown && (
        <div className={classes.drawerClose}>
          <IconButton onClick={handleCancel} size="small">
            <CustomIcon icon="close" />
          </IconButton>
        </div>
      )}
      {children}
    </Drawer>
  );
}

const useDrawer = () => {
  const [open, setOpen] = useState(false);

  //*functions
  const handleOpenDrawer = () => {
    setOpen(true);
  };
  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const Drawer = useCallback(
    ({ children, ...props }) => {
      if (open)
        return (
          <DrawerComponent
            open={open}
            handleCancel={() => setOpen(false)}
            {...props}
          >
            {children}
          </DrawerComponent>
        );
      else return <div></div>;
    },
    [open]
  );

  return { isOpen: open, handleOpenDrawer, handleCloseDrawer, Drawer };
};

export default useDrawer;
