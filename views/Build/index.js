import { useMemo } from "react";
//*components
import { CustomTabs } from "components/Tabs";
import CreateNewBuild from "./CreateNewBuild";

//*lodash

//*material-ui
import Box from "@mui/material/Box";

//*utils

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

function Build() {
  //*define
  const { data } = useSwrHttp(`build`, {
    fallbackData: [],
  });

  //*functions
  const newBuildTab = useMemo(() => {
    const newData = data.reduce((temp, value) => {
      temp.push({ value: value.id, label: value.name, content: <div /> });
      return temp;
    }, []);

    return newData;
  }, [data]);

  const tabs = [
    {
      value: "startnewbuild",
      label: "New Build",
      content: <CreateNewBuild />,
    },
    ...newBuildTab,
  ];

  return (
    <Box>
      <CustomTabs tabs={tabs} defaultTabIndex={0} />
    </Box>
  );
}

export default Build;
