import { useCallback, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { reactLocalStorage } from "reactjs-localstorage";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { arrayMoveImmutable } from "array-move";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

//*lodash
import map from "lodash/map";
import forOwn from "lodash/forOwn";
import values from "lodash/values";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";
import indexOf from "lodash/indexOf";

//*components
import { Button } from "components/Buttons";

//*material-ui
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import makeStyles from "@mui/styles/makeStyles";
import Popover from "@mui/material/Popover";

//*assets

//*redux

//*utils

//*helpers

//*styles
const useStyles = makeStyles((theme) => ({
  dataGrid: {
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
        padding: "0",
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
  rowHeight = 50,
  checkboxSelection = true,
}) {
  //*const

  const columnsOrderLS = ISSERVER
    ? null
    : reactLocalStorage.getObject(`${id}_columnsOrder`);
  const [columnsOrder, setColumnsOrder] = useState(
    columnsOrderLS ? columnsOrderLS : map(columns, "field")
  );
  const sortedColumns = sortBy(columns, ({ field }) => {
    return indexOf(columnsOrder, field);
  });
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

  const onDragEnd = (data) => {
    const { source, destination } = data;

    if (!source) return;
    if (!destination) return;

    const sourceIndex = source.index;
    const destIndex = destination.index;
    const sourceDropId = source.droppableId;
    const destDropId = destination.droppableId;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (data.type === "columns" && sourceDropId === destDropId) {
      const reordered = map(
        arrayMoveImmutable(sortedColumns, sourceIndex, destIndex),
        "field"
      );
      reactLocalStorage.setObject(`${id}_columnsOrder`, reordered);
      setColumnsOrder(reordered);
    }
  };

  return (
    <Box height="80vh">
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <>
            <Button
              variant="contained"
              size="small"
              {...bindTrigger(popupState)}
            >
              Reorder Column
            </Button>
            <Box p={1}></Box>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={id} type="columns">
                  {(provided) => {
                    return (
                      <List
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ maxHeight: "600px", overflow: "overlay" }}
                      >
                        {sortedColumns &&
                          sortedColumns.map((column, index) => {
                            return (
                              <Draggable
                                key={column.field}
                                draggableId={column.field}
                                index={index}
                              >
                                {(provided) => {
                                  return (
                                    <Paper
                                      sx={{ m: 1 }}
                                      ref={provided && provided.innerRef}
                                      {...(provided && provided.draggableProps)}
                                      {...(provided &&
                                        provided.dragHandleProps)}
                                    >
                                      <ListItem>{column.headerName}</ListItem>
                                    </Paper>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </List>
                    );
                  }}
                </Droppable>
              </DragDropContext>
              <Box p={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setColumnsOrder([]);
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Popover>
          </>
        )}
      </PopupState>
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
        rowHeight={rowHeight}
        loading={isValidating}
        rows={data}
        columns={sortedColumns}
        checkboxSelection={checkboxSelection}
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
    </Box>
  );
}

export default DataGridTable;
