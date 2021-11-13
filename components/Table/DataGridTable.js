import { useCallback } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
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
import makeStyles from "@mui/styles/makeStyles";

//*assets

//*redux

//*utils

//*helpers

//*styles
const useStyles = makeStyles((theme) => ({
  dataGrid: {
    minHeight: "132px",

    "& .MuiDataGrid-dataContainer, & .MuiDataGrid-viewport": {
      minWidth: "auto!important",
    },

    "& .MuiDataGrid-viewport": {
      width: "fit-content",
      maxWidth: "none!important",
      minWidth: "100%!important",
    },

    "& .MuiDataGrid-viewport, & .MuiDataGrid-renderingZone, & .MuiDataGrid-row":
      {
        maxHeight: "fit-content!important",
      },

    "& .MuiDataGrid-renderingZone": {
      transform: "none!important",
      marginRight: "-16px",
    },

    "& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-cell": {
      textOverflow: "unset",
      whiteSpace: "normal",
      lineHeight: "1.2!important",
      maxHeight: "fit-content!important",
      minHeight: "auto!important",
      height: "auto",
      display: "flex",
      alignItems: "center",
      alignSelf: "stretch",

      "& > div": {
        maxHeight: "inherit",
        width: "100%",
        whiteSpace: "initial",
        lineHeight: "1",
      },
    },

    "& .MuiDataGrid-columnHeader > div": {
      height: "100%",
    },

    "& .MuiDataGrid-columnHeaderWrapper": {
      maxHeight: "none!important",
      flex: "1 0 auto",
    },

    "& .MuiDataGrid-row .MuiDataGrid-columnsContainer": {
      maxHeight: "none!important",
    },

    "& .MuiDataGrid-cell": {
      overflowWrap: "anywhere",
      padding: "0",

      "&--textRight div": {
        textAlign: "right",
        justifyContent: "flex-end",
      },

      "&:last-of-type > div": {
        paddingRight: theme.spacing(3),
      },

      "& > div": {
        padding: "0.75em",
        display: "flex",
        alignSelf: "stretch",
        alignItems: "center",
      },
    },
  },
}));

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
  const classes = useStyles();

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
      className={classes.dataGrid}
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
      density="standard"
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
