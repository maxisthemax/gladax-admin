import { useMemo } from "react";

//*components
import { CustomTabs } from "components/Tabs";
import CreateNewBuild from "./CreateNewBuild";
import { CustomIcon } from "components/Icons";
import LinkProductToBuild from "./LinkProductToBuild";

//*lodash
import orderBy from "lodash/orderBy";
import filter from "lodash/filter";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

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
      const emptyProduct = value.categories?.reduce((temp, cat) => {
        const mapProdct = filter(
          cat.products,
          ({ isAvailable }) => !isAvailable
        );

        if (mapProdct.length > 0) {
          temp = [...temp, ...mapProdct];
        }
        return temp;
      }, []);

      temp.push({
        value: value.id,
        label: (
          <Stack direction="row" spacing={1} alignItems="center">
            <Box>{value.name}</Box>
            {emptyProduct.length > 0 && (
              <Tooltip
                title={
                  <ul>
                    {emptyProduct.map(({ name }) => {
                      return <li>Product {name} Not Available</li>;
                    })}
                  </ul>
                }
              >
                <IconButton size="small">
                  <CustomIcon
                    icon="report"
                    color="red"
                    variant="outlined"
                    size="small"
                  />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ),
        content: (
          <LinkProductToBuild
            {...value}
            documents={orderBy(value.documents, ["order"], ["asc"])}
          />
        ),
      });
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
