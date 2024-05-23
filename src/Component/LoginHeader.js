import React from 'react';
import ChatIcon from '../Asserts/chaticon.png';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const LoginHeader = () => {
  return (
    <Box sx={{ flexGrow: 0.5 }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 143, 213) 93.4%)' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <img src={ChatIcon} alt="Chat Icon" style={{ width: '50%', marginLeft: '5%' }} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', marginLeft: '-2.5%' }}>
            Retrospect
          </Typography>
        </Toolbar>
      </AppBar> 
    </Box>
  );
}
export default LoginHeader
