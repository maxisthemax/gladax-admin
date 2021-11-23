import { useState } from "react";
import { Form } from "react-final-form";
//*lodash

//*components
import { TextFieldForm } from "components/Form";
import { CustomIcon } from "components/Icons";
import { Button } from "components/Buttons";

//*material-ui
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

//*assets

//*redux

//*utils

//*helpers

//*validation
import { loginValidate } from "validation";

//*styles

//*custom components

//*useHooks
import useUser from "useHooks/useUser";

function Login() {
  //*define
  const { handleLogin } = useUser();

  //*states
  const [showPassword, setShowPassword] = useState(false);

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions
  const onSubmit = ({ email, password }) => {
    handleLogin(email, password);
  };
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12}>
        <Form
          onSubmit={onSubmit}
          validate={loginValidate}
          validateOnBlur={true}
          render={({ handleSubmit, invalid }) => {
            return (
              <form
                id="addNewUserForm"
                onSubmit={handleSubmit}
                noValidate
                style={{ width: "300px" }}
              >
                <Stack spacing={2}>
                  <Box p={2} />
                  <TextFieldForm label="Email" name="email" required={true} />
                  <TextFieldForm
                    label="Password"
                    name="password"
                    required={true}
                    type={showPassword ? "text" : "password"}
                    inputProps={{
                      autoComplete: "new-password",
                    }}
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
                  <Button disabled={invalid} type="submit">
                    Login
                  </Button>
                </Stack>
              </form>
            );
          }}
        />
      </Grid>
    </Grid>
  );
}

export default Login;
