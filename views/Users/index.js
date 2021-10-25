import { useState, useCallback, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { unflatten } from "flat";
import { reactLocalStorage } from "reactjs-localstorage";

//*lodash
import has from "lodash/has";
import omit from "lodash/omit";
import find from "lodash/find";
import trim from "lodash/trim";
import isEmpty from "lodash/isEmpty";
import forOwn from "lodash/forOwn";

//*components
import UserDialog from "./UserDialog";
import { LightTooltip } from "components/Tooltip";
import { CustomIcon } from "components/Icons";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Popover from "@mui/material/Popover";

//*assets

//*redux

//*utils
import axios from "utils/http-anxios";

//*helpers

//*styles

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

//*mui-rff

//*custom components
const ISSERVER = typeof window === "undefined";
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function User() {
  //*define
  const { data, mutate, isValidating, error } = useSwrHttp("user", {
    fallbackData: [],
  });
  const [selectionModel, setSelectionModel] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  //*states
  const [editedData, setEditedData] = useState({});

  //*const
  const RenderCell = ({ field, formattedValue, api, id }) => {
    const isEdited = has(editedData, `${id}.${field}`);
    const findData = find(data, { id: id }) || "";
    const handleClickUndoButton = () => {
      handleUndoEditData(id, field);
      api.setEditCellValue({ id, field, value: findData[`${field}`] });
      api.commitCellChange({ id, field });
      api.setCellMode(id, field, "view");
    };
    const cellElement = api.getCellElement(id, field);
    return (
      <LightTooltip
        placement="bottom-start"
        title={formattedValue ? formattedValue : ""}
        disableHoverListener={
          cellElement?.scrollWidth <= cellElement?.clientWidth
        }
      >
        <Box
          bgcolor={isEdited ? "#ff943975" : "inherit"}
          width={isEdited ? "100%" : "auto"}
        >
          <Box display="flex" justifyContent="space-between">
            <Box textOverflow="ellipsis" overflow="hidden" pl={2} pr={2}>
              {formattedValue}
            </Box>
            {isEdited && (
              <Box>
                <IconButton size="small" onClick={handleClickUndoButton}>
                  <CustomIcon size="small" icon="undo" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </LightTooltip>
    );
  };

  const RenderEditStringCell = ({ id, field, api, value }) => {
    const cellElement = api.getCellElement(id, field);
    const anchor = cellElement.getBoundingClientRect();

    return (
      <Box>
        <Popover
          anchorReference="anchorPosition"
          keepMounted={false}
          open={open}
          onClose={() => {
            const stringValue = document.getElementById(
              `${id}${field}_string`
            ).value;
            api.setEditCellValue({ id, field, value: stringValue }, event);
            api.commitCellChange({ id, field });
            api.setCellMode(id, field, "view");

            handleEditCell({ field, id, value: stringValue });
          }}
          anchorPosition={{ top: anchor.top, left: anchor.left }}
        >
          <Box sx={{ width: "300px" }}>
            <TextField
              id={`${id}${field}_string`}
              fullWidth
              multiline
              rows={4}
              defaultValue={value}
            />
          </Box>
        </Popover>
      </Box>
    );
  };
  const lookupState = ISSERVER
    ? {}
    : reactLocalStorage.getObject("userTableLookupHide");
  const densityState = ISSERVER
    ? "compact"
    : reactLocalStorage.getObject("userTableDensity");

  const columns = [
    {
      field: "email",
      headerName: "Email",
      type: "string",
      editable: false,
      width: 300,
      renderCell: RenderCell,
      hide: lookupState["email"]?.hide,
    },
    {
      field: "name",
      headerName: "Name",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
      hide: lookupState["name"]?.hide,
    },
    {
      field: "phoneNo",
      headerName: "Phone No",
      type: "string",
      editable: true,
      width: 150,
      renderCell: RenderCell,
      hide: lookupState["phoneNo"]?.hide,
    },
    {
      field: "address",
      headerName: "Address",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
      renderEditCell: RenderEditStringCell,
      hide: lookupState["address"]?.hide,
    },
    {
      field: "role",
      headerName: "Role",
      type: "string",
      editable: false,
      width: 100,
      renderCell: RenderCell,
      hide: lookupState["role"]?.hide,
    },
  ];

  //*let

  //*ref

  //*useEffect
  useEffect(() => {
    if (!isValidating)
      if (error?.response) {
        const errorMessage = error.response.statusText;
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      }
  }, [enqueueSnackbar, error, isValidating]);

  //*functions
  const handleEditCell = (editData) => {
    const { field, value, id } = editData;
    const findData = find(data, { id: id }) || "";
    if (trim(value) !== trim(findData[`${field}`]))
      setEditedData({ ...editedData, [`${id}.${field}`]: value });
    else {
      setEditedData({ ...omit(editedData, [`${id}.${field}`]) });
    }
  };

  const handleUndoEditData = (id, field) => {
    setEditedData({ ...omit(editedData, [`${id}.${field}`]) });
  };

  const handleSaveAll = async () => {
    const unflatEditData = unflatten(editedData);
    const allPromises = [];
    forOwn(unflatEditData, (data, key) => {
      allPromises.push(axios.patch(`user/${key}`, data));
    });
    const resData = await Promise.allSettled(allPromises);
    resData.forEach(({ status, value, reason }) => {
      if (status === "fulfilled")
        enqueueSnackbar(value.statusText, {
          variant: "success",
        });
      else
        enqueueSnackbar(reason.response.data.message, {
          variant: "error",
        });
    });
    setEditedData({});
  };

  const handleDelete = async () => {
    const allPromises = [];
    selectionModel.forEach((key) =>
      allPromises.push(axios.delete(`user/${key}`))
    );
    const resData = await Promise.allSettled(allPromises);
    resData.forEach(({ status, value, reason }) => {
      if (status === "fulfilled")
        enqueueSnackbar(value.statusText, {
          variant: "success",
        });
      else
        enqueueSnackbar(reason.response.data.message, {
          variant: "error",
        });
    });
    setEditedData({});
    mutate();
  };

  const handleCellKeyDown = useCallback((params, event) => {
    if (!["Escape", "Delete", "Backspace", "Enter"].includes(event.key)) {
      event.defaultMuiPrevented = true;
    }
  }, []);

  const handleSaveColumnHideState = (lookup) => {
    let hideColumn = {};
    forOwn(lookup, (data, key) => {
      hideColumn[key] = data.hide;
    });
    reactLocalStorage.setObject("userTableLookupHide", hideColumn);
  };

  const handleSaveDensityState = (density) => {
    reactLocalStorage.setObject("userTableDensity", density);
  };

  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          <Box pb={2}>
            <Stack spacing={2} direction="row">
              <UserDialog />
              {!isEmpty(editedData) && (
                <Button
                  size="small"
                  onClick={handleSaveAll}
                  variant="contained"
                  startIcon={<CustomIcon icon="save" color="white" />}
                >
                  Save
                </Button>
              )}
              {!isEmpty(selectionModel) && (
                <Button
                  size="small"
                  onClick={handleDelete}
                  variant="contained"
                  startIcon={<CustomIcon icon="save" color="white" />}
                >
                  Delete {`(${selectionModel.length})`}
                </Button>
              )}
            </Stack>
          </Box>
          <DataGrid
            onStateChange={(state) => {
              handleSaveDensityState(state.density);
              handleSaveColumnHideState(state.columns.lookup);
            }}
            components={{
              Toolbar: CustomToolbar,
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
        </Box>
      </Box>
    </Box>
  );
}

export default User;
