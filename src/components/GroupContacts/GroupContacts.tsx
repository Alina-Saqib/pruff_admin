import  { useState} from "react";
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
  Autocomplete,
  Chip,
  Checkbox,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  createGroup,
  deleteGroup,
  updateGroup,
} from "../../api_calls/groupApis";
import { toast } from "react-toastify";

function GroupContacts({ props }: any) {
  // const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingGroup, setEditingGroup] = useState<any>(null); 

  // const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // const handleGroupSelection = (groupId: string) => {
  //   setSelectedGroups([groupId]);
  // };

  // const isSelected = (groupId: string) => selectedGroups.indexOf(groupId) !== -1;

  // const fetchGroups = async () => {
  //   try {
  //     const response = await getGroups();
  //     if (response) {
  //       setGroups(response.data.groups);
  //       props.setGroups(response.data.groups)
  //     } else {
  //       throw new Error("Failed to fetch groups");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching groups:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchGroups();
  // }, []);

  const handleCreateGroup = async () => {
    try {
      if (selectedUsers.length < 2) {
        toast.error("Select at least two emails to make a group");
        return;
      }

      const users = selectedUsers.join(',');
      const grouptype = "Email";
    
      if (editingGroup) {
        const id= editingGroup.id
        const response = await updateGroup({id, name, users, grouptype });
       if(response)
        {setEditingGroup(null);
        setShowModal(false);
        setGroupName("");
        setSelectedUsers([]);
        props.fetchGroups();}
      } else {
        const response = await createGroup({ name, users, grouptype });

        if (response) {
          setShowModal(false);
          setGroupName("");
          setSelectedUsers([]);
          props.fetchGroups();
        }
      }
    } catch (error) {
      console.error("Error creating/editing group:", error);
    }
  };

  const handleEditGroup = (groupId: string) => {
    const editingGroupDetails: any = props.groups.find((group: any) => group.id === groupId);
  
    if (editingGroupDetails) {
      setEditingGroup(editingGroupDetails);
      setGroupName(editingGroupDetails.name);
      const selectedEmails = editingGroupDetails.ContactSchemas.map((contact: any) => contact.email);
      setSelectedUsers(selectedEmails);
      setShowModal(true);
    }
  };
  

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
      props.fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleRowClick = (group: any) => {
    const selectedEmails = group.ContactSchemas.map((contact: any) => contact.email);
    props.setToEmails(selectedEmails)
  
 };

  return (
    <div style={{ marginTop: "30px" }}>
      <Typography variant="h2" gutterBottom>
        Groups
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setShowModal(true)}
      >
        Create New Group
      </Button>

      {props.groups.length === 0 ? (
        <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
          No Group found
        </Typography>
      ) : (
        <TableContainer sx={{ mt: 2, mb: 3 }} component={Paper}>
          <Table>
            <TableHead sx={{ background: "#888" }}>
              <TableRow>
                <TableCell
                  sx={{ fontWeight:600, fontSize: "20px", color: "white" }}
                >
                  
                  Name
                </TableCell>
                <TableCell
                  sx={{ fontWeight:600, fontSize: "20px", color: "white" }}
                >
                  Users Email
                </TableCell>
                <TableCell
                  sx={{ fontWeight:600, fontSize: "20px", color: "white" }}
                >
                  Users Number
                </TableCell>
                <TableCell
                  sx={{ fontWeight:600, fontSize: "20px", color: "white" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.groups.map((group: any) => (
                <TableRow
                  key={group.id}
                  onClick={() => handleRowClick(group)} 
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <TableCell>
                  <Checkbox
                    checked={props.isSelected(group.name)}
                    onChange={() => props.handleGroupSelection(group.name)}
                  />
                    {group.name}</TableCell>
                  <TableCell>
                    {group.ContactSchemas.map((contact: any) => (
                      
                      <Typography sx={{fontSize:"15px"}} key={contact.id}>{contact.email}</Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    {group.ContactSchemas.map((contact: any) => (
                      <Typography sx={{fontSize:"15px"}} key={contact.id}>{contact.phone}</Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      sx={{ mr: 2 }}
                      onClick={() => handleEditGroup(group.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for creating/editing a group */}
      <Dialog open={showModal} onClose={() => {
        setGroupName('');
        setSelectedUsers([]);
        setShowModal(false);
        setEditingGroup(null);
      }}>
        <DialogTitle>{editingGroup ? 'Edit Group' : 'Create New Group'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Group Name"
            value={name}
            onChange={(e) => setGroupName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Autocomplete
            multiple
            id="to-emails-field"
            options={props.contacts.map((contact: any) => contact?.userId)}
            // loading={props.loadingContacts}
            value={selectedUsers}
            onChange={(event: any, newValue) => {
                console.log(event)
              setSelectedUsers(newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Users"
                fullWidth
                margin="normal"
                sx={{
                  background: "#e5e5e5",
                  borderRadius: "3px",
                  "& fieldset": { border: "none" },
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setGroupName('');
            setSelectedUsers([]);
            setShowModal(false);
            setEditingGroup(null);
          }}>Cancel</Button>
          <Button onClick={handleCreateGroup}>
            {editingGroup ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GroupContacts;
