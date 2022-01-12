import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const addNewDelivery = makeValidate(
  Yup.object().shape({
    vendor: Yup.string().required("Vendor Is Required"),
    price: Yup.string().required("pPice Is Required"),
    criteria: Yup.object({
      minWeight: Yup.string().required("Min Weight Is Required"),
      maxWeight: Yup.string().required("Max Weight Is Required"),
    }),
  })
);
export default addNewDelivery;
