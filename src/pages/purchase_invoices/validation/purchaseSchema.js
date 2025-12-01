// src/pages/purchase/validation/purchaseSchema.js
import * as yup from "yup";

export const purchaseItemSchema = yup.object().shape({
  item_id: yup
    .number()
    .typeError("Item is required")
    .required("Item is required"),

  batch_no: yup.string().nullable(),

  // pack_qty: yup
  //   .number()
  //   .typeError("Pack Qty is required")
  //   .positive("Pack Qty must be greater than 0")
  //   .required("Pack Qty is required"),

  qty: yup
    .number()
    .typeError("Qty is required")
    .positive("Qty must be greater than 0")
    .required("Qty is required"),

  purchase_rate: yup
    .number()
    .typeError("Rate is required")
    .positive("Rate must be greater than 0")
    .required("Rate is required"),

  mrp: yup
    .number()
    .typeError("MRP is required")
    .positive("MRP must be greater than 0")
    .required("MRP is required")
    .test(
      "mrp-gte-rate",
      "MRP must be greater than or equal to Rate",
      function (value) {
        const { purchase_rate } = this.parent;
        if (!value || !purchase_rate) return true;
        return value >= purchase_rate;
      }
    ),

  gst_percent: yup
    .number()
    .typeError("GST% must be a number")
    .min(0, "GST% cannot be negative")
    .max(28, "GST% cannot be more than 28")
    .nullable(),

  discount_percent: yup
    .number()
    .typeError("Discount% must be a number")
    .min(0, "Discount% cannot be negative")
    .max(100, "Discount% cannot be more than 100")
    .nullable(),

  expiry_date: yup.string().required("expiry date needed"),
  amount: yup.number().nullable(),
  pack_size: yup.number().nullable(),
});

export const purchaseSchema = yup.object().shape({
  store_id: yup
    .number()
    .typeError("Store is required")
    .required("Store is required"),
  supplier_id: yup
    .number()
    .typeError("Supplier is required")
    .required("Supplier is required"),
  invoice_no: yup.string().nullable(),
  invoice_date: yup
    .string()
    .nullable()
    .required("Invoice date is required"),
  items: yup
    .array()
    .of(purchaseItemSchema)
    .min(1, "Add at least one item"),
});
