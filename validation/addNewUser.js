import * as Yup from "yup";
import { makeValidate } from "mui-rff";
import { email, password, phoneNo } from "./commonValidation";

const addNewUser = makeValidate(
  Yup.object().shape({
    email: email,
    password: password,
    name: Yup.string().required("Name Is Required"),
    phoneNo: phoneNo,
  })
);
export default addNewUser;
