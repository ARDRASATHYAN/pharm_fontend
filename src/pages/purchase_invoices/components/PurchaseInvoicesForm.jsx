import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import DraggableDialog from "../../../components/commen/DraggableDialog";
import { useHsn } from "@/hooks/useHsn";
import { useDrugSchedule } from "@/hooks/useDrugSchedule";
import { Controller, useForm } from "react-hook-form";



export default function PurchaseInvoiceForm({
  open,
  onClose,
  onSubmit,
  formData,
  onChange,
  editMode,
}) {


  const { data: hsns = [], isLoading: loadingHsn } = useHsn();
  const { data: drugschedule = [], isLoading: loadingSchedule } = useDrugSchedule();

  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      editMode={editMode}
      title={editMode ? "Edit Item" : "Add New Item"}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
         
          <TextField
            label="invoice_no"
            name="invoice_no"
            value={formData.invoice_no}
            onChange={onChange}
            type="text"
            fullWidth
            size="small"
            required
          />
           <TextField
            label="invoice_date "
            name="invoice_date "
            value={formData.invoice_date }
            onChange={onChange}
            fullWidth
            type="date"
            size="small"
            required
          />
          <TextField
            label="total_amount"
            name="total_amount"
            value={formData.total_amount}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
      
        <Box display="flex" gap={2}>
           <TextField
          label="total_gst "
          name="total_gst "
          value={formData.total_gst }
          onChange={onChange}
          type="text"
          fullWidth
          size="small"
          required
        />
          <TextField
            label="total_discount"
            name="total_discount"
            value={formData.total_discount}
            onChange={onChange}
            fullWidth
            size="small"
          />
          <TextField
            label="net_amount "
            name="net_amount "
            value={formData.net_amount }
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
       
         
         
 <Box display="flex" gap={2}>
  
          <TextField
            select
            label="store_id"
            name="store_id"
            value={formData.store_id || ""}
            onChange={onChange}
            fullWidth
            disabled={editMode}
            size="small"
          >
            {loadingHsn ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              hsns.map((hsn) => (
                <MenuItem key={hsn.hsn_id} value={hsn.hsn_id}>
                  {hsn.hsn_code} — {hsn.description}
                </MenuItem>
              ))
            )}
          </TextField>

          <TextField
            select
            label="supplier_id"
            name="supplier_id"
            value={formData.supplier_id || ""}
            onChange={onChange}
            fullWidth
            disabled={editMode}
            size="small"
          >
            {loadingSchedule ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              drugschedule.map((s) => (
                <MenuItem key={s.schedule_id} value={s.schedule_id}>
                  {s.schedule_code}
                </MenuItem>
              ))
            )}
          </TextField>

          <TextField
            select
            label="created_by"
            name="user_id"
            value={formData.user_id || ""}
            onChange={onChange}
            fullWidth
            disabled={editMode}
            size="small"
          >
            {loadingSchedule ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              drugschedule.map((s) => (
                <MenuItem key={s.schedule_id} value={s.schedule_id}>
                  {s.schedule_code}
                </MenuItem>
              ))
            )}
          </TextField>
        </Box>
       
       
       




      </Box>
    </DraggableDialog>

  );
}
