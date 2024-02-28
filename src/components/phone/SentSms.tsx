import { useEffect, useState } from "react";
import { deleteSms, getSms } from "../../api_calls/phoneApis";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleSms from "./ScheduleSms";
import RecurringSms from "./RecurringSms";
import PhoneDrafts from "./PhoneDrafts";

function SentSms() {

    const [sentSms , setSentSms] = useState([])
    const [scheduledSms , setScheduledSms] = useState([]);
    const [recurringSms , setRecurringSms] = useState([]);
    const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);

const handleChangePage = (event: any, newPage: any) => {
    console.log(event)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    const fetchSMS = async () => {
        try {
          const response = await getSms();
          if (response) {
            const allSms = response?.data || [];
            const scheduled = allSms.filter((sms: any )=> sms.smsStatus === "Scheduled");
            const sent = allSms.filter((sms: any) => sms.smsStatus === "Sent");
            const recurring = allSms.filter((sms: any) => sms.smsStatus === "Recurring")
            setScheduledSms(scheduled);
            setSentSms(sent);
            setRecurringSms(recurring)
          } else {
              throw new Error('Failed to fetch Sms');
          }
        } catch (error) {
          console.error('Error fetching Sms:', error);
        }
      };
    
      useEffect(() => {
      
        fetchSMS();
      }, []);

      const handleDelete = async (smsId: any) => {
        try {
          const response = await deleteSms(smsId);
          if (response) {
            fetchSMS();
          } else {
            throw new Error('Failed to delete sms');
          }
        } catch (error) {
          console.error('Error deleting sms:', error);
        }
      };
  return (
    <Box sx={{ m:"30px 10vw"}}>
      <PhoneDrafts/>
        <ScheduleSms  scheduledSms= {scheduledSms} handleDelete={handleDelete}/>
        <RecurringSms recurringSms={recurringSms} handleDelete={handleDelete}/>
        <Typography variant="h2" gutterBottom>
   Sent SMS
 </Typography>
    
 {sentSms.length === 0 ? (
        <Typography variant="h3">No Sent SMS</Typography>
      ) : 
 (
    <>
 <TableContainer sx={{mt:2, mb:3}} component={Paper}>
   <Table>
     <TableHead sx={{background:"#888"}}>
       <TableRow>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Phone Number</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Text</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>ScheduledTime</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Status</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Actions</TableCell>
       </TableRow>
     </TableHead>
     <TableBody>
       {sentSms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((SMS: any) => (
         <TableRow key={SMS.id}  sx={{ cursor: 'pointer','&:hover': { backgroundColor: '#f5f5f5' }  }}>
        <TableCell>{SMS.phoneNumber ? SMS.phoneNumber : "No Number"}</TableCell>
      <TableCell>{SMS.text ? SMS.text  : "No text for Message"}</TableCell>
     <TableCell>{SMS.scheduledTime === null ? "Not a Scheduled SMS": SMS.scheduledTime}</TableCell>
     <TableCell>{SMS.smsStatus}</TableCell>


           <TableCell>
             <Button
               variant="contained"
               startIcon={<DeleteIcon />}
               onClick={() => handleDelete(SMS.id)}
             >
               Delete
             </Button>
           </TableCell>
         </TableRow>
       ))}
     </TableBody>
   </Table>
 </TableContainer>
 <TablePagination
   rowsPerPageOptions={[5, 10, 25]} 
   component="div"
   count={sentSms.length} 
   rowsPerPage={rowsPerPage}
   page={page}
   onPageChange={handleChangePage}
   onRowsPerPageChange={handleChangeRowsPerPage}
 />
 </>
 )}

 

</Box>
  )
}

export default SentSms
