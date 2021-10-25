import * as Yup from "yup";
import { makeValidate } from "mui-rff";
import { email, password, phoneNo } from "./commonValidation";

const addNewUserValidation = makeValidate(
  Yup.object().shape({
    email: email,
    password: password,
    name: Yup.string().required("Name Is Required"),
    address: Yup.string().required("Address Is Required"),
    phoneNo: phoneNo,
  })
);
export default addNewUserValidation;
