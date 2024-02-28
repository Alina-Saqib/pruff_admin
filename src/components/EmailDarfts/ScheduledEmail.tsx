import { Box, Button, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteEmails, getEmails } from "../../api_calls/emailApis";
import SentEmails from "./SentEmails";
import RecurringEmails from "./RecurringEmails";
import DownloadIcon from '@mui/icons-material/Download';

function ScheduledEmail() {
const [scheduleEmails , setScheduleEmails] = useState([])
const [sentEmails, setSentEmails] = useState([]);
const [recurringEmails ,setRecurringEmails] = useState([]);
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
    const fetchEmails = async () => {
        try {
          const response = await getEmails();
          if (response) {
            const allEmails = response?.data.allEmails || [];
            const scheduled = allEmails.filter((email: any )=> email.emailStatus === "Scheduled");
            const sent = allEmails.filter((email: any) => email.emailStatus === "Sent");
            const recurring = allEmails.filter((email: any) => email.emailStatus === "Recurring")
            setScheduleEmails(scheduled);
            setSentEmails(sent);
            setRecurringEmails(recurring)
          } else {
            //   throw new Error('Failed to fetch templates');
          }
        } catch (error) {
          console.error('Error fetching email:', error);
        }
      };
    
      useEffect(() => {
      
        fetchEmails();
      }, []);


      const handleDelete = async (emailId: any) => {
        try {
          const response = await deleteEmails(emailId);
          if (response) {
            fetchEmails();
          } else {
            throw new Error('Failed to delete email');
          }
        } catch (error) {
          console.error('Error deleting email:', error);
        }
      };
     
      
  return (
    <Box sx={{ m:"30px 10vw"}}>
    
 {scheduleEmails.length === 0 ? (
        <></>
      ) : 
 (
    <>
<Typography variant="h2" gutterBottom>
   Scheduled Emails
 </Typography>
 <TableContainer sx={{mt:2, mb:3}} component={Paper}>
   <Table>
     <TableHead sx={{background:"#888"}}>
       <TableRow>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Emails</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Subject</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Content</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>ScheduledTime</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Attachments</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Status</TableCell>
         <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Actions</TableCell>
       </TableRow>
     </TableHead>
     <TableBody>
       {scheduleEmails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((email: any) => (
         <TableRow key={email.id}  sx={{ cursor: 'pointer','&:hover': { backgroundColor: '#f5f5f5' }  }}>
        <TableCell> {email.toEmails ? (
    email.toEmails.includes(',') ? (
      email.toEmails.split(',').map((email: any, index: any) => (
        <div key={index}>{email.trim()}</div>
      ))
    ) : (
      email.toEmails
    )
  ) : (
    "No Emails"
  )}</TableCell>
      <TableCell>{email.subject ? email.subject : "No Subject"}</TableCell>
     <TableCell>{email.emailContent ? (
    <Box dangerouslySetInnerHTML={{ __html: email.emailContent }} />
  ) : (
    'No content'
  )}</TableCell>
     <TableCell>{email.scheduledTime === null ? "Not a Scheduled Email": email.scheduledTime}</TableCell>
     <TableCell>
  {email.attachments ? (
    email.attachments.includes(',') ? (
      <div>
        {email.attachments.split(',').map((attachment: string, index: number) => (
          <div key={index}>
              <Button
    variant="contained"
    startIcon={<DownloadIcon  />}
    sx={{mb:1}}
  >
            <Link href={attachment}  target="_blank" download sx={{color:"white"}}>
             Attach file 
            </Link>
            </Button>
          </div>
        ))}
      </div>
    ) : (
      <div>
         <Button
    variant="contained"
    startIcon={<DownloadIcon  />}
    sx={{
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}
  >
        <Link href={email.attachments}  target="_blank" sx={{color:"white"}}>
          attach file
        </Link>
        </Button>
      </div>
    )
  ) : (
    'No attachments'
  )}
</TableCell>
     <TableCell>{email.emailStatus}</TableCell>


           <TableCell>
             <Button
               variant="contained"
               startIcon={<DeleteIcon />}
               onClick={() => handleDelete(email.id)}
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
   count={scheduleEmails.length} 
   rowsPerPage={rowsPerPage}
   page={page}
   onPageChange={handleChangePage}
   onRowsPerPageChange={handleChangeRowsPerPage}
 />
 </>
 )}

 
 <RecurringEmails recurringEmails={recurringEmails} handleDelete={handleDelete}/>
 <SentEmails sentEmails={sentEmails} handleDelete={handleDelete}/>
</Box>
  )
}

export default ScheduledEmail
