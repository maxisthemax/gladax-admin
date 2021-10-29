import { TextField } from "mui-rff";

//*lodash

//*components

//*material-ui

//*assets

//*redux

//*utils

//*helpers

//*style

//*custom components

function TextFieldForm({ name, label, required, ...props }) {
  //*define

  //*states

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions
  const myShowErrorFunction = ({
    meta: { submitError, dirtySinceLastSubmit, error, touched },
  }) => {
    return !!(((submitError && !dirtySinceLastSubmit) || error) && touched);
  };

  return (
    <TextField
      size="small"
      fullWidth
      label={label}
      name={name}
      showError={myShowErrorFunction}
      required={required}
      {...props}
    />
  );
}

export default TextFieldForm;
