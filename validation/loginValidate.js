import * as Yup from "yup";
import { makeValidate } from "mui-rff";
import { email, password } from "./commonValidation";

const loginValidate = makeValidate(
  Yup.object().shape({
    email: email,
    password: password,
  })
);
export default loginValidate;
