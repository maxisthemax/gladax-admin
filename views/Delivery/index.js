import { useState, useEffect, useCallback, useMemo } from "react";
import { useSnackbar } from "notistack";
import { unflatten, flatten } from "flat";
import { reactLocalStorage } from "reactjs-localstorage";

//*lodash
import has from "lodash/has";
import omit from "lodash/omit";
import find from "lodash/find";
import trim from "lodash/trim";
import isEmpty from "lodash/isEmpty";
import forOwn from "lodash/forOwn";

//*components
import DeliveryDialog from "./DeliveryDialog";
import { CustomIcon } from "components/Icons";
import { DataGridTable } from "components/Table";
import { Button } from "components/Buttons";
import { useDialog } from "components/Dialogs";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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

//*custom components
const ISSERVER = typeof window === "undefined";

function Delivery() {
  //*define
  const {
    Dialog: DialogConfirm,
    handleOpenDialog: handleOpenDialogDeleteConfirm,
    handleCloseDialog: handleCloseDialogDelteConfirm,
  } = useDialog();
  const { data, mutate, isValidating, error } = useSwrHttp("delivery", {
    fallbackData: [],
  });
  const flatData = useMemo(
    () =>
      data.reduce((temp, value) => {
        temp.push(flatten(value));
        return temp;
      }, []),
    [data]
  );

  const [selectionModel, setSelectionModel] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  //*states
  const [editedData, setEditedData] = useState({});

  //*const
  const lookupState = ISSERVER
    ? {}
    : reactLocalStorage.getObject("delivery_TableLookupHide");

  const RenderCell = ({ field, formattedValue, api, id }) => {
    const isEdited = has(editedData, `${id}.${field}`);
    const findData = find(flatData, { id: id }) || "";
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
          <Box
            textOverflow="ellipsis"
            overflow="hidden"
            pl={2}
            pr={2}
            sx={{ placeSelf: "center" }}
          >
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

  const RenderEditStringCell = ({ id, field, api, value }) => {
    const cellElement = api.getCellElement(id, field);
    const anchor = cellElement.getBoundingClientRect();

    return (
      <Box>
        <Popover
          anchorReference="anchorPosition"
          keepMounted={false}
          open={true}
          onClose={() => {
            const stringValue = document.getElementById(
              `${id}${field}_string`
            ).value;
            api.setEditCellValue({ id, field, value: stringValue });
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

  const columns = [
    {
      field: "vendor",
      headerName: "Vendor",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
      renderEditCell: RenderEditStringCell,
      hide: lookupState["vendor"],
    },
    {
      field: "desc",
      headerName: "Description",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
      renderEditCell: RenderEditStringCell,
      hide: lookupState["desc"],
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      editable: true,
      width: 160,
      renderCell: RenderCell,
      hide: lookupState["price"],
    },
    {
      field: "criteria.minWeight",
      headerName: "Min Weight (g)",
      type: "number",
      editable: true,
      width: 180,
      renderCell: RenderCell,
      hide: lookupState["criteria.minWeight"],
    },
    {
      field: "criteria.maxWeight",
      headerName: "Max Weight (g)",
      type: "number",
      editable: true,
      width: 180,
      renderCell: RenderCell,
      hide: lookupState["criteria.maxWeight"],
    },
  ];

  //*let

  //*ref

  //*useEffect
  useEffect(() => {
    if (!isValidating)
      if (error?.response) {
        const errorMessage = error.response.data.message;
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      }
  }, [enqueueSnackbar, error, isValidating]);

  //*functions
  const handleEditCell = useCallback(
    (editData) => {
      const { field, value, id } = editData;

      const findData = find(flatData, { id: id }) || "";

      if (trim(value) !== trim(findData[`${field}`])) {
        setEditedData({ ...editedData, [`${id}.${field}`]: value });
      } else {
        setEditedData({ ...omit(editedData, [`${id}.${field}`]) });
      }
    },
    [flatData, editedData]
  );
  const handleUndoEditData = useCallback(
    (id, field) => {
      setEditedData({ ...omit(editedData, [`${id}.${field}`]) });
    },
    [editedData]
  );

  const handleSaveAll = useCallback(async () => {
    const unflatEditData = unflatten(editedData);
    const allPromises = [];
    forOwn(unflatEditData, (flatData, key) => {
      allPromises.push(axios.patch(`delivery/${key}`, flatData));
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
  }, [editedData]);

  const handleDelete = useCallback(async () => {
    const allPromises = [];
    selectionModel.forEach((key) =>
      allPromises.push(axios.delete(`delivery/${key}`))
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
    handleCloseDialogDelteConfirm();
  }, [selectionModel]);

  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          <Box pb={2}>
            <Stack spacing={2} direction="row">
              <DeliveryDialog />
              {!isEmpty(editedData) && (
                <Button
                  onClick={handleSaveAll}
                  startIcon={<CustomIcon icon="save" color="white" />}
                >
                  Save
                </Button>
              )}
              {!isEmpty(selectionModel) && (
                <Button
                  onClick={handleOpenDialogDeleteConfirm}
                  startIcon={<CustomIcon icon="save" color="white" />}
                >
                  Delete {`(${selectionModel.length})`}
                </Button>
              )}
            </Stack>
          </Box>
          {flatData && flatData.length > 0 && (
            <DataGridTable
              id="delivery"
              isValidating={isValidating}
              data={flatData}
              columns={columns}
              selectionModel={selectionModel}
              setSelectionModel={setSelectionModel}
              handleEditCell={handleEditCell}
            />
          )}
        </Box>
      </Box>
      <DialogConfirm title="Confirm Delete" handleOk={handleDelete}>
        <p>You want to delete?</p>
      </DialogConfirm>
    </Box>
  );
}

export default Delivery;
