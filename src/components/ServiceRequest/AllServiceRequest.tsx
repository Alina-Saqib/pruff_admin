import { useEffect, useState } from "react"
import { getAllRequest, setRequestExpiry } from "../../api_calls/RequestApi";
import { toast } from "react-toastify";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import RequestExpiry from "./RequestExpiry";
import Layout from "../Layout";


function AllServiceRequest() {

    const [request ,setRequest] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openExpiryModal, setOpenExpiryModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
  const handleOpenExpiryModal = (requestId: any) => {
    setSelectedRequestId(requestId);
    setOpenExpiryModal(true);
  };
  const handleCloseExpiryModal = () => {
    setOpenExpiryModal(false);
  };
  const handleSetRequestExpiry = async(expirydays: any,id: any) => {
    const response = await setRequestExpiry({expirydays,id})
    if (response?.status === 200) {
      toast.success(`Expiry of Request Updated`);
     }
     else{
      toast.error('Error in Expiry of Request.');
     }
    handleCloseExpiryModal();
  };

    useEffect(()=>{

        const fetchRequests = async()=>{

            try
            {
            const response: any = await getAllRequest();
            if(response?.status === 200){
                setRequest(response?.data)
                
            }else{
                toast.error("Cannot fetch Requests")
            }}catch(error){
                console.error(error);
                toast.error('Failed to get Request');

            }
        }
        fetchRequests();
    },[handleSetRequestExpiry])

    const handleChangePage = (event: any ,newPage: any) => {
        console.log(event)
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
  return (
<Layout>
    <Box sx={{ m:"30px 10vw"}}>
         {request.length === 0 ? (
        <Typography variant='h2'>No Service Request Found</Typography>
      ) : (
        <>
        <Typography variant='h2'>All Service Requests</Typography>
        <TableContainer component={Paper} sx={{ width:"auto", borderRadius:"4px"}}>
          <Table aria-label="customized table">
            <TableHead sx={{background:"#888"}}>
              <TableRow>
                <TableCell  sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Request User</TableCell>
                <TableCell  sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Category</TableCell>
                <TableCell  sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Description</TableCell>
                <TableCell  sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Status</TableCell>
                <TableCell  sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Request Expiry</TableCell>
                <TableCell  sx={{fontWeight:600, fontSize:'20px',color:"white"}}>Extend Expiry</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {request
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((requests: any) => (
                  <TableRow>
                  
                    <TableCell>{requests.userId}</TableCell>
                    <TableCell>{requests.category}</TableCell>
                    <TableCell>{requests.description}</TableCell>
                    <TableCell>{requests.status}</TableCell>
                    <TableCell>{requests.requestExpiresAt}</TableCell>
                    <TableCell><Button  
                    disabled={requests.status === 'cancelled' || requests.status === 'found' ||
                    requests.status === 'searching' }
                    variant="contained" size='medium' onClick={() => handleOpenExpiryModal(requests?.id)}>
                        Extend Day
                        </Button></TableCell>

                  
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={request.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
        </>
      )}

      <RequestExpiry
        open={openExpiryModal}
        handleClose={handleCloseExpiryModal}
        handleSetExpiry={(expirydays: any) => handleSetRequestExpiry(expirydays, selectedRequestId)}
      />

     


        </Box>
        </Layout>
   
  )
}

export default AllServiceRequest
