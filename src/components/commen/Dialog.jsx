import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function CustomizedDialogs({ open, handleClose ,children}) {
  return (
    <BootstrapDialog
  onClose={handleClose}
  aria-labelledby="customized-dialog-title"
  open={open}
  fullWidth
  maxWidth="lg"  // can be 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
>

      {/* <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Add Medicine
      </DialogTitle> */}
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
       {children}
      </DialogContent>
      {/* <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Save changes
        </Button>
      </DialogActions> */}
    </BootstrapDialog>
  );
}
