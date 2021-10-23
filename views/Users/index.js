import { useState, useCallback, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { unflatten } from "flat";
import { Form } from "react-final-form";

//*lodash
import has from "lodash/has";
import omit from "lodash/omit";
import find from "lodash/find";
import trim from "lodash/trim";
import isEmpty from "lodash/isEmpty";
import forOwn from "lodash/forOwn";

//*components
import { CustomIcon } from "components/Icons";
import { useDialog } from "components/Dialogs";

//*material-ui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

//*assets

//*redux

//*utils
import { addNewUserValidation } from "validation";

//*helpers
import axios from "utils/http-anxios";

//*styles

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

//*mui-rff
import { TextField } from "mui-rff";

//*custom components

function User() {
  //*define
  const { data, mutate, isValidating, error } = useSwrHttp("user", {
    fallbackData: [],
  });
  const [selectionModel, setSelectionModel] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { Dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  //*states
  const [editedData, setEditedData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

  const columns = [
    {
      field: "email",
      headerName: "Email",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
    },
    {
      field: "name",
      headerName: "Name",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
    },
    {
      field: "phoneNo",
      headerName: "Phone No",
      type: "string",
      editable: true,
      width: 300,
      renderCell: RenderCell,
    },
    {
      field: "role",
      headerName: "Role",
      type: "string",
      editable: true,
      width: 100,
      renderCell: RenderCell,
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
  const handleOpenUserDialog = () => {
    handleOpenDialog();
  };

  const onSubmit = async (value) => {
    try {
      const resData = await axios.post("user", value);
      mutate();
      enqueueSnackbar(resData.statusText, {
        variant: "success",
      });
      handleCloseDialog();
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
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Box style={{ minHeight: 400, width: "100%" }}>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ flexGrow: 1 }}>
          <Box pb={2}>
            <Stack spacing={2} direction="row">
              <Button
                onClick={handleOpenUserDialog}
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
        <Dialog
          title="Add New User"
          handleOk={() => {
            document
              .getElementById("addNewUserForm")
              .dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              );
          }}
        >
          <Form
            onSubmit={onSubmit}
            validate={addNewUserValidation}
            validateOnBlur={true}
            render={({ handleSubmit }) => {
              function myShowErrorFunction({
                meta: {
                  submitError,
                  dirtySinceLastSubmit,
                  error,
                  touched,
                  submitFailed,
                },
              }) {
                // this is actually the contents of showErrorOnBlur but you can be as creative as you want.
                return (
                  !!(
                    ((submitError && !dirtySinceLastSubmit) || error) &&
                    touched
                  ) && submitFailed
                );
              }
              return (
                <form id="addNewUserForm" onSubmit={handleSubmit} noValidate>
                  <Stack spacing={2}>
                    <TextField
                      label="Email"
                      name="email"
                      showError={myShowErrorFunction}
                      required={true}
                    />
                    <TextField
                      label="Password"
                      name="password"
                      required={true}
                      type={showPassword ? "text" : "password"}
                      inputProps={{
                        autoComplete: "new-password",
                      }}
                      showError={myShowErrorFunction}
                      helperText="Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleToggleShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <CustomIcon icon="visibility" color="black" />
                              ) : (
                                <CustomIcon icon="visibility_off" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Name"
                      name="name"
                      required={true}
                      showError={myShowErrorFunction}
                    />
                    <TextField
                      label="Address"
                      name="address"
                      required={true}
                      showError={myShowErrorFunction}
                    />
                    <TextField
                      label="Phone No."
                      name="phoneNo"
                      required={true}
                      showError={myShowErrorFunction}
                    />
                  </Stack>
                </form>
              );
            }}
          />
        </Dialog>
      </Box>
    </Box>
  );
}

export default User;
