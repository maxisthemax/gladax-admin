import * as Yup from "yup";
import { makeValidate } from "mui-rff";
const schema = makeValidate(
  Yup.object().shape({
    email: Yup.string()
      .email("Wrong Email Format")
      .required("Email Is Required"),
    password: Yup.string()
      .required("Please Enter your password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    name: Yup.string().required("Name Is Required"),
    address: Yup.string().required("Address Is Required"),
    phoneNo: Yup.string().required("Phone No. Is Required"),
  })
);
export default schema;
