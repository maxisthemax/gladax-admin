import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const addNewCategory = makeValidate(
  Yup.object().shape({
    name: Yup.string().required("Name Is Required"),
    description: Yup.string().required("Description Is Required"),
  })
);
export default addNewCategory;
