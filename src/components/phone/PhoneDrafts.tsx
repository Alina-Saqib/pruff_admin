import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deletePhoneDraft, getPhoneDraft } from "../../api_calls/draftApis";
import { useNavigate } from "react-router-dom";

function PhoneDrafts() {

const [drafts , setDrafts] = useState([])
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
    const fetchDrafts = async () => {
        try {
          const response = await getPhoneDraft();
          if (response) {
            setDrafts(response?.data.drafts);
          } else {
         throw new Error('Failed to fetch drafts');
          }
        } catch (error) {
          console.error('Error fetching drafts:', error);
        }
      };
    
      useEffect(() => {
      
        fetchDrafts();
      }, []);


      const handleDelete = async (draftId: any) => {
        try {
          const response = await deletePhoneDraft(draftId);
          if (response) {
            fetchDrafts();
          } else {
            throw new Error('Failed to delete template');
          }
        } catch (error) {
          console.error('Error deleting template:', error);
        }
      };
      const navigate = useNavigate();
      const handleEdit = (draft: any) => {
        const phoneArray = draft.phoneNumber ? draft.phoneNumber.includes(',') ? draft.phoneNumber.split(',').map((item: string) => item.trim()) : [draft.phoneNumber] : [];
        navigate('/sendSms', 
         { state: {
            phoneNumber: phoneArray,
            text: draft.text,
            id: draft.id
          },}
        );
      };
  return (
    <Box>
      {drafts.length === 0 ? (
       <></>
      ) : 
      (<>
        <Typography variant="h2" gutterBottom>
        Saved Drafts
      </Typography>
      <TableContainer sx={{mt:2, mb:3}} component={Paper}>
        <Table>
          <TableHead sx={{background:"#888"}}>
            <TableRow>
              <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Phone Number</TableCell>
              <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>text</TableCell>
              <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drafts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((draft: any) => (
              <TableRow key={draft.id}  sx={{ cursor: 'pointer','&:hover': { backgroundColor: '#f5f5f5' }  }}>
             <TableCell>{draft.phoneNumber ? draft.phoneNumber : "No Phone Number"}</TableCell>
           <TableCell>{draft.text ? (<Box dangerouslySetInnerHTML={{ __html:draft.text}}/> ): ("No Text")}</TableCell>
        
                <TableCell>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(draft)}
                    sx={{ mr: 2 }}
                  >
                    Edit to Send
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(draft.id)}
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
        count={drafts.length} 
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

export default PhoneDrafts
