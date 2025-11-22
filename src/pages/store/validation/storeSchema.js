import * as yup from "yup";

export const storeSchema = yup.object().shape({
  store_name: yup
    .string()
    .trim()
    .required("Store name is required"),

  address: yup
    .string()
    .trim()
    .required("Address is required"),

  city: yup
    .string()
    .trim()
    .required("City is required"),

  state: yup
    .string()
    .trim()
    .required("State is required"),

  gst_no: yup
    .string()
    .trim()
     .required("gst_no is required"),

  phone: yup
    .string()
    .trim()
    .nullable()
    .matches(/^[0-9]{10}$/, {
      message: "Phone must be 10 digits",
      excludeEmptyString: true,
    }),

  email: yup
    .string()
    .trim()
    .nullable()
    .email("Invalid email"),
});
