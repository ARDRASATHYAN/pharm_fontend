// src/components/sales/AddSalesForm.jsx
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
import { useCurrentUser } from "@/hooks/useAuth";
import { useCustomer } from "@/hooks/useCustomer";
import { useAddSalesInvoice } from "@/hooks/useSalesInvoice";
import apiClient from "@/services/apiClient";
import { showSuccessToast } from "@/lib/toastService";
import { useItem } from "@/hooks/useItem";

const emptySaleItemRow = {
  item_id: "",
  batch_no: "",
  qty: "",
  rate: "",
  gst_percent: "",
  discount_percent: "",
  total_amount: "",
  max_qty: null, // internal (from stock)
};

const initialFormData = {
  store_id: "",
  customer_id: "", // selected customer (optional)
  created_by: "",
  bill_no: "",
  bill_date: null,
  doctor_name: "",
  prescription_no: "",
  total_amount: 0,
  total_gst: 0,
  total_discount: 0,
  net_amount: 0,
  customer_name: "",
  customer_phone: "",
};

function recalcRow(row) {
  const qtyNum = parseFloat(row.qty || 0);
  const rateNum = parseFloat(row.rate || 0);
  const gstPercent = parseFloat(row.gst_percent || 0);
  const discPercent = parseFloat(row.discount_percent || 0);

  const baseTotal = qtyNum * rateNum;
  const discountAmount = (baseTotal * discPercent) / 100;
  const afterDiscount = baseTotal - discountAmount;
  const gstAmount = (afterDiscount * gstPercent) / 100;
  const lineTotal = afterDiscount + gstAmount;

  return {
    ...row,
    total_amount: isNaN(lineTotal) ? "" : lineTotal.toFixed(2),
  };
}

export default function AddSalesForm({ onClose }) {
  const { data: store = [], isLoading: loadingStore } = useStores();
  const { data: itemsMaster = [] } = useItem();
  const { data: currentUserResponse } = useCurrentUser();
  const { data: customers = [], isLoading: loadingCustomers } = useCustomer();

  const addSalesInvoice = useAddSalesInvoice();

  const currentUser = Array.isArray(currentUserResponse)
    ? currentUserResponse[0]
    : currentUserResponse || null;

  const items = Array.isArray(itemsMaster) ? itemsMaster : [];

  const [formData, setFormData] = useState(initialFormData);
  const [rows, setRows] = useState([emptySaleItemRow]);
  const [storeStock, setStoreStock] = useState([]); // all stock for selected store

  useEffect(() => {
    if (currentUser && currentUser.user_id) {
      setFormData((prev) => ({
        ...prev,
        created_by: prev.created_by || currentUser.user_id,
      }));
    }
  }, [currentUser?.user_id]);

  // items that have stock in selected store
  const itemIdsWithStock = Array.from(
    new Set(storeStock.map((s) => s.item_id))
  );
  const storeItems = items.filter((it) =>
    itemIdsWithStock.includes(it.item_id)
  );

  const handleHeaderChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "store_id") {
      if (!value) {
        setStoreStock([]);
        setRows([emptySaleItemRow]);
        return;
      }

      try {
        const res = await apiClient.get("/stock/store-stock", {
          params: { store_id: value },
        });
        setStoreStock(res.data || []);
        setRows([emptySaleItemRow]);
      } catch (err) {
        console.error("Error loading store stock:", err);
        setStoreStock([]);
        setRows([emptySaleItemRow]);
      }
    }
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const newRows = [...prev];
      let row = { ...newRows[index], [field]: value };

      if (field === "qty" && row.max_qty != null) {
        const qtyNum = Number(value || 0);
        if (qtyNum > row.max_qty) {
          row.qty = row.max_qty;
        }
      }

      row = recalcRow(row);
      newRows[index] = row;
      return newRows;
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, emptySaleItemRow]);
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
      const rate = Number(r.rate || 0);
      const discPercent = Number(r.discount_percent || 0);
      const gstPercent = Number(r.gst_percent || 0);

      if (!qty || !rate) return;

      const baseTotal = qty * rate;
      const discountAmount = (baseTotal * discPercent) / 100;
      const baseAfterDiscount = baseTotal - discountAmount;
      const gstAmount = (baseAfterDiscount * gstPercent) / 100;

      total_amount += baseTotal;
      total_gst += gstAmount;
      total_discount += discountAmount;
    });

    const net_amount = total_amount - total_discount + total_gst;

    setFormData((prev) => ({
      ...prev,
      total_amount: total_amount.toFixed(2),
      total_gst: total_gst.toFixed(2),
      total_discount: total_discount.toFixed(2),
      net_amount: net_amount.toFixed(2),
    }));
  }, [rows]);

  const resetForm = () => {
    setFormData((prev) => ({
      ...initialFormData,
     
      store_id: prev.store_id,
      created_by: prev.created_by,
    }));
    setRows([emptySaleItemRow]);
    setStoreStock([]);
  };

  const handleSubmit = () => {
    if (!formData.store_id) {
      alert("Store is required");
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
      created_by: currentUser.user_id,
      bill_no: formData.bill_no || undefined,
      bill_date: formData.bill_date || undefined,
      doctor_name: formData.doctor_name || undefined,
      prescription_no: formData.prescription_no || undefined,
      total_amount: Number(formData.total_amount || 0),
      total_gst: Number(formData.total_gst || 0),
      total_discount: Number(formData.total_discount || 0),
      net_amount: Number(formData.net_amount || 0),
      customer_id: formData.customer_id
        ? Number(formData.customer_id)
        : undefined,
      customer: {
        customer_name: formData.customer_name || undefined,
        phone: formData.customer_phone || undefined,
      },
      items: rows
        .filter((r) => r.item_id)
        .map((r) => ({
          item_id: Number(r.item_id),
          batch_no: r.batch_no || null,
          qty: Number(r.qty || 0),
          rate: Number(r.rate || 0),
          discount_percent: Number(r.discount_percent || 0),
          gst_percent: Number(r.gst_percent || 0),
          total_amount: Number(r.total_amount || 0),
        })),
    };

    console.log("CREATE SALES PAYLOAD:", payload);
    addSalesInvoice.mutate(payload, {
      onSuccess: () => {
        showSuccessToast("Sale saved successfully");
        resetForm();
        onClose?.();
      },
    });
  };

  return (
    <Box
      gap={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
      }}
    >
      {/* Header */}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          display="flex"
          className="text-blue-700"
        >
          Sales Invoice Details
        </Typography>
        <Divider />
        <Box display="flex" gap={3} mt={1}>
          <TextField
            label="Bill No"
            name="bill_no"
            value={formData.bill_no}
            onChange={handleHeaderChange}
            fullWidth
            size="small"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Bill Date"
              value={formData.bill_date ? dayjs(formData.bill_date) : null}
              onChange={(newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  bill_date: newValue ? newValue.toISOString() : null,
                }))
              }
              slotProps={{
                textField: { fullWidth: true, size: "small", required: true },
              }}
            />
          </LocalizationProvider>

          {/* Customer select */}
          <TextField
            select
            label="Customer (optional)"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleHeaderChange}
            fullWidth
            size="small"
          >
            <MenuItem value="">Walk-in / None</MenuItem>
            {loadingCustomers ? (
              <MenuItem disabled>Loading customers...</MenuItem>
            ) : (
              customers.map((c) => (
                <MenuItem key={c.customer_id} value={c.customer_id}>
                  {c.customer_name} {c.phone ? `(${c.phone})` : ""}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* Store */}
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

        {/* New customer (optional) */}
        <Box display="flex" gap={3} mt={1}>
          <TextField
            label="New Customer Name (optional)"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleHeaderChange}
            fullWidth
            size="small"
            helperText="Used if no customer is selected above"
          />
          <TextField
            label="New Customer Phone (optional)"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleHeaderChange}
            fullWidth
            size="small"
          />
        </Box>

        {/* Doctor / prescription */}
        <Box display="flex" gap={3} mt={1}>
          <TextField
            label="Doctor Name"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleHeaderChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Prescription No"
            name="prescription_no"
            value={formData.prescription_no}
            onChange={handleHeaderChange}
            fullWidth
            size="small"
          />
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
          <Typography
            variant="subtitle1"
            fontWeight={600}
            gutterBottom
            className="text-blue-700"
          >
            Sales Items
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
                  <TableCell sx={{ minWidth: 140 }}>Batch</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Qty</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>Rate</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>GST%</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>Disc%</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Line Total</TableCell>
                  <TableCell sx={{ width: 50 }} align="center">
                    Del
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => {
                  const rowBatches = storeStock.filter(
                    (s) =>
                      String(s.item_id) === String(row.item_id) &&
                      Number(s.qty_in_stock) > 0
                  );

                  return (
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
                            setRows((prev) => {
                              const newRows = [...prev];
                              let newRow = {
                                ...newRows[index],
                                item_id: value,
                                batch_no: "",
                                rate: "",
                                gst_percent: "",
                                max_qty: null,
                              };
                              newRow = recalcRow(newRow);
                              newRows[index] = newRow;
                              return newRows;
                            });
                          }}
                          fullWidth
                          size="small"
                          required
                          disabled={!formData.store_id}
                        >
                          {!formData.store_id && (
                            <MenuItem disabled>Select store first</MenuItem>
                          )}

                          {formData.store_id && storeItems.length === 0 && (
                            <MenuItem disabled>No stock in this store</MenuItem>
                          )}

                          {formData.store_id &&
                            storeItems.map((it) => (
                              <MenuItem key={it.item_id} value={it.item_id}>
                                {it.item_name ||
                                  it.name ||
                                  `Item #${it.item_id}`}
                              </MenuItem>
                            ))}
                        </TextField>
                      </TableCell>

                      {/* Batch */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <TextField
                          select
                          label="Batch"
                          name="batch_no"
                          value={row.batch_no || ""}
                          onChange={(e) => {
                            const batchValue = e.target.value;
                            const selectedStock = rowBatches.find(
                              (b) => b.batch_no === batchValue
                            );

                            setRows((prev) => {
                              const newRows = [...prev];
                              let newRow = { ...newRows[index] };
                              newRow.batch_no = batchValue;

                              if (selectedStock) {
                                newRow.rate =
                                  selectedStock.sale_rate ??
                                  selectedStock.mrp ??
                                  newRow.rate;
                                newRow.gst_percent =
                                  selectedStock.gst_percent ??
                                  newRow.gst_percent;
                                newRow.max_qty = Number(
                                  selectedStock.qty_in_stock || 0
                                );
                              }

                              newRow = recalcRow(newRow);
                              newRows[index] = newRow;
                              return newRows;
                            });
                          }}
                          fullWidth
                          size="small"
                          disabled={!row.item_id || !formData.store_id}
                        >
                          {(!formData.store_id || !row.item_id) && (
                            <MenuItem disabled>
                              Select store & item first
                            </MenuItem>
                          )}

                          {row.item_id &&
                            formData.store_id &&
                            rowBatches.length === 0 && (
                              <MenuItem disabled>No stock batches</MenuItem>
                            )}

                          {rowBatches.map((b) => (
                            <MenuItem key={b.stock_id} value={b.batch_no}>
                              {b.batch_no} – Qty: {b.qty_in_stock}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>

                      {/* Qty */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <TextField
                          name="qty"
                          value={row.qty}
                          onChange={(e) =>
                            handleRowChange(index, "qty", e.target.value)
                          }
                          fullWidth
                          size="small"
                          inputProps={{ min: 0, step: "1" }}
                          helperText={
                            row.max_qty != null ? `Max: ${row.max_qty}` : ""
                          }
                        />
                      </TableCell>

                      {/* Rate */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <TextField
                          name="rate"
                          value={row.rate}
                          onChange={(e) =>
                            handleRowChange(index, "rate", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "gst_percent",
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "discount_percent",
                              e.target.value
                            )
                          }
                          fullWidth
                          size="small"
                          inputProps={{ min: 0, step: "0.01" }}
                        />
                      </TableCell>

                      {/* Line Total */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <TextField
                          name="total_amount"
                          value={row.total_amount}
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
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>

      {/* Amount Summary */}
      <Box mt={2}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          className="text-blue-700"
        >
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
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={addSalesInvoice.isLoading}
          >
            Save Sale
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
