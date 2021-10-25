import * as Yup from "yup";

export const email = Yup.string()
  .email("Wrong Email Format")
  .required("Email Is Required");
export const password = Yup.string()
  .required("Please Enter your password")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
  );
export const phoneNo = Yup.string()
  .required("Please Enter your password")
  .matches(
    /^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/,
    "Wrong Phone Format"
  );
