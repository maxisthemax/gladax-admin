import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const addNewProduct = makeValidate(
  Yup.object().shape({
    name: Yup.string().required("Name Is Required"),
    categoryId: Yup.string().required("Category Is Required"),
  })
);
export default addNewProduct;
