import React, { useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

/**
 * A reusable draggable dialog that:
 * - Is movable by dragging the title bar
 * - Closes only when Cancel is clicked (not on backdrop or ESC)
 */
export default function DraggableDialog({
  open,
  title,
  children,
  onClose,
  onSubmit,
  editMode = false,
  width = "sm",
}) {
  const dialogRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    const dialog = dialogRef.current;
    if (dialog) {
      setDragging(true);
      const rect = dialog.getBoundingClientRect();
      setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      fullWidth
      maxWidth={width}
      PaperProps={{
        ref: dialogRef,
        sx: {
          position: "absolute",
          top: position.y,
          left: position.x,
          transition: dragging ? "none" : "transform 0.1s ease",
          cursor: dragging ? "grabbing" : "default",
        },
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <DialogTitle
        onMouseDown={handleMouseDown}
        sx={{
          cursor: "grab",
          backgroundColor: "#f3f4f6",
          fontWeight: 600,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1e40af" },
            borderRadius: 2,
          }}
        >
          {editMode ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
