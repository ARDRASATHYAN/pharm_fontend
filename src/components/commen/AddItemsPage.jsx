// src/pages/purchase/AddPurchase.jsx
import React, { useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePurchaseStore } from "@/store/purchaseStore";


/**
 * AddPurchase page uses Zustand store:
 * - invoice, currentItem, items are persisted automatically
 * - user edits invoice and item fields; changes are saved
 */

const sampleItems = [
  { id: "101", name: "Paracetamol 500mg" },
  { id: "102", name: "Azithromycin 250mg" },
];

const sampleStores = [
  { id: "1", name: "Main Store" },
  { id: "2", name: "Outlet 2" },
];

const sampleSuppliers = [
  { id: "11", name: "ABC Pharma" },
  { id: "12", name: "Med Suppliers" },
];

export default function AddPurchase() {
  const navigate = useNavigate();

  // Zustand selectors
  const invoice = usePurchaseStore((s) => s.invoice);
  const currentItem = usePurchaseStore((s) => s.currentItem);
  const items = usePurchaseStore((s) => s.items);

  const setInvoice = usePurchaseStore((s) => s.setInvoice);
  const setCurrentItem = usePurchaseStore((s) => s.setCurrentItem);
  const addItem = usePurchaseStore((s) => s.addItem);
  const clearCurrentItem = usePurchaseStore((s) => s.clearCurrentItem);
  const removeItemAt = usePurchaseStore((s) => s.removeItemAt);

  // compute total on currentItem change: keep simple and recalc here
  useEffect(() => {
    const qty = parseFloat(currentItem.qty || 0);
    const rate = parseFloat(currentItem.purchase_rate || 0);
    const gst = parseFloat(currentItem.gst_percent || 0);
    const discount = parseFloat(currentItem.discount_percent || 0);

    const base = qty * rate;
    const discountAmt = (base * discount) / 100;
    const taxable = base - discountAmt;
    const gstAmt = (taxable * gst) / 100;
    const total_amount = +(taxable + gstAmt).toFixed(2);

    setCurrentItem({ total_amount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem.qty, currentItem.purchase_rate, currentItem.gst_percent, currentItem.discount_percent]);

  // handlers
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ [name]: value });
  };

  const handleCurrentItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ [name]: value });
  };

  const handleAddItem = () => {
    if (!currentItem.item_id || !currentItem.qty || !currentItem.purchase_rate) {
      alert("Please select item and enter qty & rate");
      return;
    }

    // currentItem already has total_amount computed
    addItem({ ...currentItem });
    clearCurrentItem();
  };

  const handleRemove = (idx) => {
    if (!window.confirm("Remove this item?")) return;
    removeItemAt(idx);
  };

  const goToPreview = () => {
    if (!invoice.invoice_no) {
      alert("Invoice No is required");
      return;
    }
    navigate("/preview");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Create Purchase Invoice
      </Typography>

      {/* Invoice Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Invoice Details</Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Invoice No"
              name="invoice_no"
              value={invoice.invoice_no}
              onChange={handleInvoiceChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              type="date"
              label="Invoice Date"
              name="invoice_date"
              value={invoice.invoice_date}
              onChange={handleInvoiceChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Store"
              name="store_id"
              value={invoice.store_id}
              onChange={handleInvoiceChange}
              fullWidth
            >
              <MenuItem value="">Select store</MenuItem>
              {sampleStores.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Supplier"
              name="supplier_id"
              value={invoice.supplier_id}
              onChange={handleInvoiceChange}
              fullWidth
            >
              <MenuItem value="">Select supplier</MenuItem>
              {sampleSuppliers.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Add Item */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Add Item</Typography>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Item"
              name="item_id"
              value={currentItem.item_id}
              onChange={handleCurrentItemChange}
              fullWidth
            >
              <MenuItem value="">Select item</MenuItem>
              {sampleItems.map((it) => (
                <MenuItem key={it.id} value={it.id}>
                  {it.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Batch No"
              name="batch_no"
              value={currentItem.batch_no}
              onChange={handleCurrentItemChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              type="date"
              label="Expiry Date"
              name="expiry_date"
              value={currentItem.expiry_date}
              onChange={handleCurrentItemChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              label="Pack Qty"
              name="pack_qty"
              type="number"
              value={currentItem.pack_qty}
              onChange={handleCurrentItemChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              label="Qty"
              name="qty"
              type="number"
              value={currentItem.qty}
              onChange={handleCurrentItemChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              label="Rate"
              name="purchase_rate"
              type="number"
              value={currentItem.purchase_rate}
              onChange={handleCurrentItemChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              label="MRP"
              name="mrp"
              type="number"
              value={currentItem.mrp}
              onChange={handleCurrentItemChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              label="GST %"
              name="gst_percent"
              type="number"
              value={currentItem.gst_percent}
              onChange={handleCurrentItemChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              label="Discount %"
              name="discount_percent"
              type="number"
              value={currentItem.discount_percent}
              onChange={handleCurrentItemChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography sx={{ mt: 1 }}>
              Item Total: ₹ {Number(currentItem.total_amount || 0).toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddItem}>
              Add Item
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Items list quick view */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography>Items Added: {items.length}</Typography>
        <Box mt={1}>
          {items.map((it, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.5,
                borderBottom: "1px solid #eee",
              }}
            >
              <Box>
                <strong>{it.item_id}</strong> — {it.qty} × {it.purchase_rate} = ₹{" "}
                {Number(it.total_amount).toFixed(2)}
              </Box>
              <Box>
                <Button size="small" onClick={() => {
                  // load into current item for editing
                  (async () => {
                    // simple edit approach: set currentItem to this and remove original
                    // user can modify and Add again (advanced: provide updateItemAt)
                    setCurrentItem(it);
                    removeItemAt(idx);
                  })();
                }}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleRemove(idx)}>Remove</Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          disabled={items.length === 0}
          onClick={goToPreview}
        >
          Go To Preview ({items.length})
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            // clear everything
            if (window.confirm("Clear invoice & items?")) {
              // use the store clearAll
              const clearAll = usePurchaseStore.getState().clearAll;
              clearAll();
            }
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
}
