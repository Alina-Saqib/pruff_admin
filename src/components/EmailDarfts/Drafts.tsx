import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteDraft, getDraft } from "../../api_calls/draftApis";
import { useNavigate } from "react-router-dom";

function Drafts() {

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
    const fetchTemplates = async () => {
        try {
          const response = await getDraft();
          if (response) {
            setDrafts(response?.data.drafts);
          } else {
            //   throw new Error('Failed to fetch templates');
          }
        } catch (error) {
          console.error('Error fetching templates:', error);
        }
      };
    
      useEffect(() => {
      
        fetchTemplates();
      }, []);


      const handleDelete = async (draftId: any) => {
        try {
          const response = await deleteDraft(draftId);
          if (response) {
            fetchTemplates();
          } else {
            throw new Error('Failed to delete template');
          }
        } catch (error) {
          console.error('Error deleting template:', error);
        }
      };
      const navigate = useNavigate();
      const handleEdit = (draft: any) => {
        const emailsArray = draft.toEmails ? draft.toEmails.includes(',') ? draft.toEmails.split(',').map((item: string) => item.trim()) : [draft.toEmails] : [];
        navigate('/sendEmail', 
         { state: {
            toEmails: emailsArray,
            subject: draft.subject,
            emailContent: draft.emailContent,
            id: draft.id
          },}
        );
      };
  return (
    <Box sx={{ m:"30px 10vw"}}>
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
              <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Emails</TableCell>
              <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Subject</TableCell>
              <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Content</TableCell>
              <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drafts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((draft: any) => (
              <TableRow key={draft.id}  sx={{ cursor: 'pointer','&:hover': { backgroundColor: '#f5f5f5' }  }}>
             <TableCell> {draft.toEmails ? (
    draft.toEmails.includes(',') ? (
      draft.toEmails.split(',').map((email: any, index: any) => (
        <div key={index}>{email.trim()}</div>
      ))
    ) : (
      draft.toEmails
    )
  ) : (
    "No Emails"
  )}</TableCell>
           <TableCell>{draft.subject ? draft.subject : "No Subject"}</TableCell>
          <TableCell>{draft.emailContent ? (
    <Box dangerouslySetInnerHTML={{ __html: draft.emailContent }} />
  ) : (
    'No content'
  )}</TableCell>

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
        rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
        component="div"
        count={drafts.length} // Total number of rows
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

export default Drafts
