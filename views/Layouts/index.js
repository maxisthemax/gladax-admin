//*components
import { CustomTabs } from "components/Tabs";
import HomeLayout from "./HomeLayout";

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
      label: "home",
      content: <HomeLayout />,
    },
  ];

  return (
    <Box>
      <CustomTabs tabs={tabs} defaultTabIndex={0} />
    </Box>
  );
}

export default Layout;
