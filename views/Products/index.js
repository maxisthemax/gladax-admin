import { DataGrid } from "@mui/x-data-grid";
//*lodash

//*components

//*material-ui
import Box from "@mui/material/Box";

//*assets

//*redux

//*utils

//*helpers

//*styles

//*custom components

function Products() {
  //*define

  //*states

  //*const
  const columns = [];
  const rows = [];

  //*let

  //*ref

  //*useEffect

  //*functions

  return (
    <Box style={{ height: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          <DataGrid
            autoPageSize
            rows={rows}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            density="compact"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Products;
