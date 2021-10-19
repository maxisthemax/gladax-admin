import { useEffect, useState } from "react";
import { useRouter } from "next/router";

//*lodash
import includes from "lodash/includes";

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

//*useHooks
import useUser from "useHooks/useUser";

function AuthWrapper({ children }) {
  //*define
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userData, isValidating } = useUser();

  //*states

  //*const

  //*let

  //*ref

  //*useEffect
  useEffect(() => {
    if (!isValidating) {
      if (userData?.id) {
        if (includes(["/login", "/signup"], router.pathname)) {
          router.replace("/");
        }
      } else {
        if (!includes(["/login", "/signup"], router.pathname)) {
          router.replace("/login");
        }
      }

      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [userData, isValidating]);

  //*functions

  return (
    <div>
      <Backdrop
        transitionDuration={0}
        invisible={false}
        sx={{
          backgroundColor: "white",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress />
      </Backdrop>
      {children}
    </div>
  );
}
export default AuthWrapper;
