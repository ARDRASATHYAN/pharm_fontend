// src/components/ItemTable.jsx
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { usePurchaseStore } from "@/store/purchaseStore";
import { useState } from "react";

export default function ItemTable() {
  const addItem = usePurchaseStore((state) => state.addItem);
  const removeItem = usePurchaseStore((state) => state.removeItem);
  const items = usePurchaseStore((state) => state.items);

  const [form, setForm] = useState({
    item_id: "",
    qty: "",
    rate: "",
    gst_percent: "",
  });

  const handleAdd = () => {
    const total =
      Number(form.qty) * Number(form.rate) +
      (Number(form.gst_percent) / 100) * Number(form.qty) * Number(form.rate);

    addItem({ ...form, total_amount: total });

    setForm({ item_id: "", qty: "", rate: "", gst_percent: "" });
  };

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6">Add Items</Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={3}>
          <TextField
            label="Item ID"
            fullWidth
            value={form.item_id}
            onChange={(e) => setForm({ ...form, item_id: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            label="Qty"
            fullWidth
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            label="Rate"
            fullWidth
            value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            label="GST %"
            fullWidth
            value={form.gst_percent}
            onChange={(e) =>
              setForm({ ...form, gst_percent: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleAdd}>
            Add Item
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Item List
      </Typography>

      {items.map((x, i) => (
        <Paper key={i} sx={{ p: 2, mt: 1, bgcolor: "#e9f5ff" }}>
          <b>{x.item_id}</b> — Qty: {x.qty} — Rate: {x.rate} — Total:
          {x.total_amount}

          <Button
            color="error"
            sx={{ ml: 3 }}
            onClick={() => removeItem(i)}
          >
            Delete
          </Button>
        </Paper>
      ))}
    </Paper>
  );
}
