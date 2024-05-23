import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RetroSpectService from '../Service/RetrospectService';
import { Link } from 'react-router-dom';
import Header from './LoginHeader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  const handleGetOTP = async () => {
    try {
      if (!email) {
        console.error('Email is required.');
        return;
      }
      console.log('Sending email to backend:', email); // Print the email being sent
      // Make API call to send email to backend
      const response = await RetroSpectService.forgetPassword({
        userEmail: email
      });
      console.log('Response from backend:', response.data); // Print the response from the backend
      setOtpMessage(`OTP sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  
  
  

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = async () => {
    try {
      // Make API call to change password
      const response = await RetroSpectService.changePassword({
        userEmail: email,
        userOtp: otp,
        userNewPassword: newPassword
      });
      console.log(response.data); // Handle response accordingly
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div sx={{ display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box
        height={400}
        width={400}
        marginLeft="auto"
        marginRight="auto"
        marginTop={5}
        display="flex"
        flexDirection="column"
        borderRadius={2}
        borderColor={'grey'}
        p={2}
        sx={{ backgroundColor: 'white', border: '1px solid grey', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h6" gutterBottom textAlign="center" marginBottom={6} marginLeft={2}>
          Forgot Password
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField label="Email" variant="outlined" style={{ marginRight: '10px', marginLeft: '10px' }} onChange={handleEmailChange} />
          <Button variant="contained" color="primary" onClick={handleGetOTP}>Get OTP</Button>
        </div>
        {otpMessage && <Typography variant="body1" color="primary" textAlign="center">{otpMessage}</Typography>}
        <TextField label="OTP" variant="outlined" style={{ marginTop: '10px', marginLeft: '10px' }} onChange={(event) => setOTP(event.target.value)} />
        <TextField label="New Password" variant="outlined" style={{ marginTop: '10px', marginLeft: '10px' }} onChange={(event) => setNewPassword(event.target.value)} />
        <Button variant="contained" color="primary" style={{ marginLeft: '10px', marginRight: '10px', marginTop: '10px' }} onClick={handleChangePassword}>Change Password</Button>
        <Link to='/'>
          <Button variant='contained' color='error' style={{ marginLeft: '10px', marginTop: '30px', marginRight: '243px' }}>Back To Login</Button>
        </Link>
      </Box>
    </div>
  );
};

export default ForgotPassword;
