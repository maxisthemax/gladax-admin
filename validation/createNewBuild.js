import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const createNewBuild = makeValidate(
  Yup.object().shape({
    name: Yup.string().required("Name Is Required"),
    tags: Yup.string().required("Tags is required"),
    weight: Yup.string().required("Weight is required"),
  })
);
export default createNewBuild;
