import React, { useState } from "react";
import PropTypes from "prop-types";

//material-ui
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

//components
import { InViewPage } from "components/Pages";

//styles
const useStyles = makeStyles((theme) => ({
  divider: {
    border: 0,
    borderBottom: "1px solid #d0d0d0",
  },
  tabContainer: {
    position: "relative",
    width: "100%",
    marginTop: theme.spacing(2),
  },
  tabItem: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
}));

CustomTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
};

function CustomTabs({
  divider = true,
  tabs,
  defaultTabIndex,
  handleChangeFromParent,
  tabIndexFromParent,
  ...other
}) {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(
    defaultTabIndex ? defaultTabIndex : 0
  );

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <React.Fragment>
      <Tabs
        value={tabIndexFromParent ? tabIndexFromParent : tabIndex}
        onChange={
          handleChangeFromParent ? handleChangeFromParent : handleChange
        }
        variant="scrollable"
        aria-label="full width tabs example"
        {...other}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {divider && <Divider className={classes.divider} />}
      <InViewPage>
        <CustomTabsContent
          tabs={tabs}
          tabIndex={tabIndex}
          tabIndexFromParent={tabIndexFromParent}
        />
      </InViewPage>
    </React.Fragment>
  );
}

const CustomTabsContent = ({ tabs, tabIndex, tabIndexFromParent }) => {
  const classes = useStyles();
  return (
    <Box className={classes.tabContainer}>
      {tabs.map((tab, index) => {
        return (
          <InViewPage key={tab.label}>
            <Fade
              in={
                index === (tabIndexFromParent ? tabIndexFromParent : tabIndex)
              }
              className={classes.tabItem}
            >
              <div>{tab.content}</div>
            </Fade>
          </InViewPage>
        );
      })}
    </Box>
  );
};

export default React.memo(CustomTabs);
