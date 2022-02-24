import * as Yup from "yup";

export const email = Yup.string()
  .email("Wrong Email Format")
  .required("Email Is Required");
export const password = Yup.string()
  .required("Please Enter your password")
  .matches(
    /^(?=.*[a-z])(?=.*[0-9])(?=.{6,})/,
    "Minimum six characters, at least one letter and one number"
  );
export const phoneNo = Yup.string()
  .required("Please Enter your password")
  .matches(
    /^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/,
    "Wrong Phone Format"
  );
