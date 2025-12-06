import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Box,
  Grid,
  Typography,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import { useCurrentUser } from "@/hooks/useAuth";
import { useStores } from "@/hooks/useStore";
import {
  usepurchaseinvoice,
  usePurchaseItemsByPurchaseId,
} from "@/hooks/usePurchaseInvoice";
import { useCreatePurchaseReturn } from "@/hooks/usePurchaseReturn";

const emptyItemRow = {
  item_id: "",
  batch_no: "",
  qty: "",
  rate: "",
  amount: "",
  reason: "",
  expiry_date: "",
};

export default function PurchaseReturnForm({ onClose, editMode }) {
  const [header, setHeader] = useState({
    purchase_id: "",
    store_id: "",
    return_date: "",
    reason: "",
    total_amount: 0,
  });

  const [rows, setRows] = useState([emptyItemRow]);

  // ---------------- LOAD DATA ----------------
  const { data: storeList = [] } = useStores();
  const { data: purchaseData = [] } = usepurchaseinvoice();
  const purchaseList = purchaseData?.data || [];
  const { data } = usePurchaseItemsByPurchaseId(header.purchase_id);
  const purchaseItems = data?.data || [];

  const { data: currentUser } = useCurrentUser();
  const addpurchasereturn = useCreatePurchaseReturn();

  // ---------------- HANDLE HEADER CHANGE ----------------
  const handleHeaderChange = (e) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  // ---------------- HANDLE ROW CHANGE ----------------
  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;


    if (field === "qty") {
      const maxQty = updated[index].maxQty || Infinity;
      const qty = Math.min(parseFloat(value || 0), maxQty); // cannot exceed purchased qty
      updated[index][field] = qty;
    } else {
      updated[index][field] = value;
    }


    if (field === "qty" || field === "rate") {
      const qty = parseFloat(updated[index].qty || 0);
      const rate = parseFloat(updated[index].rate || 0);

      // Assume you have purchaseItem details (discount, GST, schemeDiscount)
      const purchaseItem = purchaseItems.find(pi => pi.item_id == updated[index].item_id);
      const discountPercent = parseFloat(purchaseItem?.discount_percent || 0);
      const schemeDiscountPercent = parseFloat(purchaseItem?.scheme_discount_percent || 0);
      const gstPercent = parseFloat(purchaseItem?.gst_percent || 0);

      // Apply discount and scheme discount
      const priceAfterDiscount = rate * (1 - discountPercent / 100) * (1 - schemeDiscountPercent / 100);

      // Add GST
      const priceWithGST = priceAfterDiscount * (1 + gstPercent / 100);

      updated[index].amount = (qty * priceWithGST).toFixed(2);
    }


    setRows(updated);
  };

  const handleAddRow = () => setRows([...rows, { ...emptyItemRow }]);
  const handleRemoveRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  // ---------------- AUTO TOTAL ----------------
  useEffect(() => {
    const total = rows.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
    setHeader((prev) => ({ ...prev, total_amount: total.toFixed(2) }));
  }, [rows]);

  // ---------------- AUTO-FILL STORE ----------------
  useEffect(() => {
    if (!header.purchase_id) return;

    const selectedPurchase = purchaseList.find(
      (p) => p.purchase_id == header.purchase_id
    );

    if (selectedPurchase) {
      setHeader((prev) => ({
        ...prev,
        store_id: selectedPurchase.store_id,
      }));
    }
  }, [header.purchase_id, purchaseList]);

  // ---------------- GET ITEM NAME ----------------
  const getItemName = (item_id) => {
    const found = purchaseItems.find((pi) => pi.item_id == item_id);
    return found?.item?.name || "Unknown Item";
  };

  // ---------------- RESET FORM ----------------
  const resetForm = () => {
    setHeader({
      purchase_id: "",
      store_id: "",
      return_date: "",
      reason: "",
      total_amount: 0,
    });
    setRows([emptyItemRow]);
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = () => {
    try {
      const payload = {
        purchase_id: header.purchase_id,
        store_id: header.store_id,
        created_by: currentUser?.user_id,
        return_date: header.return_date,
        reason: header.reason,
        items: rows.map((r) => ({
          item_id: r.item_id,
          batch_no: r.batch_no,
          qty: Number(r.qty),
          rate: Number(r.rate),
          item_reason: r.reason,
          expiry_date: r.expiry_date,
        })),
      };

      addpurchasereturn.mutate(payload, {
        onSuccess: () => {
          alert("Purchase return items updated successfully");
          resetForm();
          onClose?.();
        },
        onError: () => {
          alert("Purchase return not created");
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <Box gap={3} sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" fontWeight={600}>
        Purchase Return
      </Typography>
      <Divider />

      {/* HEADER */}
      <Box display="flex" gap={2}>
        <TextField
          select
          label="Purchase ID"
          name="purchase_id"
          value={header.purchase_id}
          onChange={handleHeaderChange}
          fullWidth
          size="small"
        >
          {purchaseList?.map((p) => (
            <MenuItem key={p.purchase_id} value={p.purchase_id}>
              {p.purchase_id} — {p.invoice_no}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Store"
          name="store_id"
          value={header.store_id}
          onChange={handleHeaderChange}
          fullWidth
          size="small"
        >
          {storeList?.stores?.map((store) => (
            <MenuItem key={store.store_id} value={store.store_id}>
              {store.store_name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          label="Return Date"
          name="return_date"
          value={header.return_date}
          onChange={handleHeaderChange}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <TextField
        label="Overall Reason"
        name="reason"
        fullWidth
        multiline
        minRows={2}
        value={header.reason}
        onChange={handleHeaderChange}
        size="small"
      />

      {/* ITEMS TABLE */}
      <Box mt={3}>
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight={600}>Return Items</Typography>
          <IconButton onClick={handleAddRow}>
            <AddCircleOutline />
          </IconButton>
        </Box>
        <Divider />
        <Paper sx={{ mt: 1, maxHeight: 350, overflow: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={row.item_id}
                      onChange={(e) => {
                        const itemId = e.target.value;
                        handleRowChange(index, "item_id", itemId);

                        const purchaseItem = purchaseItems.find(
                          (pi) => pi.item_id == itemId
                        );

                        if (purchaseItem) {
                          const updated = [...rows];
                          updated[index] = {
                            ...updated[index],
                            batch_no: purchaseItem.batch_no || "",
                            rate: purchaseItem.purchase_rate || "",
                            expiry_date: purchaseItem.expiry_date || "",
                            maxQty: purchaseItem.qty,
                          };
                          setRows(updated);
                        }
                      }}
                    >
                      {purchaseItems.map((pi) => (
                        <MenuItem
                          key={pi.purchase_item_id}
                          value={pi.item_id}
                        >
                          {pi.item?.name || "Unknown Item"}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.batch_no}
                      onChange={(e) =>
                        handleRowChange(index, "batch_no", e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="text"
                      size="small"
                      fullWidth
                      value={row.qty}
                      onChange={(e) =>
                        handleRowChange(index, "qty", e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={row.rate}
                      onChange={(e) =>
                        handleRowChange(index, "rate", e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField size="small" fullWidth value={row.amount} />
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="date"
                      size="small"
                      fullWidth
                      value={row.expiry_date}
                      onChange={(e) =>
                        handleRowChange(index, "expiry_date", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton
                      onClick={() => handleRemoveRow(index)}
                      disabled={rows.length === 1}
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

      {/* TOTAL */}
      <Box mt={2}>
        <Grid container justifyContent="flex-end">
          <Grid item xs={4}>
            <TextField
              label="Total Amount"
              fullWidth
              value={header.total_amount}
              size="small"
            />
          </Grid>
        </Grid>
      </Box>

      {/* FOOTER */}
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit Return
        </Button>
      </Box>
    </Box>
  );
}
