import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Form } from "react-final-form";

//*lodash

//*components
import { TextFieldForm } from "components/Form";
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
import axios from "utils/http-anxios";

//*validation
import { addNewUserValidation } from "validation";

//*helpers

//*styles

//*useHooks
import useSwrHttp from "useHooks/useSwrHttp";

//*mui-rff

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
    } catch (eror) {
      const errorMessage = eror.response.data.message;
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
          validate={addNewUserValidation}
          onSubmit={onSubmit}
          validateOnBlur={true}
          render={({ handleSubmit }) => {
            return (
              <form id="addNewUserForm" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  <TextFieldForm label="Email" name="email" required={true} />
                  <TextFieldForm
                    label="Password"
                    name="password"
                    required={true}
                    type={showPassword ? "text" : "password"}
                    inputProps={{
                      autoComplete: "new-password",
                    }}
                    helperText="Minimum six characters, at least one letter and one number"
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
                  <TextFieldForm label="Name" name="name" required={true} />
                  <TextFieldForm
                    label="Address"
                    name="address"
                    required={true}
                  />
                  <TextFieldForm
                    label="Phone No."
                    name="phoneNo"
                    required={true}
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
