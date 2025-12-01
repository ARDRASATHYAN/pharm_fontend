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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { purchaseSchema } from "../validation/purchaseSchema";

const emptyItemRow = {
  item_id: "",
  batch_no: "",
  expiry_date: "",
  pack_size: "",
  qty: "",
  free_qty: 0,
  purchase_rate: "",
  mrp: "",
  sale_rate: "",
  discount_percent: "",
  discount_amount: "",
  scheme_discount_percent: "",
  scheme_discount_amount: "",
  taxable_amount: "",
  gst_percent: "",
  cgst: "",
  sgst: "",
  igst: "",
  total_amount: "",
  // --- HSN FIELDS ---
  hsn_id: "",
  hsn_code: "",
};

export default function AddPurchaseForm({ onClose }) {
  // ===== API HOOKS =====
  const { data: storesRes = {}, isLoading: loadingStore } = useStores();
  const { data: suppliersRes = {}, isLoading: loadingSupplier } = useSupplier();
  const { data: itemsMastersRes = [], isLoading: loadingItems } = useitem();
  const { data: currentUserResponse } = useCurrentUser();
  const addpurchaseinvoice = useAddpurchaseinvoice();

  // normalized data
  const stores = Array.isArray(storesRes?.stores)
    ? storesRes.stores
    : Array.isArray(storesRes?.data)
    ? storesRes.data
    : [];

  const suppliers = Array.isArray(suppliersRes?.suppliers)
    ? suppliersRes.suppliers
    : Array.isArray(suppliersRes?.data)
    ? suppliersRes.data
    : [];

  const items = Array.isArray(itemsMastersRes?.items)
    ? itemsMastersRes.items
    : Array.isArray(itemsMastersRes?.data)
    ? itemsMastersRes.data
    : Array.isArray(itemsMastersRes)
    ? itemsMastersRes
    : [];

  const currentUser = Array.isArray(currentUserResponse)
    ? currentUserResponse[0]
    : currentUserResponse || null;

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

  const watchedItems = watch("items") || [];

  const [totals, setTotals] = useState({
    total_amount: 0,
    total_gst: 0,
    total_discount: 0,
    net_amount: 0,
  });

  const [createdBy, setCreatedBy] = useState("");
  const [advancedRowIndex, setAdvancedRowIndex] = useState(null);

  useEffect(() => {
    if (currentUser?.user_id) {
      setCreatedBy(currentUser.user_id);
    }
  }, [currentUser]);

  // ===== TOTAL SUMMARY CALC (from each row) =====
  useEffect(() => {
    let total_amount = 0; // taxable total
    let total_gst = 0;
    let total_discount = 0;

    watchedItems.forEach((r) => {
      const taxable = Number(r.taxable_amount || 0);
      const discAmt = Number(r.discount_amount || 0);
      const cgst = Number(r.cgst || 0);
      const sgst = Number(r.sgst || 0);
      const igst = Number(r.igst || 0);

      total_amount += taxable;
      total_discount += discAmt;
      total_gst += cgst + sgst + igst;
    });

    const net_amount = total_amount + total_gst;

    setTotals({
      total_amount: Number.isFinite(total_amount)
        ? Number(total_amount.toFixed(2))
        : 0,
      total_gst: Number.isFinite(total_gst) ? Number(total_gst.toFixed(2)) : 0,
      total_discount: Number.isFinite(total_discount)
        ? Number(total_discount.toFixed(2))
        : 0,
      net_amount: Number.isFinite(net_amount)
        ? Number(net_amount.toFixed(2))
        : 0,
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

  // ===== PER-ROW CALCULATION =====
  const recalcRow = (row) => {
    const qty = Number(row.qty || 0);
    const rate = Number(row.purchase_rate || 0);
    const free_qty = Number(row.free_qty || 0); // currently for stock only, not in amount
    const discPercent = Number(row.discount_percent || 0);
    const schemeDiscPercent = Number(row.scheme_discount_percent || 0);
    const gstPercent = Number(row.gst_percent || 0);

    const gross = qty * rate;
    const discountAmount = (gross * discPercent) / 100;
    const schemeDiscountAmount = (gross * schemeDiscPercent) / 100;

    const taxable = gross - discountAmount - schemeDiscountAmount;
    const gstAmount = (taxable * gstPercent) / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const igst = 0; // adjust for interstate if needed
    const total = taxable + gstAmount;

    return {
      ...row,
      discount_amount: isNaN(discountAmount)
        ? ""
        : discountAmount.toFixed(2),
      scheme_discount_amount: isNaN(schemeDiscountAmount)
        ? ""
        : schemeDiscountAmount.toFixed(2),
      taxable_amount: isNaN(taxable) ? "" : taxable.toFixed(2),
      cgst: isNaN(cgst) ? "" : cgst.toFixed(2),
      sgst: isNaN(sgst) ? "" : sgst.toFixed(2),
      igst: isNaN(igst) ? "" : igst.toFixed(2),
      total_amount: isNaN(total) ? "" : total.toFixed(2),
    };
  };

  const handleItemChange = (index, field, value) => {
    const current = [...(watch("items") || [])];
    let row = { ...current[index], [field]: value };
    row = recalcRow(row);
    current[index] = row;
    setValue("items", current, { shouldValidate: true });
  };

  const handleAddRow = () => append(emptyItemRow);

  const handleRemoveRow = (index) => {
    if (fields.length === 1) return;
    remove(index);
  };

  const openAdvanced = (index) => {
    setAdvancedRowIndex(index);
  };

  const closeAdvanced = () => {
    setAdvancedRowIndex(null);
  };

  // ===== SUBMIT =====
  const onSubmit = (data) => {
    console.log(data,"data");
    
    if (!currentUser?.user_id) return;

    const validItems = (data.items || []).filter((r) => r.item_id);
    if (!validItems.length) {
      showErrorToast("Please add at least one item");
      return;
    }

    const payload = {
      store_id: Number(data.store_id),
      supplier_id: Number(data.supplier_id),
      created_by: currentUser.user_id,
      invoice_no: data.invoice_no || undefined,
      invoice_date: data.invoice_date || undefined,
      items: validItems.map((r) => ({
        item_id: Number(r.item_id),
        batch_no: r.batch_no || null,
        expiry_date: r.expiry_date || null,
        qty: Number(r.qty || 0),
        free_qty: Number(r.free_qty || 0),
        purchase_rate: Number(r.purchase_rate || 0),
        mrp: Number(r.mrp || 0),
        sale_rate: r.sale_rate ? Number(r.sale_rate) : null,
        discount_percent: Number(r.discount_percent || 0),
        discount_amount: Number(r.discount_amount || 0),
        scheme_discount_percent: Number(r.scheme_discount_percent || 0),
        scheme_discount_amount: Number(r.scheme_discount_amount || 0),
        taxable_amount: Number(r.taxable_amount || 0),
        gst_percent: Number(r.gst_percent || 0),
        cgst: Number(r.cgst || 0),
        sgst: Number(r.sgst || 0),
        igst: Number(r.igst || 0),
        total_amount: Number(r.total_amount || 0),
        // ===== HSN FIELDS IN PAYLOAD =====
        hsn_id: r.hsn_id ? Number(r.hsn_id) : null,
        hsn_code: r.hsn_code || null,
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
      onError: () => {
        showErrorToast("Purchase not created");
      },
    });
  };

  const advancedRow =
    advancedRowIndex != null ? watchedItems[advancedRowIndex] : null;

  // ===== UI =====
  return (
    <>
      <Box
        gap={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
        }}
      >
        {/* HEADER */}
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            display="flex"
            className="text-blue-700"
          >
            Purchase Invoice
          </Typography>
          <Divider />

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={3}>
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
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="invoice_date"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Invoice Date"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) =>
                        field.onChange(
                          newValue ? newValue.format("YYYY-MM-DD") : null
                        )
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
            </Grid>

            <Grid item xs={12} md={3}>
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
                      suppliers.map((s) => (
                        <MenuItem key={s.supplier_id} value={s.supplier_id}>
                          {s.supplier_name || s.supplier_id}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
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
                      stores.map((s) => (
                        <MenuItem key={s.store_id} value={s.store_id}>
                          {s.store_name || s.store_id}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Created By"
                value={currentUser?.username || createdBy || ""}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* ITEMS TABLE */}
        <Box mt={2} sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              className="text-blue-700"
            >
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
                    <TableCell sx={{ minWidth: 110 }}>HSN</TableCell>
                    <TableCell sx={{ minWidth: 110 }}>Batch</TableCell>
                    <TableCell sx={{ minWidth: 90 }}>Expiry</TableCell>
                    <TableCell sx={{ minWidth: 70 }}>Pack Sz</TableCell>
                    <TableCell sx={{ minWidth: 70 }}>Qty</TableCell>
                    <TableCell sx={{ minWidth: 70 }}>Free</TableCell>
                    <TableCell sx={{ minWidth: 90 }}>Purchase</TableCell>
                    <TableCell sx={{ minWidth: 90 }}>MRP</TableCell>
                    <TableCell sx={{ minWidth: 90 }}>Sale</TableCell>
                    <TableCell sx={{ minWidth: 70 }}>GST%</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Total</TableCell>
                    <TableCell sx={{ minWidth: 120 }} align="center">
                      Actions
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
                                fullWidth
                                size="small"
                                error={!!rowErrors?.item_id}
                                helperText={rowErrors?.item_id?.message}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  itemField.onChange(value);

                                  const selectedItem = items.find(
                                    (it) =>
                                      String(it.item_id) === String(value)
                                  );

                                  if (selectedItem) {
                                    const current = [
                                      ...(watch("items") || []),
                                    ];
                                    let row = { ...current[index] };

                                    if (selectedItem.pack_size != null) {
                                      row.pack_size = selectedItem.pack_size;
                                    }
                                    if (selectedItem.mrp != null) {
                                      row.mrp = selectedItem.mrp;
                                    }
                                    if (selectedItem.sale_rate != null) {
                                      row.sale_rate = selectedItem.sale_rate;
                                    }

                                    // ===== HSN + GST FROM MASTER =====
                                    if (selectedItem.hsn) {
                                      if (
                                        selectedItem.hsn.gst_percent != null
                                      ) {
                                        row.gst_percent =
                                          selectedItem.hsn.gst_percent;
                                      }
                                      if (selectedItem.hsn.hsn_id != null) {
                                        row.hsn_id = selectedItem.hsn.hsn_id;
                                      }
                                      if (selectedItem.hsn.hsn_code != null) {
                                        row.hsn_code =
                                          selectedItem.hsn.hsn_code;
                                      }
                                    }

                                    row = recalcRow(row);
                                    current[index] = row;
                                    setValue("items", current, {
                                      shouldValidate: true,
                                    });
                                  }
                                }}
                              >
                                {loadingItems ? (
                                  <MenuItem disabled>Loading items...</MenuItem>
                                ) : (
                                  items.map((it) => (
                                    <MenuItem
                                      key={it.item_id}
                                      value={it.item_id}
                                    >
                                      {it.item_name ||
                                        it.name ||
                                        `Item #${it.item_id}`}
                                    </MenuItem>
                                  ))
                                )}
                              </TextField>
                            )}
                          />
                        </TableCell>

                        {/* HSN (read-only) */}
                        <TableCell padding="none" sx={{ p: 0.25 }}>
                          <Controller
                            name={`items.${index}.hsn_code`}
                            control={control}
                            render={({ field: hsnField }) => (
                              <TextField
                                {...hsnField}
                                fullWidth
                                size="small"
                                InputProps={{ readOnly: true }}
                                placeholder="HSN"
                              />
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
                                error={!!rowErrors?.batch_no}
                                helperText={rowErrors?.batch_no?.message}
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
                                placeholder="YYYY-MM-DD"
                                InputLabelProps={{ shrink: true }}
                                error={!!rowErrors?.expiry_date}
                                helperText={rowErrors?.expiry_date?.message}
                              />
                            )}
                          />
                        </TableCell>

                        {/* Pack Size */}
                        <TableCell padding="none" sx={{ p: 0.25 }}>
                          <Controller
                            name={`items.${index}.pack_size`}
                            control={control}
                            render={({ field: psField }) => (
                              <TextField
                                {...psField}
                                fullWidth
                                size="small"
                                inputProps={{ min: 0, step: "1" }}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "pack_size",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>

                        {/* Qty */}
                        <TableCell padding="none" sx={{ p: 0.25 }}>
                          <Controller
                            name={`items.${index}.qty`}
                            control={control}
                            render={({ field: qtyField }) => (
                              <TextField
                                {...qtyField}
                                fullWidth
                                size="small"
                                inputProps={{ min: 0, step: "1" }}
                                error={!!rowErrors?.qty}
                                helperText={rowErrors?.qty?.message}
                                value={rowValue.qty || ""}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "qty",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>

                        {/* Free Qty */}
                        <TableCell padding="none" sx={{ p: 0.25 }}>
                          <Controller
                            name={`items.${index}.free_qty`}
                            control={control}
                            render={({ field: fqField }) => (
                              <TextField
                                {...fqField}
                                fullWidth
                                size="small"
                                inputProps={{ min: 0, step: "1" }}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "free_qty",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>

                        {/* Purchase Rate */}
                        <TableCell padding="none" sx={{ p: 0.25 }}>
                          <Controller
                            name={`items.${index}.purchase_rate`}
                            control={control}
                            render={({ field: rateField }) => (
                              <TextField
                                {...rateField}
                                fullWidth
                                size="small"
                                inputProps={{ min: 0, step: "0.01" }}
                                error={!!rowErrors?.purchase_rate}
                                helperText={rowErrors?.purchase_rate?.message}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "purchase_rate",
                                    e.target.value
                                  )
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
                                inputProps={{ min: 0, step: "0.01" }}
                                error={!!rowErrors?.mrp}
                                helperText={rowErrors?.mrp?.message}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "mrp",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>

                        {/* Sale Rate */}
                        <TableCell padding="none" sx={{ p: 0.25 }}>
                          <Controller
                            name={`items.${index}.sale_rate`}
                            control={control}
                            render={({ field: saleField }) => (
                              <TextField
                                {...saleField}
                                fullWidth
                                size="small"
                                inputProps={{ min: 0, step: "0.01" }}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "sale_rate",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>

                        {/* GST % */}
                        <TableCell padding="none" sx={{ p: 0.25 }}>
                          <Controller
                            name={`items.${index}.gst_percent`}
                            control={control}
                            render={({ field: gstField }) => (
                              <TextField
                                {...gstField}
                                fullWidth
                                size="small"
                                inputProps={{ min: 0, step: "0.01" }}
                                error={!!rowErrors?.gst_percent}
                                helperText={rowErrors?.gst_percent?.message}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "gst_percent",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>

                        {/* Total Amount */}
                        <TableCell padding="none" sx={{ p: 0.25 }}>
                          <Controller
                            name={`items.${index}.total_amount`}
                            control={control}
                            render={({ field: taField }) => (
                              <TextField
                                {...taField}
                                fullWidth
                                size="small"
                                InputProps={{ readOnly: true }}
                                value={rowValue.total_amount || ""}
                              />
                            )}
                          />
                        </TableCell>

                        {/* Actions */}
                        <TableCell
                          align="center"
                          padding="none"
                          sx={{ p: 0.25, whiteSpace: "nowrap" }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => openAdvanced(index)}
                          >
                            More
                          </Button>
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

        {/* SUMMARY */}
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
                label="Total Taxable"
                name="total_amount"
                value={totals.total_amount.toFixed(2)}
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
                value={totals.total_gst.toFixed(2)}
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
                value={totals.total_discount.toFixed(2)}
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
                value={totals.net_amount.toFixed(2)}
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
  onClick={handleSubmit(
    (data) => {
      console.log("✅ onSubmit CALLED with data:", data);
      onSubmit(data);
    },
    (formErrors) => {
      console.log("❌ VALIDATION ERRORS:", formErrors);
    }
  )}
  disabled={addpurchaseinvoice.isLoading}
>
  {addpurchaseinvoice.isLoading ? "Saving..." : "Save Purchase"}
</Button>

          </Box>
        </Box>
      </Box>

      {/* ADVANCED ROW DIALOG */}
      <Dialog
        open={advancedRowIndex !== null}
        onClose={closeAdvanced}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Advanced Item Details</DialogTitle>
        <DialogContent dividers>
          {advancedRow && (
            <Grid container spacing={2} mt={0.5}>
              <Grid item xs={6}>
                <Controller
                  name={`items.${advancedRowIndex}.discount_percent`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Discount %"
                      fullWidth
                      size="small"
                      inputProps={{ min: 0, step: "0.01" }}
                      onChange={(e) =>
                        handleItemChange(
                          advancedRowIndex,
                          "discount_percent",
                          e.target.value
                        )
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`items.${advancedRowIndex}.discount_amount`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Discount Amount"
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      value={advancedRow.discount_amount || ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name={`items.${advancedRowIndex}.scheme_discount_percent`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Scheme %"
                      fullWidth
                      size="small"
                      inputProps={{ min: 0, step: "0.01" }}
                      onChange={(e) =>
                        handleItemChange(
                          advancedRowIndex,
                          "scheme_discount_percent",
                          e.target.value
                        )
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`items.${advancedRowIndex}.scheme_discount_amount`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Scheme Amount"
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      value={advancedRow.scheme_discount_amount || ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name={`items.${advancedRowIndex}.taxable_amount`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Taxable Amount"
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      value={advancedRow.taxable_amount || ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <Controller
                  name={`items.${advancedRowIndex}.cgst`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="CGST"
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      value={advancedRow.cgst || ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`items.${advancedRowIndex}.sgst`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="SGST"
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      value={advancedRow.sgst || ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`items.${advancedRowIndex}.igst`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="IGST"
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                      value={advancedRow.igst || ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAdvanced}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
