import React, { useEffect, useMemo, useState } from "react";
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
import { useAddDamagedStock } from "@/hooks/useDamagedStock";
import { usestock } from "@/hooks/useStock";
import { showSuccessToast } from "@/lib/toastService";
import { useItem } from "@/hooks/useItem";

const emptyRow = { item_id: "", batch_no: "", qty: "", reason: "", max_qty: null };

const initialFormState = {
  store_id: "",
  bill_date: dayjs().toISOString(),
};

export default function AddDamagedStockForm({ onClose }) {
  const { data: store = [], isLoading: loadingStore } = useStores();
  const { data: itemsMaster = [], isLoading: loadingItems } = useItem();
  const { data: currentUserResponse } = useCurrentUser();
  const { data: stock = [] } = usestock?.() || { data: [] };

  const addDamagedStock = useAddDamagedStock();

  const currentUser = Array.isArray(currentUserResponse)
    ? currentUserResponse[0]
    : currentUserResponse || null;

  const [formData, setFormData] = useState(initialFormState);
  const [rows, setRows] = useState([emptyRow]);

  // Filter stock based on selected store
  const storeStock = useMemo(() => {
    if (!formData.store_id) return [];
    return (stock || []).filter(
      (s) => String(s.store_id) === String(formData.store_id)
    );
  }, [stock, formData.store_id]);

  // Items available in this store (based on stock)
  const storeItems = useMemo(() => {
    const itemMap = new Map();
    storeStock.forEach((s) => {
      if (!itemMap.has(s.item_id)) {
        const item = itemsMaster.find((it) => it.item_id === s.item_id);
        itemMap.set(s.item_id, {
          item_id: s.item_id,
          item_name: item?.name || item?.item_name || `Item #${s.item_id}`,
        });
      }
    });
    return Array.from(itemMap.values());
  }, [storeStock, itemsMaster]);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If store changed, reset rows because stock list changes
    if (name === "store_id") {
      setRows([emptyRow]);
    }
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, emptyRow]);
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const newRows = [...prev];
      newRows[index] = {
        ...newRows[index],
        [field]: value,
      };
      return newRows;
    });
  };

  // 🔹 Reset form after success
  const resetForm = () => {
    setFormData((prev) => ({
      ...initialFormState,
      // if you want to keep same store after save, uncomment:
      // store_id: prev.store_id,
    }));
    setRows([emptyRow]);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.store_id) {
        alert("Please select a store");
        return;
      }

      if (!currentUser?.user_id) {
        alert("User not found");
        return;
      }

      const items = rows
        .filter((r) => r.item_id && r.batch_no && r.qty)
        .map((r) => ({
          item_id: Number(r.item_id),
          batch_no: r.batch_no,
          qty: Number(r.qty),
          reason: r.reason || "",
        }));

      if (!items.length) {
        alert("Please add at least one damaged item");
        return;
      }

      await addDamagedStock.mutateAsync({
        store_id: Number(formData.store_id),
        entry_date: formData.bill_date,
        created_by: currentUser.user_id,
        items,
      });

     showSuccessToast("successfully created")
      resetForm();          // 🔸 clear form and rows
      onClose && onClose(); // 🔸 close dialog if provided
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Error saving damaged stock entry";
      alert(msg);
    }
  };

  return (
    <Box
      gap={3}
      sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}
    >
      {/* Header */}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          display="flex"
          className="text-blue-700"
        >
          Damaged Stock Details
        </Typography>
        <Divider />
        <Box display="flex" gap={3} mt={1}>
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

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Entry Date"
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
            Damaged Items
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
                  <TableCell sx={{ minWidth: 140 }}>Reason</TableCell>
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
                              newRows[index] = {
                                ...newRows[index],
                                item_id: value,
                                batch_no: "",
                                qty: "",
                                reason: "",
                                max_qty: null,
                              };
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
                                {it.item_name || it.name || `Item #${it.item_id}`}
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
                              const newRow = { ...newRows[index] };
                              newRow.batch_no = batchValue;

                              if (selectedStock) {
                                newRow.max_qty = Number(
                                  selectedStock.qty_in_stock || 0
                                );
                              }

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
                          onChange={(e) => {
                            const val = e.target.value;
                            setRows((prev) => {
                              const newRows = [...prev];
                              let newRow = { ...newRows[index], qty: val };

                              if (newRow.max_qty != null) {
                                const num = Number(val || 0);
                                if (num > newRow.max_qty) {
                                  newRow.qty = String(newRow.max_qty);
                                }
                              }

                              newRows[index] = newRow;
                              return newRows;
                            });
                          }}
                          fullWidth
                          size="small"
                          inputProps={{ min: 0, step: "1" }}
                          helperText={
                            row.max_qty != null ? `Max: ${row.max_qty}` : ""
                          }
                        />
                      </TableCell>

                      {/* Reason */}
                      <TableCell padding="none" sx={{ p: 0.25 }}>
                        <TextField
                          name="reason"
                          value={row.reason}
                          onChange={(e) =>
                            handleRowChange(index, "reason", e.target.value)
                          }
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
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

      {/* Footer */}
      <Box mt={2}>
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          {onClose && (
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={addDamagedStock.isLoading}
          >
            {addDamagedStock.isLoading ? "Saving..." : "Save Damaged Stock"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
