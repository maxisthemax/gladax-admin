import { useState } from "react";
//*lodash

//*components

//*material-ui
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

//*assets

//*redux

//*utils

//*helpers

//*styles

//*custom components

//*useHooks
import useUser from "useHooks/useUser";
import { Typography } from "@mui/material";

function Login() {
  //*define
  const { handleLogin } = useUser();

  //*states
  const [userName, setUsername] = useState();
  const [password, setPassword] = useState();

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions

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
        <Stack
          width="500px"
          direction="column"
          justifyContent="center"
          spacing={2}
        >
          <Typography variant="h4">Gladax Admin</Typography>
          <Typography variant="h5">Login</Typography>
          <TextField
            fullWidth
            id="email"
            type="email"
            name="email"
            inputProps={{
              autocomplete: "new-password",
            }}
            onBlur={(event) => setUsername(event.target.value)}
          />
          <TextField
            fullWidth
            id="new-password"
            type="password"
            name="new-password"
            inputProps={{
              autocomplete: "new-password",
            }}
            onBlur={(event) => setPassword(event.target.value)}
          />
          <Button
            disabled={!(userName && password)}
            onClick={() => handleLogin(userName, password)}
          >
            Login
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Login;
