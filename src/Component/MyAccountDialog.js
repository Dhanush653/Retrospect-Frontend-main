import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import RetrospectService from '../Service/RetrospectService';

export default function MyAccountDialog({ open, onClose }) {
  const [userDetails, setUserDetails] = useState(null);
  const [updatedUserDetails, setUpdatedUserDetails] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      getUserDetails(token);
    }
  }, []);

  const getUserDetails = async (token) => {
    try {
      const response = await RetrospectService.getUserByToken(token);
      setUserDetails(response.data);
      setUpdatedUserDetails({ ...response.data });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUserDetails({ ...updatedUserDetails, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await RetrospectService.updateUser(userDetails.userId, updatedUserDetails);
      console.log("Update response:", response);
      if (response.status === 200) {
        alert("User details updated successfully");
      } else {
        alert("Failed to update user details");
      }
      onClose();
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update user details");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>User ID:</Typography>
            <TextField
              value={userDetails && userDetails.userId}
              fullWidth
              disabled
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>User Name:</Typography>
            <TextField
              name="userName"
              value={updatedUserDetails && updatedUserDetails.userName}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>User Email:</Typography>
            <TextField
              name="userEmail"
              value={updatedUserDetails && updatedUserDetails.userEmail}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>User Role:</Typography>
            <TextField
              value={userDetails && userDetails.userRole}
              fullWidth
              disabled
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
