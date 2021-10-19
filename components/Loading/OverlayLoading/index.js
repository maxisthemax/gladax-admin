import { useTrackedState } from "reactive-react-redux";
//*lodash

//*components

//*material-ui
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

//*assets

//*redux

//*utils

//*helpers

//*style

//*custom components

function OverlayLoading({ children }) {
  //*define
  const {
    overlayLoading: { overlayOpen },
  } = useTrackedState();

  //*states

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions

  return (
    <>
      <Backdrop
        transitionDuration={0}
        invisible={false}
        sx={{
          backgroundColor: "white",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={overlayOpen}
      >
        <CircularProgress />
      </Backdrop>
      {children}
    </>
  );
}

export default OverlayLoading;
