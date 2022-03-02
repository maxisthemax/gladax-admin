import { useRouter } from "next/router";

//*lodash
import includes from "lodash/includes";

//*components
import Minimal from "layouts/Minimal";
import Main from "layouts/Main";

//*material-ui

//*assets

//*redux

//*utils

//*helpers

//*style

//*custom components

import useUser from "useHooks/useUser";

function LayoutWrapper({ children }) {
  //*define
  const { userData } = useUser();
  const router = useRouter();

  //*states

  //*const
  const minimialPath = ["/login", "/signup"];

  //*let

  //*ref

  //*useEffect

  //*functions
  if (includes(minimialPath, router.pathname) || !userData?.id)
    return <Minimal>{children}</Minimal>;
  else return <Main>{children}</Main>;
}

export default LayoutWrapper;
