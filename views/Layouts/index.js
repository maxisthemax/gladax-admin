//*components
import { CustomTabs } from "components/Tabs";
import HomeLayout from "./HomeLayout";
import StartYourBuildLayout from "./StartYourBuildLayout";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsOfUse";
import About from "./About";

//*lodash

//*material-ui
import Box from "@mui/material/Box";

//*utils

//*useHooks

function Layout() {
  //*define

  //*functions
  const tabs = [
    {
      value: "home",
      label: "Home",
      content: <HomeLayout />,
    },
    {
      value: "startyourbuild",
      label: "Start Your Build",
      content: <StartYourBuildLayout />,
    },
    {
      value: "privacypolicy",
      label: "Privacy Policy",
      content: <PrivacyPolicy />,
    },
    {
      value: "termsofuse",
      label: "Terms Of Use",
      content: <TermsOfUse />,
    },
    {
      value: "about",
      label: "About",
      content: <About />,
    },
  ];

  return (
    <Box>
      <CustomTabs tabs={tabs} defaultTabIndex={0} />
    </Box>
  );
}

export default Layout;
