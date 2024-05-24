import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const AddTopicDialog = ({ open, onClose, onAdd }) => {
  const [topicName, setTopicName] = useState('');

  const handleAdd = () => {
    if (topicName.trim()) {
      onAdd(topicName.trim());
      setTopicName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Topic</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Topic Name"
          fullWidth
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAdd} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTopicDialog;