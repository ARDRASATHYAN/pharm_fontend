// src/components/InvoiceForm.jsx
import { TextField, Grid } from "@mui/material";
import { usePurchaseStore } from "@/store/purchaseStore";

export default function InvoiceForm() {
  const invoice = usePurchaseStore((state) => state.invoice);
  const setInvoice = usePurchaseStore((state) => state.setInvoice);

  const handleChange = (e) => {
    setInvoice({ [e.target.name]: e.target.value });
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={6}>
        <TextField
          label="Invoice No"
          name="invoice_no"
          fullWidth
          value={invoice.invoice_no}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Invoice Date"
          name="invoice_date"
          type="date"
          fullWidth
          value={invoice.invoice_date}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Store ID"
          name="store_id"
          fullWidth
          value={invoice.store_id}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Supplier ID"
          name="supplier_id"
          fullWidth
          value={invoice.supplier_id}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}
