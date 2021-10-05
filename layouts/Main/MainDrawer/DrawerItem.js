import { useRouter } from "next/router";
//*lodash

//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

//*assets

//*redux

//*utils

//*helpers

//*style

//*custom components

function DrawerItem({ label, icon, href }) {
  //*define
  const router = useRouter();

  //*states

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions
  const handleGoToPage = () => {
    router.push(href);
  };

  return (
    <ListItem button key={label} onClick={handleGoToPage}>
      <ListItemIcon>
        <CustomIcon icon={icon} />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
}

export default DrawerItem;
