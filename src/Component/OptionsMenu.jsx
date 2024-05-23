import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const OptionsMenu = ({ anchorEl, onClose, onDelete }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={onDelete}>Delete</MenuItem>
    </Menu>
  );
};

export default OptionsMenu;