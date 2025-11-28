import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Box,
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
import { useAddSalesReturn } from "@/hooks/useSalesReturn";
import { useSalesInvoiceList, useSaleItems } from "@/hooks/useSalesInvoice";
import { showErrorToast, showSuccessToast } from "@/lib/toastService";

const emptyRow = {
  item_id: "",
  batch_no: "",
  qty: 0,
  rate: 0,
  discount_percent: 0,
  gst_percent: 0,
  amount: 0,
  max_qty: null,
};

const initialData = {
  store_id: "",
  sale_id: "",
  return_date: null,
  reason: "",
  total_amount: 0,
};

export default function AddSalesReturnForm({ onClose }) {
  const { data: stores = [], isLoading: loadingStores } = useStores();
  const { data: currentUser } = useCurrentUser();
  const { data: salesInvoices = [] } = useSalesInvoiceList();
  const addSalesReturn = useAddSalesReturn();

  const [formData, setFormData] = useState(initialData);
  const [rows, setRows] = useState([emptyRow]);

  // sale items of selected sale
  const { data: saleItems = [], isLoading: loadingSaleItems } = useSaleItems(
    formData.sale_id
  );

  // set created_by once
  useEffect(() => {
    if (currentUser?.user_id) {
      setFormData((prev) => ({
        ...prev,
        created_by: prev.created_by || currentUser.user_id,
      }));
    }
  }, [currentUser?.user_id]);

  // helper: calculate line amount = (qty * rate) - discount
 const computeRowAmount = (row) => {
  const qtyNum = Number(row.qty || 0);
  const rateNum = Number(row.rate || 0);
  const discPercent = Number(row.discount_percent || 0);
  const gstPercent = Number(row.gst_percent || 0);

  const gross = qtyNum * rateNum;                       // qty * rate
  const discountAmount = (gross * discPercent) / 100;   // discount
  const taxable = gross - discountAmount;               // after discount
  const gstAmount = (taxable * gstPercent) / 100;       // GST on taxable
  const amount = taxable + gstAmount;                   // final line value

  if (!Number.isFinite(amount)) return "0.00";
  return amount.toFixed(2);
};


  // when sale is selected
  const handleSaleChange = (saleId) => {
    const selectedSale = salesInvoices.find((s) => s.sale_id === saleId);

    setFormData((prev) => ({
      ...prev,
      sale_id: saleId,
      store_id: selectedSale?.store_id || "",
    }));

    setRows([emptyRow]); // reset rows
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const newRows = [...prev];
      let row = { ...newRows[index], [field]: value };

      // when item is selected: auto-fill from sale item
      if (field === "item_id") {
        const selectedItem = saleItems.find(
          (i) => String(i.item_id) === String(value)
        );

        if (selectedItem) {
          row.rate = selectedItem.rate;
          row.qty = selectedItem.qty; // default full qty
          row.batch_no = selectedItem.batch_no;
          row.max_qty = selectedItem.qty;

          // 🔹 from backend (make sure field names match)
          row.discount_percent = selectedItem.discount_percent || 0;
          row.gst_percent = selectedItem.gst_percent || 0;

          row.amount = computeRowAmount(row);
        }
      }

      // when qty changes
      if (field === "qty" && row.max_qty != null) {
        const qtyNum = Number(value || 0);
        if (qtyNum > row.max_qty) {
          row.qty = row.max_qty;
        }
        row.amount = computeRowAmount(row);
      }

      newRows[index] = row;
      return newRows;
    });
  };

  const handleAddRow = () => setRows((prev) => [...prev, emptyRow]);

  const handleRemoveRow = (index) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  // total amount of return
  useEffect(() => {
    const total = rows.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      total_amount: total.toFixed(2),
    }));
  }, [rows]);

  const resetForm = () => {
    setFormData((prev) => ({
      ...initialData,
      store_id: prev.store_id,
      created_by: prev.created_by,
    }));
    setRows([emptyRow]);
  };

  const handleSubmit = () => {
    if (!formData.sale_id) {
      showErrorToast("Select sale");
      return;
    }
    if (!formData.store_id) {
      showErrorToast("Store not found for selected sale");
      return;
    }
    if (!rows.length || !rows.some((r) => r.item_id)) {
      showErrorToast("Add at least one item");
      return;
    }

    const payload = {
      store_id: formData.store_id,
      sale_id: formData.sale_id,
      return_date: formData.return_date,
      reason: formData.reason || null,
      total_amount: Number(formData.total_amount || 0),
      created_by: formData.created_by || currentUser?.user_id,
      items: rows
        .filter((r) => r.item_id)
        .map((r) => ({
          item_id: r.item_id,
          batch_no: r.batch_no,
          qty: Number(r.qty || 0),
          rate: Number(r.rate || 0),
          discount_percent: Number(r.discount_percent || 0),
          gst_percent: Number(r.gst_percent || 0),
          amount: Number(r.amount || 0),
        })),
    };

    addSalesReturn.mutate(payload, {
      onSuccess: () => {
        showSuccessToast("Sales return saved");
        resetForm();
        onClose?.();
      },
      onError: (err) => {
        showErrorToast(err?.message || "Failed to save sales return");
      },
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Header */}
      <Typography
        variant="subtitle1"
        fontWeight={600}
        display="flex"
        className="text-blue-700"
      >
        Sales Return Details
      </Typography>
      <Divider />

      {/* Top fields */}
      <Box display="flex" gap={2}>
        <TextField
          select
          label="Sale"
          value={formData.sale_id}
          onChange={(e) => handleSaleChange(Number(e.target.value))}
          fullWidth
          size="small"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {salesInvoices.map((s) => (
            <MenuItem key={s.sale_id} value={s.sale_id}>
              {s.sale_id} - {s.bill_no}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Store"
          value={formData.store_id}
          fullWidth
          size="small"
          disabled
        >
          {loadingStores && <MenuItem disabled>Loading stores...</MenuItem>}
          {stores.map((s) => (
            <MenuItem key={s.store_id} value={s.store_id}>
              {s.store_name}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Return Date"
            value={
              formData.return_date ? dayjs(formData.return_date) : null
            }
            onChange={(newValue) =>
              setFormData((prev) => ({
                ...prev,
                return_date: newValue ? newValue.toISOString() : null,
              }))
            }
            slotProps={{
              textField: { fullWidth: true, size: "small" },
            }}
          />
        </LocalizationProvider>
      </Box>

      {/* Reason */}
      <TextField
        label="Reason"
        value={formData.reason}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            reason: e.target.value,
          }))
        }
        fullWidth
        size="small"
        multiline
        minRows={1}
      />

      {/* Items */}
      <Box mt={2} sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            gutterBottom
            className="text-blue-700"
          >
            Sales Return Items
          </Typography>
          <Tooltip title="Add Item">
            <IconButton onClick={handleAddRow} size="small">
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider />

        <Paper variant="outlined" sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Disc %</TableCell>
                <TableCell>GST %</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell align="center">Del</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {/* Item */}
                  <TableCell>
                    <TextField
                      select
                      value={row.item_id}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "item_id",
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                      size="small"
                      disabled={!formData.sale_id || loadingSaleItems}
                    >
                      {(!formData.sale_id || loadingSaleItems) && (
                        <MenuItem disabled>
                          {loadingSaleItems
                            ? "Loading items..."
                            : "Select sale first"}
                        </MenuItem>
                      )}
                      {saleItems.map((it) => (
                        <MenuItem key={it.item_id} value={it.item_id}>
                          {it.item_name} (Sold: {it.qty})
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>

                  {/* Batch */}
                  <TableCell>
                    <TextField
                      value={row.batch_no}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>

                  {/* Qty */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.qty}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "qty",
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                      size="small"
                      inputProps={{ min: 0 }}
                      helperText={
                        row.max_qty != null ? `Max: ${row.max_qty}` : ""
                      }
                    />
                  </TableCell>

                  {/* Rate */}
                  <TableCell>
                    <TextField
                      value={row.rate}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>

                  {/* Discount % */}
                  <TableCell>
                    <TextField
                      value={row.discount_percent}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>

                  {/* GST % */}
                  <TableCell>
                    <TextField
                      value={row.gst_percent}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    <TextField
                      value={row.amount}
                      fullWidth
                      size="small"
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>

                  {/* Delete */}
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveRow(index)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Footer */}
      <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
        <Typography variant="h6">
          Total: {formData.total_amount}
        </Typography>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={addSalesReturn.isLoading}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
