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
  Autocomplete,
} from "@mui/material";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { useStores } from "@/hooks/useStore";
import { useSupplier } from "@/hooks/useSupplier";
import { useCurrentUser } from "@/hooks/useAuth";
import { useAddpurchaseinvoice } from "@/hooks/usePurchaseInvoice";
import { showErrorToast, showSuccessToast } from "@/lib/toastService";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { purchaseSchema } from "../validation/purchaseSchema";
import { useInfiniteItem, useItem } from "@/hooks/useItem";

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
  scheme_discount_type: "percent",
  taxable_amount: "",
  gst_percent: "",
  cgst: "",
  sgst: "",
  igst: "",
  total_amount: "",
  hsn_id: "",
  hsn_code: "",
};

export default function AddPurchaseForm({ onClose }) {
  const [search,setSearch]=useState()
  const { data: storesRes = {}, isLoading: loadingStore } = useStores();
  const { data: suppliersRes = {}, isLoading: loadingSupplier } = useSupplier();
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteItem({ search });
console.log("item",data);


const items = data?.pages.flatMap((p) => p.data) ?? [];
console.log("items",items);


  const { data: currentUserResponse } = useCurrentUser();
  const addpurchaseinvoice = useAddpurchaseinvoice();

  const handleScroll = (e) => {
  const bottom =
    e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

  if (bottom && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};


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

  // const items = Array.isArray(itemsMastersRes?.items)
  //   ? itemsMastersRes.items
  //   : Array.isArray(itemsMastersRes?.data)
  //     ? itemsMastersRes.data
  //     : Array.isArray(itemsMastersRes)
  //       ? itemsMastersRes
  //       : [];

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
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    if (currentUser?.user_id) {
      setCreatedBy(currentUser.user_id);
    }
  }, [currentUser]);

  // ===== TOTAL SUMMARY CALC =====
  useEffect(() => {
    let total_amount = 0;
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
     const mrp = Number(row.mrp || 0);
    const discPercent = Number(row.discount_percent || 0);
    const gstPercent = Number(row.gst_percent || 0);

    const gross = qty * rate;
    const discountAmount = (gross * discPercent) / 100;

    // Scheme logic
    let schemeDiscountAmount = 0;
    if (row.scheme_discount_type === "percent") {
      schemeDiscountAmount = (gross * Number(row.scheme_discount_percent || 0)) / 100;
    } else {
      // User input: preserve typed value
      schemeDiscountAmount = row.scheme_discount_amount ? Number(row.scheme_discount_amount) : 0;
    }

    const taxable = gross - discountAmount - schemeDiscountAmount;
   const saleRate = mrp - (discountAmount + schemeDiscountAmount) / qty;
    const gstAmount = (taxable * gstPercent) / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const igst = 0;
    const total = taxable + gstAmount;
    

    return {
      ...row,
      discount_amount: isNaN(discountAmount) ? "" : discountAmount,
      scheme_discount_amount: isNaN(schemeDiscountAmount) ? "" : schemeDiscountAmount,
      taxable_amount: isNaN(taxable) ? "" : taxable.toFixed(2),
cgst: isNaN(cgst) ? "" : cgst.toFixed(2),
sgst: isNaN(sgst) ? "" : sgst.toFixed(2),
igst: isNaN(igst) ? "" : igst.toFixed(2),
total_amount: isNaN(total) ? "" : total.toFixed(2),
sale_rate: isNaN(saleRate) ? "" : saleRate.toFixed(2),
    };
  };



  const handleItemChange = (index, field, value) => {
    const updatedRow = recalcRow({ ...watchedItems[index], [field]: value });

    // Update all fields of this row
    Object.keys(updatedRow).forEach((key) => {
      setValue(`items.${index}.${key}`, updatedRow[key], {
        shouldValidate: true,
        shouldDirty: true,
      });
    });

    // Recalculate totals immediately
    const newItems = [...watchedItems];
    newItems[index] = updatedRow;

    let total_amount = 0;
    let total_gst = 0;
    let total_discount = 0;

    newItems.forEach((r) => {
      total_amount += Number(r.taxable_amount || 0);
      total_discount += Number(r.discount_amount || 0);
      total_gst += Number(r.cgst || 0) + Number(r.sgst || 0) + Number(r.igst || 0);
    });

    setTotals({
      total_amount: Number(total_amount.toFixed(2)),
      total_gst: Number(total_gst.toFixed(2)),
      total_discount: Number(total_discount.toFixed(2)),
      net_amount: Number((total_amount + total_gst).toFixed(2)),
    });
  };


  const handleAddRow = () => append(emptyItemRow);
  const handleRemoveRow = (index) => {
    if (fields.length === 1) return;
    remove(index);
  };

  const toggleAdvanced = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // ===== SUBMIT =====
  const onSubmit = (data) => {
    console.log("SUBMIT CALLED", data);
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
        hsn_id: r.hsn_id ? Number(r.hsn_id) : null,
        hsn_code: r.hsn_code || null,
      })),
      total_amount: Number(totals.total_amount || 0),
      total_gst: Number(totals.total_gst || 0),
      total_discount: Number(totals.total_discount || 0),
      net_amount: Number(totals.net_amount || 0),
    };

    addpurchaseinvoice.mutate(payload, {
      onSuccess: () => {
        showSuccessToast("Purchased items updated successfully");
        resetForm();
        onClose?.();
      },
      onError: () => showErrorToast("Purchase not created"),
    });
  };

  // ===== UI =====
  return (
    <form onSubmit={handleSubmit(onSubmit, (err) => console.log("FORM ERRORS", err))}>

      <Box gap={2} sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
        {/* HEADER */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} display="flex" className="text-blue-700">
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
                        field.onChange(newValue ? newValue.format("YYYY-MM-DD") : null)
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
                    <TableCell sx={{ minWidth: 120 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field, index) => {
                    const rowErrors = errors.items?.[index] || {};
                    const rowValue = watchedItems[index] || {};
                    const isExpanded = expandedRows[index];

                    return (
                      <React.Fragment key={field.id}>
                        <TableRow>
                          {/* Item */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                      <Controller
  name={`items.${index}.item_id`}
  control={control}
  render={({ field: itemField }) => {
    // Use local state for Autocomplete
    const [localItem, setLocalItem] = React.useState(() =>
      items.find(it => Number(it.item_id) === Number(itemField.value)) || null
    );

    React.useEffect(() => {
      // Sync RHF value when localItem changes
      itemField.onChange(localItem?.item_id || "");
    }, [localItem]);

    return (
      <Autocomplete
        value={localItem}
        onChange={(e, newValue) => {
          setLocalItem(newValue || null);

          if (!newValue) return;

          const currentRow = { ...watchedItems[index] };
          const updatedRow = recalcRow({
            ...currentRow,
            item_id: newValue.item_id,
            pack_size: newValue.pack_size,
            mrp: newValue.mrp,
            sale_rate: newValue.sale_rate,
            hsn_id: newValue.hsn?.hsn_id,
            hsn_code: newValue.hsn?.hsn_code,
            gst_percent: newValue.hsn?.gst_percent,
          });

          setValue(`items.${index}`, { ...updatedRow }, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        onInputChange={(e, val) => setSearch(val)}
        options={items}
        getOptionLabel={(option) => option.name || ""}
        loading={isFetchingNextPage}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Item"
            size="small"
            error={!!errors.items?.[index]?.item_id}
            helperText={errors.items?.[index]?.item_id?.message}
          />
        )}
      />
    );
  }}
/>





                          </TableCell>

                          {/* HSN */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField value={rowValue.hsn_code} size="small" fullWidth InputProps={{ readOnly: true }} />
                          </TableCell>

                          {/* Batch */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" value={rowValue.batch_no || ""} onChange={(e) => handleItemChange(index, "batch_no", e.target.value)} />
                          </TableCell>

                          {/* Expiry */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" value={rowValue.expiry_date || ""} placeholder="YYYY-MM-DD" onChange={(e) => handleItemChange(index, "expiry_date", e.target.value)} />
                          </TableCell>

                          {/* Pack Size */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" value={rowValue.pack_size || ""} onChange={(e) => handleItemChange(index, "pack_size", e.target.value)} />
                          </TableCell>

                          {/* Qty */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" value={rowValue.qty || ""} onChange={(e) => handleItemChange(index, "qty", e.target.value)} />
                          </TableCell>

                          {/* Free */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" value={rowValue.free_qty || ""} onChange={(e) => handleItemChange(index, "free_qty", e.target.value)} />
                          </TableCell>

                          {/* Purchase */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" value={rowValue.purchase_rate || ""} onChange={(e) => handleItemChange(index, "purchase_rate", e.target.value)} />
                          </TableCell>

                          {/* MRP */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" value={rowValue.mrp || ""} onChange={(e) => handleItemChange(index, "mrp", e.target.value)} />
                          </TableCell>

                          {/* Sale */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" value={rowValue.sale_rate || ""} onChange={(e) => handleItemChange(index, "sale_rate", e.target.value)} />
                          </TableCell>

                          {/* GST */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" value={rowValue.gst_percent || ""} onChange={(e) => handleItemChange(index, "gst_percent", e.target.value)} />
                          </TableCell>

                          {/* Total */}
                          <TableCell padding="none" sx={{ p: 0.25 }}>
                            <TextField fullWidth size="small" InputProps={{ readOnly: true }} value={rowValue.total_amount || ""} />
                          </TableCell>

                          {/* Actions */}
                          <TableCell align="center" padding="none" sx={{ p: 0.25, whiteSpace: "nowrap" }}>
                            <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => toggleAdvanced(index)}>
                              {isExpanded ? "Less" : "More"}
                            </Button>
                            <IconButton size="small" onClick={() => handleRemoveRow(index)} disabled={fields.length === 1}>
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>

                        {/* Advanced Row Inline */}
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={13} sx={{ p: 1, backgroundColor: "#f9f9f9" }}>
                              <Box container spacing={1} display="flex">
                                <TextField sx={{ p: 0.25, whiteSpace: "nowrap" }}
                                  label="taxable %"
                                  fullWidth
                                  size="small"
                                  value={rowValue.taxable_amount || ""}
                                  InputProps={{ readOnly: true }}
                                />

                                <TextField sx={{ p: 0.25, whiteSpace: "nowrap" }}
                                  label="Discount %"
                                  fullWidth
                                  size="small"
                                  value={rowValue.discount_percent || ""}
                                  onChange={(e) => handleItemChange(index, "discount_percent", e.target.value)}
                                />

                                <TextField sx={{ p: 0.25, whiteSpace: "nowrap" }}
                                  label="Discount Amount"
                                  fullWidth
                                  size="small"
                                  value={rowValue.discount_amount || ""}
                                  InputProps={{ readOnly: true }}
                                />

                                <TextField sx={{ p: 0.25, whiteSpace: "nowrap" }}
                                  select
                                  label="Scheme Type"
                                  fullWidth
                                  size="small"
                                  value={rowValue.scheme_discount_type || "percent"}
                                  onChange={(e) => handleItemChange(index, "scheme_discount_type", e.target.value)}
                                >
                                  <MenuItem value="percent">Percent (%)</MenuItem>
                                  <MenuItem value="amount">Amount (₹)</MenuItem>
                                </TextField>


                                <TextField sx={{ p: 0.25, whiteSpace: "nowrap" }}
                                  label="Scheme %"
                                  fullWidth
                                  size="small"
                                  value={rowValue.scheme_discount_percent || ""}
                                  onChange={(e) => handleItemChange(index, "scheme_discount_percent", e.target.value)}
                                  disabled={rowValue.scheme_discount_type === "amount"} // Disable if amount is selected
                                />

                                <TextField sx={{ p: 0.25, whiteSpace: "nowrap" }}
                                  label="Scheme Amount"
                                  fullWidth
                                  size="small"
                                  type="number"
                                  inputProps={{ step: "0.01" }}
                                  value={rowValue.scheme_discount_amount || ""}
                                  onChange={(e) => handleItemChange(index, "scheme_discount_amount", e.target.value)}
                                  disabled={rowValue.scheme_discount_type === "percent"} // ONLY disable if percent
                                  InputProps={{ readOnly: rowValue.scheme_discount_type === "percent" }} // ensure readonly aligns
                                />



                                <TextField sx={{ p: 0.25, whiteSpace: "nowrap" }} label="CGST" fullWidth size="small" value={rowValue.cgst || ""} InputProps={{ readOnly: true }} />

                                <TextField sx={{ p: 0.25, whiteSpace: "nowrap" }} label="SGST" fullWidth size="small" value={rowValue.sgst || ""} InputProps={{ readOnly: true }} />

                                <TextField sx={{ p: 0.25, whiteSpace: "nowrap" }} label="IGST" fullWidth size="small" value={rowValue.igst || ""} InputProps={{ readOnly: true }} />

                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Box>

        {/* SUMMARY */}
        <Box mt={2}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom className="text-blue-700">
            Amount Summary
          </Typography>
          <Divider />
          <Grid container spacing={2} mt={1} justifyContent="flex-end">
            <Grid item xs={12} sm={3}><TextField label="Total Taxable" value={totals.total_amount.toFixed(2)} fullWidth size="small" InputProps={{ readOnly: true }} /></Grid>
            <Grid item xs={12} sm={3}><TextField label="Total GST" value={totals.total_gst.toFixed(2)} fullWidth size="small" InputProps={{ readOnly: true }} /></Grid>
            <Grid item xs={12} sm={3}><TextField label="Total Discount" value={totals.total_discount.toFixed(2)} fullWidth size="small" InputProps={{ readOnly: true }} /></Grid>
            <Grid item xs={12} sm={3}><TextField label="Net Amount" value={totals.net_amount.toFixed(2)} fullWidth size="small" InputProps={{ readOnly: true }} /></Grid>
          </Grid>

          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            {onClose && <Button variant="outlined" onClick={onClose}>Cancel</Button>}
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
}