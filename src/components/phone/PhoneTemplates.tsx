import  { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { deletePhoneTemplate, editPhoneTemplate, getPhoneTemplates, savePhoneTemplate } from '../../api_calls/templateApis';
function PhoneTemplates({props}: any) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ id:'', content: '' }); 

  const fetchTemplates = async () => {
    try {
      const response = await getPhoneTemplates();
      if (response) {
        setTemplates(response?.data);
      } else {
         throw new Error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
  
    fetchTemplates();
  }, []);

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setNewTemplate({ id: template.id,content: template.content }); 
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedTemplate(null);
    setNewTemplate({id:'', content: '' });
    setOpenDialog(false);
  };

  const handleSaveTemplate = async (updatedTemplate: any) => {
    try {
      const response = await editPhoneTemplate(updatedTemplate);
      if (response) {
        const updatedTemplates = templates.map((template: any) =>
          template.id === updatedTemplate.id ? updatedTemplate : template
        );
        setTemplates(updatedTemplates as any);
        handleCloseDialog();
        fetchTemplates();
      } else {
        throw new Error('Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDelete = async (templateId: any) => {
    try {
      const response = await deletePhoneTemplate(templateId);
      if (response) {
        const updatedTemplates = templates.filter((template: any) => template.id !== templateId);
        setTemplates(updatedTemplates);
      } else {
        throw new Error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleAddTemplate = () => {
    setNewTemplate({id:'', content: '' }); 
    setOpenDialog(true);
  };

  const handleSaveNewTemplate = async () => {
    try {
      const response = await savePhoneTemplate(newTemplate); 
      if (response) {
        setTemplates([...templates, response.data] as any); 
        handleCloseDialog();
        fetchTemplates();
        
      } else {
        throw new Error('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };
  const handleRowClick = (template: any) => {
     props.setText(template.content)
  };
  
  return (
    <div style={{marginTop:"30px"}}>
      <Typography variant="h2" gutterBottom>
        Templates
      </Typography>
      <Button   variant="contained"
        startIcon={<AddIcon />} onClick={handleAddTemplate}>Add Template</Button> 
    
    {templates.length === 0 ? (
        <Typography variant='h2' sx={{mt:2 ,mb:3}}>No Templates found</Typography>
      ) : 
      (<TableContainer sx={{mt:2, mb:3}} component={Paper}>
        <Table>
          <TableHead sx={{background:"#888"}}>
            <TableRow>
              <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Content</TableCell>
              <TableCell sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((template: any) => (
              <TableRow key={template.id} onClick={() => handleRowClick(template)} sx={{ cursor: 'pointer','&:hover': { backgroundColor: '#f5f5f5' }  }}>
                <TableCell>{template.content}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(template)}
                    sx={{ mr: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(template.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>)}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedTemplate ? 'Edit Template' : 'Add Template'}</DialogTitle>
        <DialogContent>
          {selectedTemplate ? (
            <div>
              <TextField
                label="Content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                multiline
                fullWidth
                margin="normal"
              />
            </div>
          ) : (
            <div>
             <div>
              <TextField
                label="Content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                multiline
                fullWidth
                margin="normal"
              />
            </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {selectedTemplate ? (
            <Button onClick={() => handleSaveTemplate(newTemplate)}>Save</Button>
          ) : (
            <Button onClick={handleSaveNewTemplate}>Save</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PhoneTemplates;
