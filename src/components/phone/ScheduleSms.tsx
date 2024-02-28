import { useState } from "react";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

function ScheduleSms({scheduledSms,handleDelete }: any) {

    
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

    
  return (
    <Box>
    
 {scheduledSms.length === 0 ? (
        <></>
      ) : 
 (
    <>
   <Typography variant="h2" gutterBottom>
   Scheduled SMS
 </Typography>
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
       {scheduledSms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((SMS: any) => (
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
   count={scheduledSms.length} 
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

export default ScheduleSms
