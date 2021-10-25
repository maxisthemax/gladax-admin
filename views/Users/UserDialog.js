import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Form } from "react-final-form";

//*lodash

//*components
import { CustomIcon } from "components/Icons";
import { useDialog } from "components/Dialogs";

//*material-ui
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

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

function UserDialog() {
  //*define
  const { mutate, isValidating, error } = useSwrHttp("user", {
    fallbackData: [],
  });
  const { enqueueSnackbar } = useSnackbar();
  const { Dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  //*states
  const [showPassword, setShowPassword] = useState(false);

  //*const

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

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        size="small"
        variant="contained"
        startIcon={<CustomIcon icon="add" color="white" />}
      >
        New
      </Button>
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
    </>
  );
}

export default UserDialog;