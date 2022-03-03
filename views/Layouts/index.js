//*components
import { CustomTabs } from "components/Tabs";
import HomeLayout from "./HomeLayout";
import StartYourBuildLayout from "./StartYourBuildLayout";
import PrivacyPolicy from "./PrivacyPolicy";

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
  ];

  return (
    <Box>
      <CustomTabs tabs={tabs} defaultTabIndex={0} />
    </Box>
  );
}

export default Layout;
