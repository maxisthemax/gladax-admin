import { useRouter } from "next/router";
//*lodash

//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

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
    <ListItemButton onClick={handleGoToPage}>
      <ListItemIcon>
        <CustomIcon icon={icon} />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

export default DrawerItem;
