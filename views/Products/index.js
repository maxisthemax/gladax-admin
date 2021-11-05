//*lodash

//*components
import CategoryTable from "./CategoryTable";
import { CustomTabs } from "components/Tabs";

//*material-ui
import Box from "@mui/material/Box";

//*assets

//*redux

//*utils
//*helpers

//*styles

//*useHooks

//*custom components

function Products() {
  //*define

  //*states

  //*const
  const tabs = [
    {
      value: "category",
      label: "Category",
      content: <CategoryTable />,
    },
  ];

  //*let

  //*ref

  //*useEffect

  //*functions

  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          <CustomTabs tabs={tabs} defaultTabIndex={0} />
        </Box>
      </Box>
    </Box>
  );
}

export default Products;
