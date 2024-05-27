import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import retrospectService from '../Service/RetrospectService';

const UsernamesDialog = ({ open, onClose, roomId }) => {
  const [userEmails, setUserEmails] = useState([]);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await retrospectService.getUsernamesInRoom(roomId);
        setUserEmails(response.data.map(user => user.userEmail));
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    if (open) {
      fetchUsernames();
    }
  }, [open, roomId]);

  return (
    <Dialog onClose={onClose} aria-labelledby="usernames-dialog-title" open={open}>
      <DialogTitle id="usernames-dialog-title">
        People in the Meet
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 20, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          {/* Add Close Icon */}
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {userEmails.map((userEmail, index) => (
          <Typography key={index} gutterBottom>
            <AccountCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            {userEmail}
          </Typography>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default UsernamesDialog;