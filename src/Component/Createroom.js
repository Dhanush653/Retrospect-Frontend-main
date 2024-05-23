import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, RadioGroup, Radio, FormControlLabel, IconButton, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import retro from '../Service/RetrospectService';

const Createroom = ({ open, onClose, roomToUpdate }) => {
  const [roomDetails, setRoomDetails] = useState({
    roomDescription: '',
    roomName: '',
    access: 'unrestricted',
    allowedEmails: [],
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
        allowedEmails: [],
        roomCreatedBy: roomCreatedBy
      });
    }
  }, [roomToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails({ ...roomDetails, [name]: value });
  };

  const handleAccessChange = (e) => {
    setRoomDetails({ ...roomDetails, access: e.target.value, allowedEmails: [] });
  };

  const handleAddEmail = () => {
    setRoomDetails({
      ...roomDetails,
      allowedEmails: [...roomDetails.allowedEmails, '']
    });
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...roomDetails.allowedEmails];
    newEmails[index] = value;
    setRoomDetails({ ...roomDetails, allowedEmails: newEmails });
  };

  const handleSubmit = async () => {
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{roomToUpdate ? 'Update Room' : 'Create Room'}</DialogTitle>
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
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                {roomDetails.allowedEmails.map((email, index) => (
                  <TextField
                    key={index}
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    variant="outlined"
                    fullWidth
                    label={`Email ${index + 1}`}
                    sx={{ marginRight: '5px' }}
                  />
                ))}
                <IconButton onClick={handleAddEmail} color="primary" aria-label="add email">
                  <Add />
                </IconButton>
              </Box>
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
    </Dialog>
  );
};

export default Createroom;
