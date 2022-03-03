import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const profileAddressValidate = makeValidate(
  Yup.object().shape({
    address: Yup.object({
      address1: Yup.string().required("Address 1 Is Required"),
      state: Yup.string().required("State Is Required"),
      city: Yup.string().required("City Is Required"),
      postCode: Yup.string().required("postCode Is Required"),
    }),
  })
);
profileAddressValidate;
