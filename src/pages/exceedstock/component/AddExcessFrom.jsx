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
import { useAddExcessStock } from "@/hooks/useExcessStock";  // <-- replaced
import { usestock } from "@/hooks/useStock";
import { showErrorToast, showSuccessToast } from "@/lib/toastService";
import { useItem } from "@/hooks/useItem";

const emptyRow = {
  item_id: "",
  batch_no: "",
  qty: "",
  reason: "",
  max_qty: null,
};

export default function AddExcessStockForm({ onClose }) {
  // ------------------------------
  // 1️⃣ State
  // ------------------------------
  const [rows, setRows] = useState([emptyRow]);
  const [formData, setFormData] = useState({
    store_id: "",
    bill_date: dayjs().toISOString(),
  });

  // ------------------------------
  // 2️⃣ Hooks
  // ------------------------------

  const { data: storeResponse = {} } = useStores();
  const stores = storeResponse?.stores || [];

  const { data: currentUser } = useCurrentUser();

  const addExcessStock = useAddExcessStock(); // <-- replaced damaged hook

  // Stock for selected store
  const { data: stockResponse = {} } = usestock({ store_id: formData.store_id });
  const storeStockData = Array.isArray(stockResponse.data)
    ? stockResponse.data
    : [];

  // All Items
  const { data: itemRes = {} } = useItem();
  const allItems = Array.isArray(itemRes.data) ? itemRes.data : [];

  // ------------------------------
  // 3️⃣ Derived Data (Unique Items)
  // ------------------------------

  const storeItems = useMemo(() => {
    if (!formData.store_id) return [];

    const itemsInStore = storeStockData.filter(
      (s) => String(s.store_id) === String(formData.store_id)
    );

    const uniqueItems = [];

    itemsInStore.forEach((s) => {
      if (!uniqueItems.some((u) => String(u.item_id) === String(s.item_id))) {
        uniqueItems.push({
          item_id: s.item_id,
          name: s.item.name,
        });
      }
    });

    return uniqueItems;
  }, [storeStockData, formData.store_id]);

  // ------------------------------
  // 4️⃣ Handlers
  // ------------------------------

  const handleHeaderChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "store_id") {
      setRows([emptyRow]);
    }
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleAddRow = () => setRows((prev) => [...prev, emptyRow]);

  const handleRemoveRow = (index) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!currentUser) {
      showErrorToast("Current user not loaded yet");
      return;
    }

    const payload = {
      store_id: formData.store_id,
      entry_date: formData.bill_date,
      created_by: currentUser.user_id,
      items: rows.map((r) => ({
        item_id: r.item_id,
        batch_no: r.batch_no,
        qty: Number(r.qty),
        reason: r.reason,
      })),
    };

    addExcessStock.mutate(payload, {
      onSuccess: () => {
        showSuccessToast("Excess stock saved successfully!");

        setFormData({
          store_id: "",
          bill_date: dayjs().toISOString(),
        });
        setRows([emptyRow]);

        onClose?.();
      },
    });
  };

  // ------------------------------
  // 5️⃣ JSX
  // ------------------------------

  return (
    <Box
      gap={3}
      sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}
    >
      {/* HEADER SECTION */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} className="text-blue-700">
          Excess Stock Entry
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
            <MenuItem value="">Select Store</MenuItem>
            {stores.map((s) => (
              <MenuItem key={s.store_id} value={s.store_id}>
                {s.store_name}
              </MenuItem>
            ))}
          </TextField>

          {/* Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Entry Date"
              value={dayjs(formData.bill_date)}
              onChange={(newDate) =>
                setFormData((p) => ({ ...p, bill_date: newDate.toISOString() }))
              }
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
            />
          </LocalizationProvider>

          {/* Created By */}
          <TextField
            fullWidth
            size="small"
            label="Created By"
            value={currentUser?.username || currentUser?.user_id}
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Box>

      {/* TABLE SECTION */}
      <Box mt={2} sx={{ flex: 1, overflowY: "auto" }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600} className="text-blue-700">
            Excess Stock Items
          </Typography>

          <Tooltip title="Add Item">
            <IconButton onClick={handleAddRow}>
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        <Paper variant="outlined" sx={{ mt: 1 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell align="center">Del</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => {
                const batches = storeStockData.filter(
                  (s) => s.item_id == row.item_id && s.store_id == formData.store_id
                );

                return (
                  <TableRow key={index}>
                    {/* ITEM */}
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        fullWidth
                        value={row.item_id}
                        onChange={(e) => {
                          const item = e.target.value;
                          setRows((prev) => {
                            const updated = [...prev];
                            updated[index] = { ...emptyRow, item_id: item };
                            return updated;
                          });
                        }}
                      >
                        <MenuItem value="">Select Item</MenuItem>

                        {storeItems.map((i) => (
                          <MenuItem key={i.item_id} value={i.item_id}>
                            {i.name}-{i.item_id}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>

                    {/* BATCH */}
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        fullWidth
                        value={row.batch_no}
                        onChange={(e) => {
                          const batch_no = e.target.value;
                          const batch = batches.find((b) => b.batch_no === batch_no);

                          handleRowChange(index, "batch_no", batch_no);
                        }}
                      >
                        <MenuItem value="">Select Batch</MenuItem>

                        {batches.map((b) => (
                          <MenuItem key={b.stock_id} value={b.batch_no}>
                            {b.batch_no || "NO BATCH"}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>

                    {/* QTY */}
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        value={row.qty}
                        onChange={(e) =>
                          handleRowChange(index, "qty", Number(e.target.value))
                        }
                      />
                    </TableCell>

                    {/* REASON */}
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        value={row.reason}
                        onChange={(e) =>
                          handleRowChange(index, "reason", e.target.value)
                        }
                      />
                    </TableCell>

                    {/* DELETE */}
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        disabled={rows.length === 1}
                        onClick={() => handleRemoveRow(index)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* FOOTER SECTION */}
      <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={addExcessStock.isLoading}
          onClick={handleSubmit}
        >
          {addExcessStock.isLoading ? "Saving..." : "Save Excess Stock"}
        </Button>
      </Box>
    </Box>
  );
}
