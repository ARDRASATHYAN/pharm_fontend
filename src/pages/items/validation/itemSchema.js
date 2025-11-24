import * as Yup from "yup";

export const itemSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Item name is required"),
   

  sku: Yup.string()
    .trim()
    .required("SKU is required"),
   

  barcode: Yup.string()
    .trim()
    .required("barcode is required"),
   
  brand: Yup.string()
    .trim()
    .required("Brand is required"),
  

  generic_name: Yup.string()
    .trim()
     .required("generic_name is required"),

  manufacturer: Yup.string()
    .trim()
    .required("Manufacturer must be at most 200 characters"),

  description: Yup.string()
    .trim()
    .required("Description must be at most 500 characters"),

  item_type: Yup.string()
    .oneOf(
      ["Medicine", "OTC", "Consumable", "Accessory", "Other"],
      "Invalid item type"
    )
    .required("Item type is required"),

  hsn_id: Yup.number()
    .typeError("HSN is required")
    .required("HSN is required")
    .integer("HSN must be a valid id")
    .positive("HSN must be a valid id"),

  schedule_id: Yup.number()
    .typeError("Schedule is required")
    .required("Schedule is required")
    .integer("Schedule must be a valid id")
    .positive("Schedule must be a valid id"),

  pack_size: Yup.number()
    .typeError("Pack size must be a number")
    .nullable()
    .integer("Pack size must be an integer")
    .min(1, "Pack size must be at least 1"),

  // if backend stores is_active as tinyint(1) 0/1
  is_active: Yup.number()
    .typeError("is_active must be 0 or 1")
    .oneOf([0, 1], "is_active must be 0 (inactive) or 1 (active)"),
});
