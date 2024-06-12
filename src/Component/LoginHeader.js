import React from 'react';
import ChatIcon from '../Asserts/logo.png';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const LoginHeader = () => {
  return (
    <Box sx={{ flexGrow: 0.5 }}>
      <AppBar position="static" sx={{ background: 'white' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <img src={ChatIcon} alt="Chat Icon" style={{ width: '60%', marginLeft: '5%' }} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', marginLeft: '-2.5%' }}>
          <span style={{color:'black', fontWeight:'300'}}>RETRO </span><span style={{color:'#9ACD32',fontWeight:'300'}}>SPECT</span>
          </Typography>
          
        </Toolbar>
      </AppBar> 
    </Box>
  );
}
export default LoginHeader
