import React, { useEffect } from "react";
import {
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import DraggableDialog from "../../../components/commen/DraggableDialog";
import { useStores } from "@/hooks/useStore";
import { useSupplier } from "@/hooks/useSupplier";
import { useUsers } from "@/hooks/useUsers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useCurrentUser } from "@/hooks/useAuth";

export default function PurchaseInvoiceForm({
  open,
  onClose,
  onSubmit,
  formData,
  onChange,
  editMode,
   // 👈 Pass current logged-in user here (from auth context or props)
}) {
  const { data: store = [], isLoading: loadingStore } = useStores();
  const { data: supplier = [], isLoading: loadingSupplier } = useSupplier();
  const { data: user = [], isLoading: loadingUser } = useUsers();
  const { data: currentUser = [], isLoading:currentuserloading } = useCurrentUser();
  console.log(currentUser,"currentUser");
  

  // 🧮 Auto-calculate net amount = total_amount + total_gst - total_discount
  useEffect(() => {
    const total = parseFloat(formData.total_amount) || 0;
    const gst = parseFloat(formData.total_gst) || 0;
    const discount = parseFloat(formData.total_discount) || 0;
    const net = total + gst - discount;

    onChange({
      target: { name: "net_amount", value: net.toFixed(2) },
    });
  }, [formData.total_amount, formData.total_gst, formData.total_discount]);

  // 👤 Auto-set created_by (login user)
 useEffect(() => {
  if (
    currentUser &&
    currentUser.user_id &&
    !formData.user_id // only set if not already set
  ) {
    onChange({
      target: { name: "user_id", value: currentUser.user_id },
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentUser?.user_id]);


  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      editMode={editMode}
      title={editMode ? "Edit Purchase Invoice" : "Add Purchase Invoice"}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Row 1 */}
        <Box display="flex" gap={2}>
          <TextField
            label="Invoice No"
            name="invoice_no"
            value={formData.invoice_no}
            onChange={onChange}
            fullWidth
            size="small"
            required
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Invoice Date"
              value={formData.invoice_date ? dayjs(formData.invoice_date) : null}
              onChange={(newValue) =>
                onChange({
                  target: {
                    name: "invoice_date",
                    value: newValue ? newValue.toISOString() : null,
                  },
                })
              }
              slotProps={{
                textField: { fullWidth: true, size: "small", required: true },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* Row 2 */}
        <Box display="flex" gap={2}>
          <TextField
            label="Total Amount"
            name="total_amount"
            value={formData.total_amount}
            onChange={onChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Total GST"
            name="total_gst"
            value={formData.total_gst}
            onChange={onChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Total Discount"
            name="total_discount"
            value={formData.total_discount}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>

        {/* Row 3 */}
        <Box display="flex" gap={2}>
          <TextField
            label="Net Amount"
            name="net_amount"
            value={formData.net_amount}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />

          <TextField
            select
            label="Store"
            name="store_id"
            value={formData.store_id || ""}
            onChange={onChange}
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

          <TextField
            select
            label="Supplier"
            name="supplier_id"
            value={formData.supplier_id || ""}
            onChange={onChange}
            fullWidth
            size="small"
          >
            {loadingSupplier ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              supplier.map((s) => (
                <MenuItem key={s.supplier_id} value={s.supplier_id}>
                  {s.supplier_name || s.supplier_id}
                </MenuItem>
              ))
            )}
          </TextField>
        </Box>

        {/* Row 4 - Created By */}
        <TextField
          label="Created By"
          value={
            currentUser
              ? currentUser.username
              : user.find((u) => u.user_id === formData.user_id)?.username || ""
          }
          fullWidth
          size="small"
          InputProps={{ readOnly: true }}
        />
      </Box>
    </DraggableDialog>
  );
}
