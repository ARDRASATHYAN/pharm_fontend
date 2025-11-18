import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Box,
  Grid,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { useStores } from "@/hooks/useStore";
import { useitem } from "@/hooks/useItem";
import { useSupplier } from "@/hooks/useSupplier";
import { useCurrentUser } from "@/hooks/useAuth";
import { useAddpurchaseinvoice } from "@/hooks/usePurchaseInvoice";

const emptyItemRow = {
  item_id: "",
  batch_no: "",
  qty: "",          // auto-calculated
  purchase_rate: "",
  mrp: "",
  gst_percent: "",
  discount_percent: "",
  pack_qty: "",     // user input
  pack_size: "",    // from item master
  expiry_date: "",
  amount: "",
};

export default function AddPurchaseForm({ onClose }) {
  const { data: store = [], isLoading: loadingStore } = useStores();
  const { data: supplier = [], isLoading: loadingSupplier } = useSupplier();
  const { data: itemsMaster = [], isLoading: loadingItems } = useitem();
  const { data: currentUserResponse } = useCurrentUser();
  const addpurchaseinvoice = useAddpurchaseinvoice();

  const currentUser = Array.isArray(currentUserResponse)
    ? currentUserResponse[0]
    : currentUserResponse || null;

  const items = Array.isArray(itemsMaster) ? itemsMaster : [];

  const [formData, setFormData] = useState({
    store_id: "",
    supplier_id: "",
    created_by: "",
    invoice_no: "",
    invoice_date: null,
    total_amount: 0,
    total_gst: 0,
    total_discount: 0,
    net_amount: 0,
    items: [],
  });

  const [rows, setRows] = useState([emptyItemRow]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, items: rows }));
  }, [rows]);

  useEffect(() => {
    if (currentUser && currentUser.user_id) {
      setFormData((prev) => ({
        ...prev,
        created_by: prev.created_by || currentUser.user_id,
      }));
    }
  }, [currentUser?.user_id]);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const newRows = [...prev];
      let row = { ...newRows[index], [field]: value };

      // When user changes pack_qty → auto-calc qty
      if (field === "pack_qty") {
        const packQtyNum = parseFloat(value || 0);
        const packSizeNum = parseFloat(row.pack_size || 0);
        row.qty = packQtyNum * (isNaN(packSizeNum) ? 0 : packSizeNum);
      }

      // Recalculate amount
      const qtyNum = parseFloat(row.qty || 0);
      const rateNum = parseFloat(row.purchase_rate || 0);
      let amount = qtyNum * rateNum;

      const discPercent = parseFloat(row.discount_percent || 0);
      if (!isNaN(discPercent) && discPercent > 0) {
        amount = amount - (amount * discPercent) / 100;
      }

      row.amount = isNaN(amount) ? "" : amount.toFixed(2);

      newRows[index] = row;
      return newRows;
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, emptyItemRow]);
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => {
      if (prev.length === 1) return prev;
      const newRows = [...prev];
      newRows.splice(index, 1);
      return newRows;
    });
  };

  // Totals calculation
  useEffect(() => {
    let total_amount = 0;
    let total_gst = 0;
    let total_discount = 0;

    rows.forEach((r) => {
      const qty = Number(r.qty || 0);
      const rate = Number(r.purchase_rate || 0);
      const discPercent = Number(r.discount_percent || 0);
      const gstPercent = Number(r.gst_percent || 0);

      if (!qty || !rate) return;

      const baseTotal = qty * rate;
      const discountAmount = (baseTotal * discPercent) / 100;
      const baseAfterDiscount = baseTotal - discountAmount;
      const gstAmount = (baseAfterDiscount * gstPercent) / 100;

      total_amount += baseAfterDiscount;
      total_gst += gstAmount;
      total_discount += discountAmount;
    });

    const net_amount = total_amount + total_gst - total_discount;

    setFormData((prev) => ({
      ...prev,
      total_amount: total_amount.toFixed(2),
      total_gst: total_gst.toFixed(2),
      total_discount: total_discount.toFixed(2),
      net_amount: net_amount.toFixed(2),
    }));
  }, [rows]);

  const handleSubmit = () => {
    if (!formData.store_id || !formData.supplier_id) {
      alert("Store and Supplier are required");
      return;
    }
    if (!rows.length || !rows.some((r) => r.item_id)) {
      alert("Add at least one item with an Item selected");
      return;
    }
    if (!currentUser?.user_id) {
      alert("No logged in user found. Please login again.");
      return;
    }

    const payload = {
      store_id: Number(formData.store_id),
      supplier_id: Number(formData.supplier_id),
      created_by: currentUser.user_id,
      invoice_no: formData.invoice_no || undefined,
      invoice_date: formData.invoice_date || undefined,
      items: rows
        .filter((r) => r.item_id)
        .map((r) => ({
          item_id: Number(r.item_id),
          batch_no: r.batch_no || null,
          expiry_date: r.expiry_date || null,
          qty: Number(r.qty || 0),          // ✅ auto-calculated
          purchase_rate: Number(r.purchase_rate || 0),
          mrp: Number(r.mrp || 0),
          discount_percent: Number(r.discount_percent || 0),
          gst_percent: Number(r.gst_percent || 0),
          pack_qty: Number(r.pack_qty || 0), // user input
        })),
      total_amount: Number(formData.total_amount || 0),
      total_gst: Number(formData.total_gst || 0),
      total_discount: Number(formData.total_discount || 0),
      net_amount: Number(formData.net_amount || 0),
    };

    console.log("CREATE PAYLOAD:", payload);

    addpurchaseinvoice.mutate(payload, {
      onSuccess: () => onClose?.(),
    });
  };

  return (
    <Box
      gap={3}
      sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}
    >
      {/* Header */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} display="flex" className="text-blue-700">
          Purchase Invoice Details
        </Typography>
        <Divider />
        <Box display="flex" gap={3} mt={1}>
          <TextField
            label="Invoice No"
            name="invoice_no"
            value={formData.invoice_no}
            onChange={handleHeaderChange}
            fullWidth
            size="small"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Invoice Date"
              value={formData.invoice_date ? dayjs(formData.invoice_date) : null}
              onChange={(newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  invoice_date: newValue ? newValue.toISOString() : null,
                }))
              }
              slotProps={{ textField: { fullWidth: true, size: "small", required: true } }}
            />
          </LocalizationProvider>
          <TextField
            select
            label="Supplier"
            name="supplier_id"
            value={formData.supplier_id}
            onChange={handleHeaderChange}
            fullWidth
            size="small"
          >
            {loadingSupplier ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              supplier.map((s) => (
                <MenuItem key={s.supplier_id} value={s.supplier_id}>
                  {s.supplier_name || s.supplier_id}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            select
            label="Store"
            name="store_id"
            value={formData.store_id}
            onChange={handleHeaderChange}
            fullWidth
            size="small"
          >
            {loadingStore ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              store.map((s) => (
                <MenuItem key={s.store_id} value={s.store_id}>
                  {s.store_name || s.store_id}
                </MenuItem>
              ))
            )}
          </TextField>
        </Box>
        <Box display="flex" gap={3} mt={1}>
          <TextField
            label="Created By"
            value={currentUser?.username || currentUser?.user_id || ""}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Box>

      {/* Items Table */}
      <Box mt={2} sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={600} gutterBottom className="text-blue-700">
            Purchase Items
          </Typography>
          <Tooltip title="Add Item">
            <IconButton onClick={handleAddRow} size="small">
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider />
        <Paper variant="outlined" sx={{ mt: 1 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 160 }}>Item</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Batch</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>Rate</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>MRP</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>GST%</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>Disc%</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>Pack</TableCell>
                   <TableCell sx={{ minWidth: 70 }}>Qty</TableCell>
                  <TableCell sx={{ minWidth: 110 }}>Expiry</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>Amount</TableCell>
                  <TableCell sx={{ width: 50 }} align="center">Del</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    {/* Item */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        select
                        label="Item"
                        name="item_id"
                        value={row.item_id || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleRowChange(index, "item_id", value);
                          const selectedItem = items.find(it => String(it.item_id) === String(value));
                          if (selectedItem) {
                            if (selectedItem.hsn?.gst_percent != null) {
                              handleRowChange(index, "gst_percent", selectedItem.hsn.gst_percent);
                            }
                            if (selectedItem.pack_size != null) {
                              setRows(prev => {
                                const newRows = [...prev];
                                const r = { ...newRows[index], pack_size: selectedItem.pack_size };
                                const packQtyNum = parseFloat(r.pack_qty || 0);
                                r.qty = packQtyNum * (isNaN(selectedItem.pack_size) ? 0 : selectedItem.pack_size);
                                newRows[index] = r;
                                return newRows;
                              });
                            }
                          }
                        }}
                        fullWidth
                        size="small"
                        required
                      >
                        {loadingItems ? (
                          <MenuItem disabled>Loading items...</MenuItem>
                        ) : (
                          items.map((it) => (
                            <MenuItem key={it.item_id} value={it.item_id}>
                              {it.item_name || it.name || `Item #${it.item_id}`}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    </TableCell>

                    {/* Batch */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        name="batch_no"
                        value={row.batch_no}
                        onChange={(e) => handleRowChange(index, "batch_no", e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </TableCell>

                   

                    {/* Rate */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        name="purchase_rate"
                       
                        value={row.purchase_rate}
                        onChange={(e) => handleRowChange(index, "purchase_rate", e.target.value)}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: "0.01" }}
                      />
                    </TableCell>

                    {/* MRP */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        name="mrp"
                    
                        value={row.mrp}
                        onChange={(e) => handleRowChange(index, "mrp", e.target.value)}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: "0.01" }}
                      />
                    </TableCell>

                    {/* GST% */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        name="gst_percent"
                    
                        value={row.gst_percent}
                        onChange={(e) => handleRowChange(index, "gst_percent", e.target.value)}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: "0.01" }}
                      />
                    </TableCell>

                    {/* Disc% */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        name="discount_percent"
                        value={row.discount_percent}
                        onChange={(e) => handleRowChange(index, "discount_percent", e.target.value)}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: "0.01" }}
                      />
                    </TableCell>

                    {/* Pack (user input) */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        name="pack_qty"
                        value={row.pack_qty}
                        onChange={(e) => handleRowChange(index, "pack_qty", e.target.value)}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: "1" }}
                      />
                    </TableCell>
                     {/* Qty (read-only) */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        name="qty"
                        value={row.qty}
                        fullWidth
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </TableCell>

                    {/* Expiry */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        type="date"
                        name="expiry_date"
                        value={row.expiry_date}
                        onChange={(e) => handleRowChange(index, "expiry_date", e.target.value)}
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>

                    {/* Amount */}
                    <TableCell padding="none" sx={{ p: 0.25 }}>
                      <TextField
                        name="amount"
                        value={row.amount}
                        fullWidth
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </TableCell>

                    {/* Delete */}
                    <TableCell align="center" padding="none" sx={{ p: 0.25 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveRow(index)}
                        disabled={rows.length === 1}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>

      {/* Amount Summary */}
      <Box mt={2}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom className="text-blue-700">
          Amount Summary
        </Typography>
        <Divider />
        <Grid container spacing={2} mt={1} justifyContent="flex-end">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Total Amount"
              name="total_amount"
              value={formData.total_amount}
              type="number"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Total GST"
              name="total_gst"
              value={formData.total_gst}
              type="number"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Total Discount"
              name="total_discount"
              value={formData.total_discount}
              type="number"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Net Amount"
              name="net_amount"
              value={formData.net_amount}
              type="number"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          {onClose && (
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button variant="contained" onClick={handleSubmit}>
            Save Purchase
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
