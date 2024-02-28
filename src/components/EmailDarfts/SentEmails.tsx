import {  Box, Button, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material"
import {  useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';



const SentEmails = ({ sentEmails,handleDelete }: any) => {
   
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

  const handleDeleteFromSent = async (emailId: any) => {
    await handleDelete(emailId); 
  };
  return (
    <div>
           <Typography variant="h2" gutterBottom>
   Sent Emails
 </Typography>
 {sentEmails.length === 0 ? (
        <Typography variant='h3'>No Sent Emails</Typography>
      ) : 
 (<TableContainer sx={{mt:2, mb:3}} component={Paper}>
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
       {sentEmails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((email: any) => (
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
     <TableCell> {email.emailContent ? (
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
               onClick={() => handleDeleteFromSent(email.id)}
             >
               Delete
             </Button>
           </TableCell>
         </TableRow>
       ))}
     </TableBody>
   </Table>
 </TableContainer>)}

 <TablePagination
   rowsPerPageOptions={[5, 10, 25]} 
   component="div"
   count={sentEmails.length} 
   rowsPerPage={rowsPerPage}
   page={page}
   onPageChange={handleChangePage}
   onRowsPerPageChange={handleChangeRowsPerPage}
 />
      
    </div>
  )
}

export default SentEmails
