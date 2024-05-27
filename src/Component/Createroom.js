import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import retro from '../Service/RetrospectService';

const Createroom = ({ open, onClose, roomToUpdate }) => {
  const [roomDetails, setRoomDetails] = useState({
    roomDescription: '',
    roomName: '',
    access: 'unrestricted',
    password: '', 
    roomCreatedBy: ''
  });

  useEffect(() => {
    const roomCreatedBy = localStorage.getItem('userEmail');
    if (roomCreatedBy) {
      setRoomDetails(prevDetails => ({ ...prevDetails, roomCreatedBy }));
    }

    if (roomToUpdate) {
      setRoomDetails(roomToUpdate);
    } else {
      setRoomDetails({
        roomDescription: '',
        roomName: '',
        access: 'unrestricted',
        password: '',
        roomCreatedBy: roomCreatedBy
      });
    }
  }, [roomToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails({ ...roomDetails, [name]: value });
  };

  const handleAccessChange = (e) => {
    setRoomDetails({ ...roomDetails, access: e.target.value, password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form from submitting the default way
    try {
      if (roomToUpdate) {
        await retro.updateRoom(roomToUpdate.roomId, roomDetails);
      } else {
        await retro.createRoom(roomDetails);
      }
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{roomToUpdate ? 'Update Room' : 'Create Room'}</DialogTitle>
      <form onKeyDown={handleKeyDown}>
        <DialogContent>
          <TextField
            name="roomName"
            label="Room-Name"
            value={roomDetails.roomName}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            name="roomDescription"
            label="Room-Description"
            value={roomDetails.roomDescription}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: '10px' }}
          />
          {!roomToUpdate && (
            <React.Fragment>
              <FormControl component="fieldset" sx={{ marginTop: '10px' }}>
                <RadioGroup row aria-label="room-access" name="access" value={roomDetails.access} onChange={handleAccessChange}>
                  <FormControlLabel value="unrestricted" control={<Radio />} label="Unrestricted" />
                  <FormControlLabel value="restricted" control={<Radio />} label="Restricted" />
                </RadioGroup>
              </FormControl>
              {roomDetails.access === 'restricted' && (
                <TextField
                  name="password"
                  label="Password"
                  type='password'
                  value={roomDetails.password}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: '10px' }}
                />
              )}
            </React.Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {roomToUpdate ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Createroom;
