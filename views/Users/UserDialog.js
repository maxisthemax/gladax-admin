import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Form } from "react-final-form";
import { Select } from "mui-rff";

//*lodash

//*components
import { TextFieldForm } from "components/Form";
import { CustomIcon } from "components/Icons";
import { useDialog } from "components/Dialogs";
import { Button } from "components/Buttons";

//*material-ui
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";

//*assets

//*redux

//*utils
import axios from "utils/http-anxios";

//*validation
import { addNewUser } from "validation";

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
        const errorMessage = error.response.data.message;
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
          initialValues={{ address: { country: "Malaysia" } }}
          validate={addNewUser}
          onSubmit={onSubmit}
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
                    label="Phone No."
                    name="phoneNo"
                    required={true}
                  />
                  <TextFieldForm
                    label="Address1"
                    name="address.address1"
                    required={true}
                  />
                  <TextFieldForm label="Address2" name="address.address2" />
                  <Stack spacing={2} direction="row">
                    <TextFieldForm
                      label="Country"
                      name="address.country"
                      required={true}
                      disabled
                    />
                    <Select name="address.state" label="State" size="small">
                      <MenuItem value="Selangor">Selangor</MenuItem>
                      <MenuItem value="Kuala Lumpur">Kuala Lumpur</MenuItem>
                      <MenuItem value="Putrajaya">Putrajaya</MenuItem>
                      <MenuItem value="Johor">Johor</MenuItem>
                      <MenuItem value="Kedah">Kedah</MenuItem>
                      <MenuItem value="Kelantan">Kelantan</MenuItem>
                      <MenuItem value="Melaka">Melaka</MenuItem>
                      <MenuItem value="Negeri Sembilan">
                        Negeri Sembilan
                      </MenuItem>
                      <MenuItem value="Pahang">Pahang</MenuItem>
                      <MenuItem value="Penang">Penang</MenuItem>
                      <MenuItem value="Perak">Perak</MenuItem>
                      <MenuItem value="Perlis">Perlis</MenuItem>
                      <MenuItem value="Terengganu Terengganu">
                        Terengganu
                      </MenuItem>
                      <MenuItem value="Sabah">Sabah</MenuItem>
                      <MenuItem value="Sarawak">Sarawak</MenuItem>
                      <MenuItem value="Sarawak">Labuan</MenuItem>
                    </Select>
                  </Stack>
                  <Stack spacing={2} direction="row">
                    <TextFieldForm
                      label="City"
                      name="address.city"
                      required={true}
                    />
                    <TextFieldForm
                      label="Postcode"
                      name="address.postCode"
                      required={true}
                    />
                  </Stack>
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
