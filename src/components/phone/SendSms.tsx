import { Autocomplete, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import ReactQuill from "react-quill"
import { getContacts } from "../../api_calls/contactApis";
import SendIcon from '@mui/icons-material/Send';
import { sendPhoneSms } from "../../api_calls/phoneApis";
import { convert} from 'html-to-text';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useLocation, useNavigate } from "react-router-dom";
import HistoryIcon from '@mui/icons-material/History';
import _isEqual from 'lodash/isEqual';
import PhoneTemplates from "./PhoneTemplates";
import SaveIcon from '@mui/icons-material/Save';
import { deletePhoneDraft, editPhoneDraft, savePhoneDraft } from "../../api_calls/draftApis";
import Layout from "../Layout";

function SendSms() {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const queryParams = new URLSearchParams(location.search);
    const selectedNumbers = queryParams.get('phoneNumbers')?.split(',');
    const formatSelectedNumbers = (selectedNumbers: any) => {
      const isEmptyArray = _isEqual(selectedNumbers, ['']);
      return isEmptyArray ? [] : selectedNumbers;
    };
    const [contacts ,setContacts] = useState([]);
    const [recurring, setRecurring] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [scheduledTime, setScheduledTime] = useState('');
    const [frequency, setFrequency] = useState(''); 
    const [loadingContacts,setLoadingContacts] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState<Array<string>>(formatSelectedNumbers(selectedNumbers) ||state?.phoneNumber || []);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [text , setText]  = useState('' || state?.text);
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
  
   
useEffect(() => {
        const handleWindowClose = async () => {
          if (text.trim() !== '') {
            if(state?.id){
              const id = state?.id;
                 try {
                   const response = await editPhoneDraft({ phoneNumber,text, scheduledTime,frequency, id  });
             
                   if (response) {
                       setSnackbarMessage('SMS update in Draft!');
                       setSnackbarOpen(true);
                       setText('');
                       setPhoneNumber([])
                    
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
            const response = await savePhoneDraft({ phoneNumber, text, scheduledTime ,frequency});
            if (response) {
                setSnackbarMessage('SMS saved in Draft!');
                setSnackbarOpen(true);
                setText('');
                setPhoneNumber([])
             
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
      }, [phoneNumber,text ,scheduledTime,frequency]);
    
      const handleSaveDraft = async() => {
        if (text.trim() === '') {
          setSnackbarMessage('Please fill in the email content.');
          setSnackbarOpen(true);
          return;
        }
       if(state?.id){
     const id = state?.id;
        try {
          const response = await editPhoneDraft({ phoneNumber,text ,scheduledTime,frequency, id  });
    
          if (response) {
              setSnackbarMessage('SMS update in Draft!');
              setSnackbarOpen(true);
              setText('');
              setPhoneNumber([])
           
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
        
        try {
          const response = await savePhoneDraft({ phoneNumber,text,scheduledTime,frequency });
    
          if (response) {
              setSnackbarMessage('SMS saved in Draft!');
              setSnackbarOpen(true);
              setText('');
              setPhoneNumber([])
           
          } else {
            
              setSnackbarMessage('Error in saving Draft!');
              setSnackbarOpen(true);
          }
        } catch (error) {
          console.error('Error in saving draft:', error);
        }
    }
      };
    
    
  const handleSendSms = async() => {


    
    
        if (text.trim() === ''|| phoneNumber.length< 1) {
            setSnackbarMessage('Please Enter text and Number to send sms.');
            setSnackbarOpen(true);
            return;
          }

          if(state?.id){
  
            try {
              const response = await deletePhoneDraft(state?.id);   
              if (response) {
               console.log('delete');
              } else {
                throw new Error('Failed to delete draft');
              }
            } catch (error) {
              console.error('Error deleting Draft:', error);
            }
          
          
          }
    
        try {

            const options ={
                wordwrap: 130

            }

            const plainTextContent = convert(text,options);
          
            const response = await sendPhoneSms({ text: plainTextContent, phoneNumber});
      
            if (response) {
                setSnackbarMessage('Sms sent successfully!');
                setSnackbarOpen(true);
                setText('');
                setPhoneNumber([])
                navigate('/sms')
             
            } else {
                setText('');
                setPhoneNumber([])
                setSnackbarMessage('Error in Sms Send!');
                setSnackbarOpen(true);
            }
          } catch (error) {
            console.error('Error sending sms:', error);
          }
     
      };

      const handleScheduleSMS = async (dateTime: any) => {
        setScheduledTime(dateTime);
    
        if (text.trim() === '' || phoneNumber.length < 1) {
          setSnackbarMessage('Please fill in both subject and SMS content.');
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
                const response = await deletePhoneDraft(state?.id);   
                if (response) {
                 console.log('delete');
                } else {
                  throw new Error('Failed to delete draft');
                }
              } catch (error) {
                console.error('Error deleting Draft:', error);
              }
            
            
            }
          
        try {

            const options ={
                wordwrap: 130

            }

            const plainTextContent = convert(text,options);
          const response = await sendPhoneSms({ text: plainTextContent , phoneNumber, scheduledTime,frequency: recurring ? frequency : null, });
    
          if (response) {
              setSnackbarMessage('SMS scheduled for ' + dateTime.toLocaleString());
              setSnackbarOpen(true);
              setText('');
              setScheduledTime('');
              setOpenModal(false)
              setPhoneNumber([])
              navigate('/sms')
    
    
           
          } else {
            
              setSnackbarMessage('Error in Scheduling SMS!');
              setSnackbarOpen(true);
          }
        } catch (error) {
          console.error('Error sending SMS:', error);
        }
        
      };
    
  return (
    <Layout>
    <Box sx={{ m: '0px 50px' }}>
       <Typography variant="h2" sx={{mt:2}} gutterBottom>
       SMS Communicate
      </Typography>
      <Autocomplete
  multiple
  id="to-SMSs-field"
  options={contacts.map((contact: any) => contact?.phone)}
  loading={loadingContacts}
  value={phoneNumber}
  onChange={(event: any, newValue) => {console.log(event) 
     setPhoneNumber(newValue)}}
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip label={option} {...getTagProps({ index })} />
    ))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      placeholder='Select Phone Number'
      fullWidth
      margin="normal"
      sx={{ background: '#e5e5e5', borderRadius: '3px',  "& fieldset": { border: 'none' }, }}
    />
  )}
/>

     
      <ReactQuill
      className='quill'
        id="SMS-content-field"
        placeholder="SMS Content"
        value={text}
        onChange={(content: string) => setText(content)}
        style={{ background: '#e5e5e5', borderRadius:"3px", margin:"20px 0px"}}
      />

   <Button
        variant="contained"
        startIcon={<SendIcon />}
        onClick={handleSendSms}
        sx={{mr:2}}
      >
        Send SMS
      </Button>
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
        Schedule SMS
      </Button>
      <Dialog open={openModal} onClose={() => {
        setScheduledTime('')
        setOpenModal(false)}}>
  <DialogTitle>Schedule SMS</DialogTitle>
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
      label={<Typography sx={{fontSize:"12px"}} color="textSecondary">Set Recurring SMSs</Typography>}
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
    <Button onClick={() => handleScheduleSMS(scheduledTime)}>Schedule</Button>
  </DialogActions>
</Dialog>
<Button
        variant="contained"
        startIcon={<HistoryIcon />}
        onClick={()=>{navigate('/sms')}}
      >
        SMS History
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      <PhoneTemplates props={{setText}}/>
    </Box>
    </Layout>


  )
}

export default SendSms
