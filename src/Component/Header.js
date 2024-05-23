import React, { useState, useEffect } from 'react';
import ChatIcon from '../Asserts/chaticon.png';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Button from '@mui/material/Button';
import Createroom from './Createroom';
import ResetPasswordDialog from './ResetPasswordDialog';
import MyAccountDialog from './MyAccountDialog';
import { useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import Keycloak from './Keycloak';

export default function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [openMyAccountDialog, setOpenMyAccountDialog] = useState(false);
  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false); 
  const location = useLocation();


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {

    Keycloak.logout();
  };

  const handleOpenMyAccountDialog = () => {
    setOpenMyAccountDialog(true);
    handleMenuClose(); 
  };

  const handleCloseMyAccountDialog = () => {
    setOpenMyAccountDialog(false);
  };

  const handleOpenCreateRoomDialog = () => {
    setOpenCreateRoomDialog(true);
    handleMenuClose(); 
  };

  const handleCloseCreateRoomDialog = () => {
    setOpenCreateRoomDialog(false);
  };

  const handleOpenResetPasswordDialog = () => {
    setOpenResetPasswordDialog(true);
    handleMenuClose(); 
  };

  const handleCloseResetPasswordDialog = () => {
    setOpenResetPasswordDialog(false);
  };

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
          {userEmail ? (
            <>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <AccountCircleOutlinedIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {/* <MenuItem onClick={handleOpenMyAccountDialog}>
                  <AccountCircleIcon sx={{ marginRight: 1 }} /> My Account
                </MenuItem>
                <MenuItem onClick={handleOpenResetPasswordDialog}>
                  <LockIcon sx={{ marginRight: 1 }} /> Reset Password
                </MenuItem>  */}
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ marginRight: 1 }} /> Logout
                </MenuItem>
              </Menu>
              <Typography variant="subtitle1" sx={{ color: 'white', marginRight: '3%' }}>
                {userEmail}
              </Typography>
              
                <Button color="inherit" style={{ fontWeight: 'bold', background: 'linear-gradient(110.1deg, rgb(241, 115, 30) 18.9%, rgb(231, 29, 54) 90.7%)', marginLeft: '-1%' }} onClick={handleOpenCreateRoomDialog}>+ Create Room</Button>
             
              <Createroom open={openCreateRoomDialog} onClose={handleCloseCreateRoomDialog} /> 
            </>
          ) : null}
        </Toolbar>
      </AppBar>
      {/* <MyAccountDialog open={openMyAccountDialog} onClose={handleCloseMyAccountDialog} />
      <ResetPasswordDialog open={openResetPasswordDialog} onClose={handleCloseResetPasswordDialog} />  */}
    </Box>
  );
}

