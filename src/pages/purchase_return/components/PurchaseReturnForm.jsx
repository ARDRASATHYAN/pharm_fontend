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
  useInfinitepurchaseinvoice,
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
const {
  data: purchaseData,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfinitepurchaseinvoice();


const purchaseList = purchaseData?.pages
  ? purchaseData.pages.flatMap(p => p.data)
  : [];


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
  setRows((prev) => {
    const updated = [...prev];
    const row = { ...updated[index] };

    // ✅ allow free typing (keep qty as string)
    row[field] = value;

    // calculate amount only when qty or rate changes
    if (field === "qty" || field === "rate") {
      const qty = Number(row.qty);
      const rate = Number(row.rate);

      if (!isNaN(qty) && !isNaN(rate)) {
        const purchaseItem = purchaseItems.find(
          (pi) => pi.item_id == row.item_id
        );

        const discount = Number(purchaseItem?.discount_percent || 0);
        const scheme = Number(purchaseItem?.scheme_discount_percent || 0);
        const gst = Number(purchaseItem?.gst_percent || 0);

        const priceAfterDiscount =
          rate * (1 - discount / 100) * (1 - scheme / 100);

        const priceWithGST =
          priceAfterDiscount * (1 + gst / 100);

        row.amount = (qty * priceWithGST).toFixed(2);
      }
    }

    updated[index] = row;
    return updated;
  });
};
const handleQtyBlur = (index) => {
  setRows((prev) => {
    const updated = [...prev];
    const row = { ...updated[index] };

    const maxQty = row.maxQty || Infinity;
    const qty = Number(row.qty || 0);

    // ✅ clamp AFTER typing finished
    row.qty = Math.min(qty, maxQty);

    updated[index] = row;
    return updated;
  });
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
          pack_size: Number(r.pack_size),
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
  SelectProps={{
    MenuProps: {
      PaperProps: {
        sx: { maxHeight: 250 },
        onScroll: (e) => {
          const list = e.currentTarget;

          const isBottom =
            list.scrollHeight - list.scrollTop <=
            list.clientHeight + 10;

          if (isBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage(); // 🔥 LOAD NEXT 5
          }
        },
      },
    },
  }}
>
  {purchaseList.map((p) => (
    <MenuItem
      key={p.purchase_id}
      value={p.purchase_id}
      sx={{ height: 36 }}
    >
      {p.purchase_id} — {p.invoice_no}
    </MenuItem>
  ))}

  {isFetchingNextPage && (
    <MenuItem disabled>Loading more...</MenuItem>
  )}
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
                <TableCell>qty(unit)</TableCell>
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

    setRows((prev) => {
      const updated = [...prev];
      const purchaseItem = purchaseItems.find(
        (pi) => pi.item_id == itemId
      );
      const packSize = Number(purchaseItem?.item?.pack_size || 1);

      updated[index] = {
        ...updated[index],
        item_id: itemId,                       // ✅ KEEP item_id
        batch_no: purchaseItem?.batch_no || "",
        rate: purchaseItem?.purchase_rate || "",
        expiry_date: purchaseItem?.expiry_date || "",
        maxQty: purchaseItem?.qty || Infinity,
        pack_size: packSize,    
        qty: "",                               // optional reset
        amount: "",
      };

      return updated;
    });
  }}
>
  {purchaseItems.map((pi) => (
    <MenuItem key={pi.purchase_item_id} value={pi.item_id}>
      {pi.item?.name}
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
  {row.qty && row.pack_size
    ? row.qty * row.pack_size
    : 0} units
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
  onBlur={() => handleQtyBlur(index)}   // ✅ ADD THIS
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
