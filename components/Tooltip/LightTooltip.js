//*lodash

//*components

//*material-ui
import Tooltip from "@mui/material/Tooltip";
import { withStyles } from "@mui/styles";

//*assets

//*redux

//*utils

//*helpers

//*style

//*custom components

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: "inherit",
  },
}))(Tooltip);

export default LightTooltip;
