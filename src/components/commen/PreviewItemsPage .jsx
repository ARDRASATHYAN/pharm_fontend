// src/pages/purchase/Preview.jsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { usePurchaseStore } from "@/store/purchaseStore";
import { createPurchase } from "@/services/purchaseApi";


export default function Preview() {
  const navigate = useNavigate();

  const invoice = usePurchaseStore((s) => s.invoice);
  const items = usePurchaseStore((s) => s.items);
  const clearAll = usePurchaseStore((s) => s.clearAll);

  // totals
  const totals = useMemo(() => {
    const totalAmount = items.reduce((a, it) => a + (Number(it.qty || 0) * Number(it.purchase_rate || 0)), 0);
    const totalDiscount = items.reduce(
      (a, it) => a + ((Number(it.qty || 0) * Number(it.purchase_rate || 0)) * (Number(it.discount_percent || 0) / 100)),
      0
    );
    const totalGst = items.reduce((a, it) => {
      const base = Number(it.qty || 0) * Number(it.purchase_rate || 0);
      const discountAmt = (base * (Number(it.discount_percent || 0) / 100));
      const taxable = base - discountAmt;
      return a + (taxable * (Number(it.gst_percent || 0) / 100));
    }, 0);
    const netAmount = totalAmount - totalDiscount + totalGst;
    return {
      totalAmount: +totalAmount.toFixed(2),
      totalDiscount: +totalDiscount.toFixed(2),
      totalGst: +totalGst.toFixed(2),
      netAmount: +netAmount.toFixed(2),
    };
  }, [items]);

  const mutation = useMutation({
    mutationFn: (payload) => createPurchase(payload),
    onSuccess: (data) => {
      // success: clear local store and navigate to add page (or success page)
      clearAll();
      alert(`Saved purchase id: ${data.purchase_id || data.purchaseId || "unknown"}`);
      navigate("/");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to submit purchase. Check console.");
    },
  });

  const handleSubmit = () => {
    if (!invoice.invoice_no) {
      alert("Invoice no missing");
      return;
    }
    if (!items.length) {
      alert("No items");
      return;
    }

    const payload = {
      invoice: {
        ...invoice,
      },
      items: items.map((it) => ({
        item_id: it.item_id,
        batch_no: it.batch_no,
        expiry_date: it.expiry_date,
        pack_qty: it.pack_qty,
        qty: it.qty,
        purchase_rate: it.purchase_rate,
        mrp: it.mrp,
        gst_percent: it.gst_percent,
        discount_percent: it.discount_percent,
        total_amount: it.total_amount,
      })),
    };

    mutation.mutate(payload);
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Purchase Invoice Preview</Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Invoice Details</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography><strong>Invoice No:</strong> {invoice.invoice_no}</Typography>
        <Typography><strong>Date:</strong> {invoice.invoice_date}</Typography>
        <Typography><strong>Store:</strong> {invoice.store_id}</Typography>
        <Typography><strong>Supplier:</strong> {invoice.supplier_id}</Typography>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Items</Typography>

        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">GST%</TableCell>
              <TableCell align="right">Disc%</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((i, idx) => (
              <TableRow key={idx}>
                <TableCell>{i.item_id}</TableCell>
                <TableCell>{i.batch_no}</TableCell>
                <TableCell>{i.expiry_date}</TableCell>
                <TableCell align="right">{i.qty}</TableCell>
                <TableCell align="right">₹ {Number(i.purchase_rate).toFixed(2)}</TableCell>
                <TableCell align="right">{i.gst_percent}%</TableCell>
                <TableCell align="right">{i.discount_percent}%</TableCell>
                <TableCell align="right">₹ {Number(i.total_amount).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography><strong>Total Amount:</strong> ₹{totals.totalAmount.toFixed(2)}</Typography>
        <Typography><strong>Total Discount:</strong> ₹{totals.totalDiscount.toFixed(2)}</Typography>
        <Typography><strong>Total GST:</strong> ₹{totals.totalGst.toFixed(2)}</Typography>

        <Typography variant="h6" mt={2}>
          <strong>Net Amount:</strong> ₹{totals.netAmount.toFixed(2)}
        </Typography>
      </Paper>

      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleSubmit}
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Saving..." : "Submit Invoice"}
      </Button>
    </Box>
  );
}
