import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RetrospectService from '../Service/RetrospectService';

export default function ResetPasswordDialog({ open, onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserEmail(token);
    }
  }, []);

  const getUserEmail = async (token) => {
    try {
      const response = await RetrospectService.getUserByToken(token);
      setUserEmail(response.data.userEmail);
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordMismatch(true);
      return;
    }

    try {
      const resetPasswordData = {
        userEmail: userEmail,
        oldPassword: oldPassword,
        newPassword: newPassword
      };
      await RetrospectService.resetPassword(resetPasswordData);
      alert("Password reset successfully.");
      onClose();
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          value={userEmail}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          label="Old Password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          fullWidth
          error={passwordMismatch}
          helperText={passwordMismatch && "Passwords don't match"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleResetPassword} variant="contained" color="primary">
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}
