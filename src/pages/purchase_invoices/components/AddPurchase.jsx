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
import { showErrorToast, showSuccessToast } from "@/lib/toastService";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { purchaseSchema } from "../validation/purchaseSchema";

const emptyItemRow = {
  item_id: "",
  batch_no: "",
  qty: "", // auto-calculated
  purchase_rate: "",
  mrp: "",
  gst_percent: "",
  discount_percent: "",
  pack_qty: 1, // user input
  pack_size: "", // from item master
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

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(purchaseSchema),
    defaultValues: {
      store_id: "",
      supplier_id: "",
      invoice_no: "",
      invoice_date: null,
      items: [emptyItemRow],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch items for totals & calcs
  const watchedItems = watch("items") || [];

  const [totals, setTotals] = useState({
    total_amount: 0,
    total_gst: 0,
    total_discount: 0,
    net_amount: 0,
  });

  const [createdBy, setCreatedBy] = useState("");

  useEffect(() => {
    if (currentUser && currentUser.user_id) {
      setCreatedBy(currentUser.user_id);
    }
  }, [currentUser?.user_id]);

  // Totals calculation
  useEffect(() => {
    let total_amount = 0;
    let total_gst = 0;
    let total_discount = 0;

    watchedItems.forEach((r) => {
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

    setTotals({
      total_amount: total_amount.toFixed(2),
      total_gst: total_gst.toFixed(2),
      total_discount: total_discount.toFixed(2),
      net_amount: net_amount.toFixed(2),
    });
  }, [watchedItems]);

  const resetForm = () => {
    reset({
      store_id: "",
      supplier_id: "",
      invoice_no: "",
      invoice_date: null,
      items: [emptyItemRow],
    });
    setTotals({
      total_amount: 0,
      total_gst: 0,
      total_discount: 0,
      net_amount: 0,
    });
  };

  const onSubmit = (data) => {
    if (!currentUser?.user_id) return;

    const payload = {
      store_id: Number(data.store_id),
      supplier_id: Number(data.supplier_id),
      created_by: currentUser.user_id,
      invoice_no: data.invoice_no || undefined,
      invoice_date: data.invoice_date || undefined,
      items: (data.items || [])
        .filter((r) => r.item_id)
        .map((r) => ({
          item_id: Number(r.item_id),
          batch_no: r.batch_no || null,
          expiry_date: r.expiry_date || null,
          qty: Number(r.qty || 0),
          purchase_rate: Number(r.purchase_rate || 0),
          mrp: Number(r.mrp || 0),
          discount_percent: Number(r.discount_percent || 0),
          gst_percent: Number(r.gst_percent || 0),
          pack_qty: Number(r.pack_qty || 0),
        })),
      total_amount: Number(totals.total_amount || 0),
      total_gst: Number(totals.total_gst || 0),
      total_discount: Number(totals.total_discount || 0),
      net_amount: Number(totals.net_amount || 0),
    };

    console.log("CREATE PAYLOAD:", payload);

    addpurchaseinvoice.mutate(payload, {
      onSuccess: () => {
        showSuccessToast("Purchased items updated successfully");
        resetForm();
        onClose?.();
      },
      onError: (error) => {
        showErrorToast("purchase not created")
      }
    });
  };

  // Handle row changes with auto qty & amount
  const handleItemChange = (index, field, value) => {
    const current = [...(watch("items") || [])];
    let row = { ...current[index], [field]: value };

    if (field === "pack_qty") {
      const packQtyNum = parseFloat(value || 0);
      const packSizeNum = parseFloat(row.pack_size || 0);
      row.qty = packQtyNum * (isNaN(packSizeNum) ? 0 : packSizeNum);
    }

    const qtyNum = parseFloat(row.qty || 0);
    const rateNum = parseFloat(row.purchase_rate || 0);
    let amount = qtyNum * rateNum;

    const discPercent = parseFloat(row.discount_percent || 0);
    if (!isNaN(discPercent) && discPercent > 0) {
      amount = amount - (amount * discPercent) / 100;
    }

    row.amount = isNaN(amount) ? "" : amount.toFixed(2);

    current[index] = row;
    setValue("items", current, { shouldValidate: true });
  };

  const handleAddRow = () => {
    append(emptyItemRow);
  };

  const handleRemoveRow = (index) => {
    if (fields.length === 1) return;
    remove(index);
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
          {/* Invoice No */}
          <Controller
            name="invoice_no"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Invoice No"
                fullWidth
                size="small"
                error={!!errors.invoice_no}
                helperText={errors.invoice_no?.message}
              />
            )}
          />

          {/* Invoice Date */}
          <Controller
            name="invoice_date"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Invoice Date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(newValue ? newValue.toISOString() : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      required: true,
                      error: !!errors.invoice_date,
                      helperText: errors.invoice_date?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />

          {/* Supplier */}
          <Controller
            name="supplier_id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Supplier"
                fullWidth
                size="small"
                error={!!errors.supplier_id}
                helperText={errors.supplier_id?.message}
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
            )}
          />

          {/* Store */}
          <Controller
            name="store_id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Store"
                fullWidth
                size="small"
                error={!!errors.store_id}
                helperText={errors.store_id?.message}
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
            )}
          />
        </Box>

        <Box display="flex" gap={3} mt={1}>
          <TextField
            label="Created By"
            value={currentUser?.username || createdBy || ""}
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
                  <TableCell sx={{ minWidth: 90 }}>Discount%</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>Pack Qty</TableCell>
                  <TableCell sx={{ minWidth: 70 }}>Qty</TableCell>
                  <TableCell sx={{ minWidth: 110 }}>Expiry</TableCell>
                  <TableCell sx={{ minWidth: 90 }}>Amount</TableCell>
                  <TableCell sx={{ width: 50 }} align="center">
                    Del
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {fields.map((field, index) => {
                  const rowErrors = errors.items?.[index] || {};
                  const rowValue = watchedItems[index] || {};

                  return (
                    <TableRow key={field.id}>
                      {/* Item */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.item_id`}
                          control={control}
                          render={({ field: itemField }) => (
                            <TextField
                              {...itemField}
                              select
                              // label="Item"
                              fullWidth
                              size="small"
                              error={!!rowErrors?.item_id}
                              helperText={rowErrors?.item_id?.message}
                              onChange={(e) => {
                                const value = e.target.value;
                                itemField.onChange(value);

                                const selectedItem = items.find(
                                  (it) => String(it.item_id) === String(value)
                                );
                                if (selectedItem) {
                                  // set GST% from HSN
                                  if (selectedItem.hsn?.gst_percent != null) {
                                    handleItemChange(
                                      index,
                                      "gst_percent",
                                      selectedItem.hsn.gst_percent
                                    );
                                  }
                                  // set pack_size and recalc qty
                                  if (selectedItem.pack_size != null) {
                                    const current = [...(watch("items") || [])];
                                    const r = {
                                      ...current[index],
                                      pack_size: selectedItem.pack_size,
                                    };
                                    const packQtyNum = parseFloat(r.pack_qty || 0);
                                    r.qty =
                                      packQtyNum *
                                      (isNaN(selectedItem.pack_size)
                                        ? 0
                                        : selectedItem.pack_size);
                                    current[index] = r;
                                    setValue("items", current, { shouldValidate: true });
                                  }
                                }
                              }}
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
                          )}
                        />
                      </TableCell>

                      {/* Batch */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.batch_no`}
                          control={control}
                          render={({ field: batchField }) => (
                            <TextField
                              {...batchField}
                              fullWidth
                              size="small"
                              // label="Batch"
                              error={!!rowErrors?.batch_no}
                              helperText={rowErrors?.batch_no?.message}
                            />
                          )}
                        />
                      </TableCell>

                      {/* Rate */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.purchase_rate`}
                          control={control}
                          render={({ field: rateField }) => (
                            <TextField
                              {...rateField}
                              fullWidth
                              size="small"
                              // label="Rate"
                              inputProps={{ min: 0, step: "0.01" }}
                              error={!!rowErrors?.purchase_rate}
                              helperText={rowErrors?.purchase_rate?.message}
                              onChange={(e) =>
                                handleItemChange(index, "purchase_rate", e.target.value)
                              }
                            />
                          )}
                        />
                      </TableCell>

                      {/* MRP */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.mrp`}
                          control={control}
                          render={({ field: mrpField }) => (
                            <TextField
                              {...mrpField}
                              fullWidth
                              size="small"
                              // label="MRP"
                              inputProps={{ min: 0, step: "0.01" }}
                              error={!!rowErrors?.mrp}
                              helperText={rowErrors?.mrp?.message}
                              onChange={(e) =>
                                handleItemChange(index, "mrp", e.target.value)
                              }
                            />
                          )}
                        />
                      </TableCell>

                      {/* GST% */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.gst_percent`}
                          control={control}
                          render={({ field: gstField }) => (
                            <TextField
                              {...gstField}
                              fullWidth
                              size="small"
                              // label="GST%"
                              inputProps={{ min: 0, step: "0.01" }}
                              error={!!rowErrors?.gst_percent}
                              helperText={rowErrors?.gst_percent?.message}
                              onChange={(e) =>
                                handleItemChange(index, "gst_percent", e.target.value)
                              }
                            />
                          )}
                        />
                      </TableCell>

                      {/* Disc% */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.discount_percent`}
                          control={control}
                          render={({ field: discField }) => (
                            <TextField
                              {...discField}
                              fullWidth
                              size="small"
                              // label="Disc%"
                              inputProps={{ min: 0, step: "0.01" }}
                              error={!!rowErrors?.discount_percent}
                              helperText={rowErrors?.discount_percent?.message}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "discount_percent",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        />
                      </TableCell>

                      {/* Pack Qty */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.pack_qty`}
                          control={control}
                          render={({ field: packField }) => (
                            <TextField
                              {...packField}
                              fullWidth
                              size="small"
                              // label="Pack Qty"
                              inputProps={{ min: 0, step: "1" }}
                              error={!!rowErrors?.pack_qty}
                              helperText={rowErrors?.pack_qty?.message}
                              onChange={(e) =>
                                handleItemChange(index, "pack_qty", e.target.value)
                              }
                            />
                          )}
                        />
                      </TableCell>

                      {/* Qty (read-only) */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.qty`}
                          control={control}
                          render={({ field: qtyField }) => (
                            <TextField
                              {...qtyField}
                              fullWidth
                              size="small"
                              // label="Qty"
                              InputProps={{ readOnly: true }}
                              error={!!rowErrors?.qty}
                              helperText={rowErrors?.qty?.message}
                              value={rowValue.qty || ""}
                            />
                          )}
                        />
                      </TableCell>

                      {/* Expiry */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.expiry_date`}
                          control={control}
                          render={({ field: expField }) => (
                            <TextField
                              {...expField}
                              fullWidth
                              size="small"
                              placeholder="MM/YYYY"
                              InputLabelProps={{ shrink: true }}
                              error={!!rowErrors?.expiry_date}
                              helperText={rowErrors?.expiry_date?.message}
                            />

                          )}
                        />
                      </TableCell>

                      {/* Amount */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <Controller
                          name={`items.${index}.amount`}
                          control={control}
                          render={({ field: amtField }) => (
                            <TextField
                              {...amtField}
                              fullWidth
                              size="small"
                              // label="Amount"
                              InputProps={{ readOnly: true }}
                              value={rowValue.amount || ""}
                              error={!!rowErrors?.amount}
                              helperText={rowErrors?.amount?.message}
                            />
                          )}
                        />
                      </TableCell>

                      {/* Delete */}
                      <TableCell align="center" padding="none" sx={{ p: 0.25 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveRow(index)}
                          disabled={fields.length === 1}
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
        {errors.items && typeof errors.items.message === "string" && (
          <Typography color="error" variant="caption" sx={{ ml: 1 }}>
            {errors.items.message}
          </Typography>
        )}
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
              value={totals.total_amount}
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
              value={totals.total_gst}
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
              value={totals.total_discount}
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
              value={totals.net_amount}
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
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Save Purchase
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
