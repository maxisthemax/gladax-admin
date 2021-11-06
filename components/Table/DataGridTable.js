import { useCallback } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { reactLocalStorage } from "reactjs-localstorage";

//*lodash
import forOwn from "lodash/forOwn";
import values from "lodash/values";
import filter from "lodash/filter";

//*components

//*material-ui
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";

//*assets

//*redux

//*utils

//*helpers

//*styles

//*useHooks

//*mui-rff

//*custom components
const ISSERVER = typeof window === "undefined";
function CustomToolbar({ id }) {
  const lookupState = ISSERVER
    ? {}
    : reactLocalStorage.getObject(`${id}_TableLookupHide`);

  const columnHide = values(lookupState);
  const totalHide = filter(columnHide, (hide) => hide).length;

  return (
    <GridToolbarContainer>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <Badge badgeContent={totalHide} color="primary">
          <GridToolbarColumnsButton />
        </Badge>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );
}

function DataGridTable({
  id,
  isValidating,
  data,
  columns,
  selectionModel,
  setSelectionModel,
  handleEditCell,
}) {
  //*const
  const densityState = ISSERVER
    ? "compact"
    : reactLocalStorage.getObject(`${id}_TableDensity`);

  //*functions
  const handleSaveColumnHideState = (id, lookup) => {
    let hideColumn = {};
    forOwn(lookup, (data, key) => {
      hideColumn[key] = data.hide;
    });
    reactLocalStorage.setObject(id, hideColumn);
  };
  const handleSaveDensityState = (id, density) => {
    reactLocalStorage.setObject(id, density);
  };
  const handleCellKeyDown = useCallback((params, event) => {
    if (!["Escape", "Delete", "Backspace", "Enter"].includes(event.key)) {
      event.defaultMuiPrevented = true;
    }
  }, []);

  const customToolbar = () => <CustomToolbar id={id} />;

  return (
    <DataGrid
      columnBuffer={2}
      columnThreshold={2}
      onStateChange={(state) => {
        handleSaveDensityState(`${id}_TableDensity`, state.density);
        handleSaveColumnHideState(
          `${id}_TableLookupHide`,
          state.columns.lookup
        );
      }}
      components={{
        Toolbar: customToolbar,
      }}
      autoHeight
      loading={isValidating}
      autoPageSize
      rows={data}
      columns={columns}
      checkboxSelection
      disableSelectionOnClick
      editMode="cell"
      density={densityState.value || "compact"}
      onCellEditCommit={handleEditCell}
      onCellKeyDown={handleCellKeyDown}
      onSelectionModelChange={(newSelectionModel) => {
        setSelectionModel(newSelectionModel);
      }}
      selectionModel={selectionModel}
    />
  );
}

export default DataGridTable;
