import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const RequestExpiry = ({ open, handleClose, handleSetExpiry }: any) => {
  const [days, setDays] = useState('');

  const handleSave = () => {
    handleSetExpiry(days);
    setDays('');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Request Expiry</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Expiry Duration (in days)"
          type="number"
          fullWidth
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default  RequestExpiry;
