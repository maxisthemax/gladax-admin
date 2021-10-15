import { useState, useCallback, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { unflatten } from "flat";

//*lodash
import has from "lodash/has";
import omit from "lodash/omit";
import find from "lodash/find";
import trim from "lodash/trim";
import isEmpty from "lodash/isEmpty";
import forOwn from "lodash/forOwn";
import reduce from "lodash/reduce";

//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

//*assets

//*redux

//*utils

//*helpers
import axios from "utils/http-anxios";
import useSwrHttp from "utils/useSwrHttp";

//*styles

//*custom components

function DyanmicTable({ tableName, columnsData }) {
  //*define
  const { data, mutate, isValidating, error } = useSwrHttp(tableName, {
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

    return (
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
    );
  };
  const columnProperties = {
    boolean: { width: 115 },
    number: { width: 115 },
    dateTime: { width: 240 },
    string: { width: 400 },
  };
  const columns = reduce(
    columnsData,
    (res, data) => {
      res.push({
        ...data,
        width: columnProperties[`${data.type}`].width,
        renderCell: RenderCell,
      });
      return res;
    },
    []
  );

  //*let

  //*ref

  //*useEffect
  useEffect(() => {
    if (error) {
      const errorMessage = error.response.statusText;
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  }, [enqueueSnackbar, error]);

  //*functions
  const handleAddNewRow = async () => {
    const newData = {
      id: "new",
      dataBoolean: true,
      dataDate: new Date(),
      dataString: "",
      dataNumber: 0,
    };
    try {
      const data = await axios.post(tableName, newData);
      mutate();
      enqueueSnackbar(data.statusText, {
        variant: "success",
      });
    } catch ({ response }) {
      const errorMessage = response.data.message;
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

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
      allPromises.push(axios.patch(`${tableName}/${key}`, data));
    });
    const editRes = await Promise.all(allPromises);
    editRes.forEach((data) => {
      enqueueSnackbar(data.statusText, {
        variant: "success",
      });
    });
    setEditedData({});
  };

  const handleDelete = async () => {
    const allPromises = [];

    selectionModel.forEach((key) =>
      allPromises.push(axios.delete(`${tableName}/${key}`))
    );

    const deleteRes = await Promise.all(allPromises);
    deleteRes.forEach((data) => {
      enqueueSnackbar(data.statusText, {
        variant: "success",
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

  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          <Box pb={2}>
            <Stack spacing={2} direction="row">
              <Button
                onClick={handleAddNewRow}
                size="small"
                variant="contained"
                startIcon={<CustomIcon icon="add" color="white" />}
              >
                New
              </Button>
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
            autoHeight
            loading={isValidating}
            autoPageSize
            rows={data}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            editMode="cell"
            density="compact"
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

export default DyanmicTable;
