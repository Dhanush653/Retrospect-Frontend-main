import React, { useState } from 'react';
import Header from './LoginHeader';
import Box from '@mui/material/Box';
import { Typography, RadioGroup, FormControlLabel, Radio, TextField, Button, Link as MuiLink, IconButton, InputAdornment } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RetrospectService from '../Service/RetrospectService';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Registration = () => {
  const [formValue, setformValue] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRoleChange = (event) => {
    setformValue({ ...formValue, role: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (formValue.password !== formValue.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    const formData = {
      userName: formValue.name,
      userEmail: formValue.email,
      userPassword: formValue.password,
      userRole: formValue.role,
    };

    RetrospectService.register(formData)
      .then((response) => {
        console.log('response from backend', response.data);
        if (response.data === 'You have been signed up successfully') {
          window.alert('Registered Successfully');
          window.location.href = '/'; 
        }
      })
      .catch((error) => {
        console.error('Error sending the data', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setformValue({ ...formValue, [name]: value });
    if (name === 'confirmPassword') {
      setPasswordMatch(formValue.password === value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Box
          backgroundColor="#f2f2f2"
          height={600}
          width={550}
          marginTop="2%"
          marginBottom="2%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={2}
          borderRadius={1}
          sx={{ 
            fontFamily: 'Arial, sans-serif',
            borderRadius:'0%',
            color: '#E066FF',
            background:'linear-gradient(109.6deg, rgb(20, 30, 48) 11.2%, rgb(36, 59, 85) 91.1%)'
           }}
        >
          <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
            SIGN UP
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="subtitle1" color='white'>Name</Typography>
            <TextField
              name="name"
              value={formValue.name}
              onChange={handleChange}
              variant="outlined"
              size="larger"
              placeholder="Enter your name..."
              sx={{ marginBottom: '20px', '& input': { padding:'5px 10px' }, backgroundColor: 'white', borderRadius:'5px', width:'110%' }}
            />
            <Typography variant="subtitle1" color='white'>Email</Typography>
            <TextField
              name="email"
              value={formValue.email}
              onChange={handleChange}
              variant="outlined"
              size="small"
              placeholder="Enter your email..."
              sx={{ marginBottom: '20px', '& input': { padding: '5px 10px' }, backgroundColor: 'white' , borderRadius:'5px', width:'110%'  }}
            />
            <Typography variant="subtitle1" color='white'>Password</Typography>
            <TextField
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formValue.password}
              onChange={handleChange}
              variant="outlined"
              size="small"
              placeholder="Enter your password..."
              sx={{ marginBottom: '20px', '& input': { padding: '5px 10px' }, backgroundColor: 'white', borderRadius:'5px', width:'110%'  }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Typography variant="subtitle1" color='white'>Confirm Password</Typography>
            <TextField
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formValue.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              size="small"
              placeholder="Confirm your password..."
              sx={{ marginBottom: '20px', '& input': { padding: '5px 10px' }, backgroundColor: 'white', borderRadius:'5px' , width:'110%' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {!passwordMatch && (
              <Typography variant="body2" color="error" gutterBottom>
                Passwords do not match
              </Typography>
            )}
            <Typography variant="subtitle1" color='white'>Role</Typography>
            <RadioGroup value={formValue.role} onChange={handleRoleChange} sx={{ marginBottom: '20px' }}>
              <FormControlLabel
              value="admin"
              control={<Radio sx={{ color: 'white' }}/>}
              label={<Typography style={{ color: 'white' }}>Admin</Typography>}
              />
              <FormControlLabel
              value="user"
              control={<Radio sx={{ color: 'white' }} />}
              label={<Typography style={{ color: 'white' }}>User</Typography>}
              />

            </RadioGroup>
            <Button type="submit" variant="contained" sx={{ borderRadius: '20px', background:'#f95959',marginLeft:'35%' }}>
              Sign Up
            </Button>
          </form>
          <Box display="flex" justifyContent="left" marginBottom={4} marginTop={2} color={'grey'}>
            <span style={{ fontStyle: 'italic', color:'white' }}> Already Have a Account : </span>
            <MuiLink component={RouterLink} to="/" color="red" underline="none">
              Click Here
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Registration;
