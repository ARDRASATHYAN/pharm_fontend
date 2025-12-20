import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
} from "@mui/material";
import apiClient from "@/services/apiClient";
import { useStores } from "@/hooks/useStore";

const SalesReturn = () => {
  const { data, isLoading } = useStores();
const stores = Array.isArray(data) ? data : data?.stores || [];

  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);

  const [storeId, setStoreId] = useState("");
  const [saleId, setSaleId] = useState("");
  const [reason, setReason] = useState("");

  const [totals, setTotals] = useState({
    amount: 0,
    gst: 0,
    net: 0,
  });

  /* ---------------- LOAD SALES ---------------- */
useEffect(() => {
  if (!storeId) return;

  apiClient.get(`/sales?store_id=${storeId}`).then(res => {
    const salesArray = Array.isArray(res.data?.data) ? res.data.data : [];
    setSales(salesArray);
  });
}, [storeId]);


  /* ---------------- LOAD SALE ITEMS ---------------- */
useEffect(() => {
  if (!saleId) return;

  apiClient
    .get(`/sales/saleid-item`, { params: { sale_id: saleId } })
    .then(res => {
      const prepared = Array.isArray(res.data?.data) ? res.data.data : [];
      const mapped = prepared.map(item => ({
        ...item,
        return_qty: "",
        amount: 0,
        gstAmount: 0,
        qty: Number(item.qty),
        rate: Number(item.rate),
        gst_percent: Number(item.gst_percent)
      }));
      setItems(mapped);
    });
}, [saleId]);


  /* ---------------- HANDLE QTY CHANGE ---------------- */
  const handleQtyChange = (index, qty) => {
    const updated = [...items];
    const item = updated[index];

    const returnQty = Math.min(qty, item.qty);
    const amount = returnQty * item.rate;
    const gstAmount = (amount * item.gst_percent) / 100;

    item.return_qty = returnQty;
    item.amount = amount;
    item.gstAmount = gstAmount;

    setItems(updated);
    calculateTotals(updated);
  };

  /* ---------------- TOTAL CALC ---------------- */
  const calculateTotals = (data) => {
    const amount = data.reduce((a, i) => a + i.amount, 0);
    const gst = data.reduce((a, i) => a + i.gstAmount, 0);

    setTotals({
      amount,
      gst,
      net: amount + gst,
    });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!storeId || !saleId) {
      alert("Select store and sale");
      return;
    }

    const returnItems = items.filter(i => i.return_qty > 0);
    if (!returnItems.length) {
      alert("Enter return quantity");
      return;
    }

    const payload = {
      store_id: storeId,
      sale_id: saleId,
      return_date: new Date(),
      reason,
      items: returnItems.map(i => ({
        item_id: i.item_id,
        batch_no: i.batch_no,
        qty: i.return_qty,
        rate: i.rate,
        gst_percent: i.gst_percent,
      })),
    };

    await apiClient.post("/sales-return", payload);
    alert("Sales Return Created");
  };

  return (
    <Box p={3}>
      <Typography variant="h6">Sales Return</Typography>

      <Grid container spacing={2} mt={1}>
        <Grid item xs={3}>
          <TextField
            select
            fullWidth
            label="Store"
            value={storeId}
            onChange={e => setStoreId(e.target.value)}
            disabled={isLoading}
          >
            {stores.map(store => (
              <MenuItem key={store.store_id} value={store.store_id}>
                {store.store_name}
              </MenuItem>
            ))}

          </TextField>
        </Grid>

        <Grid item xs={3}>
          <TextField
  select
  fullWidth
  label="Sale Invoice"
  value={saleId}
  onChange={e => setSaleId(e.target.value)}
>
  {sales.map(s => (
    <MenuItem key={s.sale_id} value={s.sale_id}>
      {s.bill_no} - {s.customer?.customer_name || ""}
    </MenuItem>
  ))}
</TextField>

        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Sold Qty</TableCell>
              <TableCell>Return Qty</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>GST%</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.item.name}</TableCell>
                <TableCell>{row.batch_no}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    size="small"
                    value={row.return_qty}
                    onChange={e =>
                      handleQtyChange(i, Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>{row.rate}</TableCell>
                <TableCell>{row.gst_percent}%</TableCell>
                <TableCell>{row.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box mt={2} textAlign="right">
        <Typography>Total Amount: {totals.amount.toFixed(2)}</Typography>
        <Typography>Total GST: {totals.gst.toFixed(2)}</Typography>
        <Typography fontWeight="bold">
          Net Amount: {totals.net.toFixed(2)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="error"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Submit Sales Return
      </Button>
    </Box>
  );
};

export default SalesReturn;
