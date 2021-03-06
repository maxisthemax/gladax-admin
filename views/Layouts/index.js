import { useState } from "react";

//*components
import HomeLayout from "./HomeLayout";
import StartYourBuildLayout from "./StartYourBuildLayout";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsOfUse";
import About from "./About";
import CancellationReturnPolicy from "./CancellationReturnPolicy";
import ContactUs from "./ContactUs";

//*lodash

//*material-ui
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

//*utils

//*useHooks

function Layout() {
  //*define
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
      value: "cancellationreturnpolicy",
      label: "Cancellation & Return Policy",
      content: <CancellationReturnPolicy />,
    },
    {
      value: "contactus",
      label: "Contact Us",
      content: <ContactUs />,
    },
    {
      value: "about",
      label: "About",
      content: <About />,
    },
  ];

  return (
    <Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            {tabs.map((tab) => (
              <Tab label={tab.label} value={tab.value} />
            ))}
          </TabList>
        </Box>
        {tabs.map((tab) => (
          <TabPanel value={tab.value}>{tab.content}</TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}

export default Layout;
