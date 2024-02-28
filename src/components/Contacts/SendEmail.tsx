import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import _isEqual from 'lodash/isEqual';
import {
  TextField,
  Button,
  Snackbar,
  Box,
  Autocomplete,
  Chip,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { getContacts, sendEmails } from '../../api_calls/contactApis';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dialog } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';
import { deleteDraft, editDraft, saveDraft } from '../../api_calls/draftApis';
import Templates from '../templates';
import HistoryIcon from '@mui/icons-material/History';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Layout from '../Layout';


function SendEmail() {
  const location = useLocation();
  const { state } = location;
  const queryParams = new URLSearchParams(location.search);
  const selectedEmails = queryParams.get('emails')?.split(',');
  const formatSelectedEmails = (selectedEmails: any) => {
    const isEmptyArray = _isEqual(selectedEmails, ['']);
    return isEmptyArray ? [] : selectedEmails;
  };
  const [openModal, setOpenModal] = useState(false);
  const [toEmails, setToEmails] = useState(formatSelectedEmails(selectedEmails) || state?.toEmails|| [] );
  const [subject, setSubject] = useState(state?.subject || '');
  const [emailContent, setEmailContent] = useState(state?.emailContent || '');
  const [scheduledTime, setScheduledTime] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState(''); 
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileInputChange = (e: any) => {
    const files = e.target.files;
    const filesArray = Array.from(files) as File[];
    setAttachments([...attachments, ...filesArray]);
  };



 const navigate = useNavigate();
  useEffect(() => {
    const handleWindowClose = async () => {
      if (emailContent.trim() !== '') {
     
        if(state?.id){
          const id = state?.id;
             try {
               const response = await editDraft({ toEmails, subject, emailContent, scheduledTime, id  });
         
               if (response) {
                   setSnackbarMessage('Email update in Draft!');
                   setSnackbarOpen(true);
                   setSubject('');
                   setEmailContent('')
                   setToEmails([])
                
               } else {
                 
                   setSnackbarMessage('Error in updating Draft!');
                   setSnackbarOpen(true);
               }
             } catch (error) {
               console.error('Error in updating draft:', error);
             }
         
            }
    else
     { try {
        const response = await saveDraft({ toEmails, subject, emailContent, scheduledTime });
  
        if (response) {
            setSnackbarMessage('Email saved in Draft!');
            setSnackbarOpen(true);
            setSubject('');
            setEmailContent('')
            setToEmails([])
         
        } else {
          
            setSnackbarMessage('Error in saving Draft!');
            setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error in saving draft:', error);
      }

    }
  
    };
}
 

    window.addEventListener('beforeunload', handleWindowClose);
   

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);

    };
  }, [toEmails, subject, emailContent, scheduledTime]);

  const handleSaveDraft = async() => {
    if (emailContent.trim() === '') {
      setSnackbarMessage('Please fill in the email content.');
      setSnackbarOpen(true);
      return;
    }
   if(state?.id){
 const id = state?.id;
    try {
      const response = await editDraft({ toEmails, subject, emailContent, scheduledTime, id  });

      if (response) {
          setSnackbarMessage('Email update in Draft!');
          setSnackbarOpen(true);
          setSubject('');
          setEmailContent('')
          setToEmails([])
       
      } else {
        
          setSnackbarMessage('Error in updating Draft!');
          setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error in saving draft:', error);
    }

   }
   else
  {
    if (subject.trim() === '') {
      const confirmation = window.confirm('Do you want to save without a subject?');
  
      if (!confirmation) {
        return;
      }
    }

    try {
      const response = await saveDraft({ toEmails, subject, emailContent, scheduledTime });

      if (response) {
          setSnackbarMessage('Email saved in Draft!');
          setSnackbarOpen(true);
          setSubject('');
          setEmailContent('')
          setToEmails([])
       
      } else {
        
          setSnackbarMessage('Error in saving Draft!');
          setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error in saving draft:', error);
    }
}
  };

  const handleScheduleEmail = async (dateTime: any) => {
    setScheduledTime(dateTime);

    if (subject.trim() === '' || emailContent.trim() === '') {
      setSnackbarMessage('Please fill in both subject and email content.');
      setSnackbarOpen(true);
      setScheduledTime('');
      setOpenModal(false)
      return;
    }

    if(scheduledTime === ''){
      setSnackbarMessage('Please select the schedule date and time.');
      setSnackbarOpen(true);
      return;

    }

    if (recurring && !frequency) {
      setSnackbarMessage('Please select the recurrence frequency.');
      setSnackbarOpen(true);
      return;
    }

         const currentTime = new Date().getTime();
        const scheduledTimestamp = new Date(scheduledTime).getTime();
  
        const delay = scheduledTimestamp - currentTime;
        if (delay < 0) {
          setSnackbarMessage('Please select future date and time.');
          setSnackbarOpen(true);
          return;

        }

        if(state?.id){
  
          try {
            const response = await deleteDraft(state?.id);
            if (response) {
             console.log('dlete')
            } else {
              throw new Error('Failed to delete template');
            }
          } catch (error) {
            console.error('Error deleting template:', error);
          }
        
        
        }

    try {
      const response = await sendEmails({ toEmails, subject, emailContent, scheduledTime,attachments,frequency: recurring ? frequency : null, });

      if (response) {
          setSnackbarMessage('Email scheduled for ' + dateTime.toLocaleString());
          setSnackbarOpen(true);
          setSubject('');
          setScheduledTime('');
          setOpenModal(false)
          setEmailContent('')
          setToEmails([])
          navigate('/emails')


       
      } else {
        
          setSnackbarMessage('Error in Scheduling Email!');
          setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
    
  };

  // const handleUnsendEmail = () => {

  // };

  const handleSendEmail = async() => {

if(state?.id){
  
  try {
    const response = await deleteDraft(state?.id);
    if (response) {
     console.log('dlete')
    } else {
      throw new Error('Failed to delete template');
    }
  } catch (error) {
    console.error('Error deleting template:', error);
  }


}

    if (subject.trim() === '' || emailContent.trim() === '') {
        setSnackbarMessage('Please fill in both subject and email content.');
        setSnackbarOpen(true);
        return;
      }

    try {
      
        const response = await sendEmails({ toEmails, subject, emailContent , attachments});
  
        if (response) {
            setSnackbarMessage('Email sent successfully!');
            setSnackbarOpen(true);
            setSubject('');
            setEmailContent('')
            setToEmails([])
            navigate('/emails')
         
        } else {
          
            setSnackbarMessage('Error in Email Send!');
            setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error sending email:', error);
      }
 
  };

  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsData = await getContacts(); 
        setContacts(contactsData?.data); 
        setLoadingContacts(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoadingContacts(false);
      }
    };

    fetchContacts();
  }, []);


  return (
    <Layout>
    <Box sx={{ m: '0px 50px' }}>
       <Typography variant="h2" sx={{mt:2}} gutterBottom>
       Communicate
      </Typography>
     <Autocomplete
  multiple
  id="to-emails-field"
  options={contacts.map((contact: any) => contact?.email)}
  loading={loadingContacts}
  value={toEmails}
  onChange={(event: any, newValue) => {console.log(event) 
     setToEmails(newValue)}}
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip label={option} {...getTagProps({ index })} />
    ))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      placeholder='To'
      fullWidth
      margin="normal"
      sx={{ background: '#e5e5e5', borderRadius: '3px',  "& fieldset": { border: 'none' }, }}
    />
  )}
/>

      <TextField
        id="subject-field"
        placeholder="Subject"
        value={subject}
        onChange={(e: any) => setSubject(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ background: '#e5e5e5', borderRadius: '3px' , 
          "& fieldset": { border: 'none' },
}}
      />
      <ReactQuill
      className='quill'
        id="email-content-field"
        placeholder="Email Content"
        value={emailContent}
        onChange={(content: string) => setEmailContent(content)}
        style={{ background: '#e5e5e5', borderRadius:"3px", margin:"20px 0px"}}
      />

      {attachments.length > 0 && (
        <Box sx={{ mt: 2 ,mb:2}} >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {attachments.map((file: any, index) => (
              <Chip
                key={index}
                sx={{bgcolor:"#e5e5e5"}}
                label={`${file.name} (${(file.size / 1024).toFixed(2)} KB)`}
                onDelete={() => {
                  const updatedAttachments = attachments.filter(
                    (_, idx) => idx !== index
                  );
                  setAttachments(updatedAttachments);
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      <Button
        variant="contained"
        startIcon={<SendIcon />}
        onClick={handleSendEmail}
        sx={{mr:2}}
      >
        Send Email
      </Button>
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload">
        <Button component="span"  variant="contained"  
        startIcon={<AttachmentIcon/>} sx={{mr:2}}>
          Attach Files
        </Button>
      </label>
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={handleSaveDraft}
        sx={{mr:2}}
      >
        Save Draft
      </Button>
      <Button
        variant="contained"
        startIcon={<ScheduleIcon />}
        onClick={() => setOpenModal(true)}
        sx={{mr:2}}
      >
        Schedule Email
      </Button>
      <Dialog open={openModal} onClose={() => {
        setScheduledTime('')
        setOpenModal(false)}}>
  <DialogTitle>Schedule Email</DialogTitle>
  <DialogContent sx={{display:"flex",flexDirection:"column"}}>
    <LocalizationProvider  dateAdapter={AdapterDayjs} >

       <DateTimePicker
       sx={{mt:1}}
            label="Schedule Date and Time"
            disablePast
            views={['year', 'month', 'day', 'hours', 'minutes']}
            onChange={(newValue: any) =>{ setScheduledTime(newValue)}}
          />
    
    </LocalizationProvider>
    <FormControlLabel
      sx={{mt:1, mb:1}}
      control={
        <Checkbox
        size='small'
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
          color="primary"
        />
      }
      label={<Typography sx={{fontSize:"12px"}} color="textSecondary">Set Recurring Emails</Typography>}
    />
    {recurring && (
      <FormControl fullWidth>
        <InputLabel id="recurrence-frequency-label">Recurrence Frequency</InputLabel>
        <Select
          labelId="recurrence-frequency-label"
          id="recurrence-frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          label="Recurrence Frequency"
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </FormControl>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => {
       setScheduledTime('')
      setOpenModal(false)}}>Cancel</Button>
    <Button onClick={() => handleScheduleEmail(scheduledTime)}>Schedule</Button>
  </DialogActions>
</Dialog>
      <Button
        variant="contained"
        startIcon={<HistoryIcon />}
        onClick={()=>{navigate('/emails')}}
      >
        Email History
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      <Templates props={{ setEmailContent , setSubject}} />
    </Box>
    </Layout>
  );
}

export default SendEmail;
