import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UsernamesDialog = ({ open, onClose, roomId }) => {
  const username = localStorage.getItem('userEmail')

  return (
    <Dialog onClose={onClose} aria-labelledby="usernames-dialog-title" open={open}>
      <DialogTitle id="usernames-dialog-title">
        People in the Meet
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 20, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
          <Typography  gutterBottom>
            <AccountCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            {username}
          </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default UsernamesDialog;