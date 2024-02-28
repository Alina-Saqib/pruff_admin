import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Checkbox,
} from '@mui/material';
import { getContacts, uploadLeads } from '../../api_calls/contactApis';
import { toast } from 'react-toastify';
import { countries } from "../../utility/countrycodes.json";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Papa from 'papaparse';
import {  useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import GroupContacts from '../GroupContacts/GroupContacts';
import { getGroups } from '../../api_calls/groupApis';
import Layout from '../Layout';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function ContactsTable() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [groups, setGroups] = useState([])

  const handleGroupSelection = (name: string) => {
    if (selectedRows.length > 0) {
       toast.error("Cannot Select Group Already Contact is Selected")
       return;
      
    }
    const selectedIndex = selectedGroups.indexOf(name);
    let newSelected: string[] = [];

    if (selectedGroups.length > 0 && selectedIndex === -1) {
      toast.error("Cannot select already a group is Selected")
      return;
    }
  

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selectedGroups, name);
    
  } else {
    newSelected = selectedGroups.filter((id) => id !== name);
  }
  
  setSelectedGroups(newSelected);
  };

  const isSelected = (groupId: string) => selectedGroups.indexOf(groupId) !== -1;


const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const response = await getContacts();
      if (response?.status === 200) {
        setContacts(response?.data);
      } else {
        toast.error('Cannot fetch contact data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    setUploadedFileName(file.name);
  
    Papa.parse(file, {
      header: true,
      complete: (results: any) => {
        const filteredContacts = results.data.filter((contact: any) => {
          const nameNotEmpty = contact.name.trim() !== '';
          const emailNotEmpty = contact.email && contact.email.trim() !== '';
          const phoneNotEmpty = contact.phone && contact.phone.trim() !== '';
        
        
          return nameNotEmpty || (emailNotEmpty && phoneNotEmpty);
        });
        
          addContactsFromCSV(filteredContacts);
          setUploadedFileName('');
          event.target.value = '';
        
        },
      error: (error: any) => {
        console.error(error);
        toast.error('Error parsing the file.');
        setUploadedFileName('');
        event.target.value = '';
      }
    });
  };
  
  const addContactsFromCSV = async (contactsFromCSV: any) => {
    try {
      const addedContacts = [];
      let isValidFile = true;
  
      for (const contact of contactsFromCSV) {
        const { name, email, phone } = contact;
  
        const isValidCountryCode = countries.some((country: any) =>
          phone.startsWith(country.code)
        );
  
        if (!isValidCountryCode || !name || !email || !phone) {
          toast.error('Format all numbers using country code such as +143 and fill all fields');
          isValidFile = false;
        return
        }
  
        const contactExists = contacts.some(
          (existingContact: any) =>
            existingContact.email === email || existingContact.phone === phone
        );
  
        if (contactExists) {
          toast.error('Some contacts are repeated and cannot be added');
          isValidFile = false;
          return
        }
  
        addedContacts.push(contact);
      }
  
      if (isValidFile && addedContacts.length === contactsFromCSV.length) {
        for (const contact of addedContacts) {
          const { name, email, phone } = contact;
          const response = await uploadLeads({ name, email, phone });
          if (response?.status !== 200) {
           console.error(`Failed to add contact: ${name}`);
            isValidFile = false;
            break;
          }
        }
  
        if (isValidFile) {
          fetchData();
          toast.success(`${addedContacts.length} contacts added successfully`);
        } else {
          toast.error('Error uploading contacts. Please try again.');
        }
      } else {
        toast.error('Error importing contacts. Please correct the file format.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error importing contacts');
    }
  };
  
  
 
  
  
  const handleRowSelection = (event: any, userId: any) => {
    console.log(event)
    if (selectedGroups.length > 0) {
      toast.error("Cannot select already a group is Selected")
      return;
    }
    const selectedIndex = selectedRows.indexOf(userId);
    let newSelected : any = [];
  
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }
  
    setSelectedRows(newSelected);
  };
  

  const handleAddContact = async () => {
    try {
    const isValidCountryCode = countries.some((country: any) =>
      phone.startsWith(country.code)
      );
    
      if (phone) {
        if (!isValidCountryCode) {
          return toast.error(
            "Phone Number format is not correct start with country code e.g '+143'"
          );
         
        }
      }

      if(!name || !email || !phone){
        return toast.error(
            "Fill all the fields"
          );

      }

      const contactExists = contacts.some(
        (contact: any) => contact.email === email || contact.phone === phone
      );
  
      if (contactExists) {
        return toast.error("Email or phone already exists");
      }
      
      const response = await uploadLeads({ name, email, phone });
      if (response?.status === 200) {
        toast.success('Contact added successfully');
        fetchData();
        setPhone('')
        setEmail('')
        setName('')
        setOpenDialog(false);
      } else {
        toast.error('Email or phone already exists');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add contact');
    }
  };

  const handleChangePage = (event: any ,newPage: any) => {
    console.log(event)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchGroups = async () => {
    try {
      const response = await getGroups();
      if (response) {
        setGroups(response.data.groups);
        
      } else {
        throw new Error("Failed to fetch groups");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSendEmail = () => {
    
    if(selectedRows.length > 0 )
{    const selectedEmails = contacts
      .filter((contact: any) => selectedRows.includes(contact?.userId))
      .map((contact:any) => contact.email);

    navigate(`/sendEmail?emails=${selectedEmails.join(',')}`);}
    else if(selectedGroups.length > 0){
      const selectedEmails = groups
      .filter((group: any) => selectedGroups.includes(group.name))
      .flatMap((group: any) =>
        group.ContactSchemas.flatMap((contactSchema: any) => contactSchema.email)
      );
    
    navigate(`/sendEmail?emails=${selectedEmails.join(',')}`);

    }else{
      navigate(`/sendEmail`);
    }

  };

  const handleSendSMS = () => {
    
    if(selectedRows.length > 0 )
   
 {   const selectedNumbers = contacts
      .filter((contact: any) => selectedRows.includes(contact?.userId))
      .map((contact:any) => contact.phone);

    navigate(`/sendSms?phoneNumbers=${selectedNumbers.join(',')}`);}
    else if(selectedGroups.length > 0){
      const selectedNumbers = groups
      .filter((group: any) => selectedGroups.includes(group.name))
      .flatMap((group: any) =>
        group.ContactSchemas.flatMap((contactSchema: any) => contactSchema.phone)
      );
    
    navigate(`/sendSms?phoneNumbers=${selectedNumbers.join(',')}`);}

    else{
      navigate(`/sendSms`);

    }
  };

  return (

    <Layout>
    <Box sx={{ m:"30px 10vw"}}>
    <Box sx={{display:"flex", alignItems:"center", justifyContent:"space-between", m:1}}>
    <Typography variant='h2'>Contacts</Typography>
    <div>
    <Button
        variant="contained"
        size='medium'
        sx={{mr:2}}
        startIcon={<HistoryIcon />}
        onClick={()=>{navigate('/sms')}}
      >
        SMS History
      </Button>
    <Button
        variant="contained"
        size='medium'
        sx={{mr:2}}
        startIcon={<HistoryIcon />}
        onClick={()=>{navigate('/emails')}}
      >
        Email History
      </Button>
    <Button variant="contained" size='medium' onClick={handleSendEmail} sx={{mr:2}}>
    Send Email
   </Button>
   <Button variant="contained" size='medium' onClick={handleSendSMS} sx={{mr:2}}>
    Send SMS
   </Button>
    <Button component="label" variant="contained" size='medium'  sx={{mr:2}} startIcon={<CloudUploadIcon />}>
    {uploadedFileName  ? <Typography variant='h3'>{uploadedFileName}</Typography>:'Upload file'}
  <VisuallyHiddenInput type="file" accept=".csv"  onChange={handleFileUpload}/>
</Button>

      <Button variant="contained" size='medium' onClick={() => setOpenDialog(true)}>
        Add Contact
      </Button>
      </div>
      </Box>
 
      {contacts.length === 0 ? (
        <Typography variant='h2'>No contacts found</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ width:"auto", borderRadius:"4px"}}>
          <Table aria-label="customized table">
            <TableHead sx={{background:"#888"}}>
              <TableRow>
                <TableCell  sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Email</TableCell>
                <TableCell  sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Phone</TableCell>
                <TableCell  sx={{fontWeight:600, fontSize:'20px',color:"white"}}>User ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact: any) => (
                  <TableRow key={contact.userId} selected={selectedRows.indexOf(contact.userId) !== -1}>
                  
                    <TableCell>  <Checkbox
      color="primary"
      onChange={(e) => handleRowSelection(e, contact.userId)}
      checked={selectedRows.indexOf(contact.userId) !== -1}
    />{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.userId}</TableCell>
                  
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={contacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle variant='h3'>Add Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEmail('')
            setPhone('')
            setName('')
            setOpenDialog(false)}}>Cancel</Button>
          <Button onClick={handleAddContact} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      
      <GroupContacts  props={{contacts,isSelected,handleGroupSelection,groups,fetchGroups}} />
    </Box>
    </Layout>
  );
}

export default ContactsTable;
