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

function LayoutWrapper({ children }) {
  //*define
  const router = useRouter();

  //*states

  //*const
  const minimialPath = ["/login", "/signup"];

  //*let

  //*ref

  //*useEffect

  //*functions
  if (includes(minimialPath, router.pathname))
    return <Minimal>{children}</Minimal>;
  else return <Main>{children}</Main>;
}

export default LayoutWrapper;
