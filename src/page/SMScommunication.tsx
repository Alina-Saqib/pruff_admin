// import { Button } from "@mui/material"
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import { useNavigate } from 'react-router-dom';
import SentSms from "../components/phone/SentSms";
import Layout from "../components/Layout";

function SMScommunication() {
    // const navigate = useNavigate();
  return (
    <Layout>
    <div style={{paddingTop:'20px', paddingLeft:"10px"}}>
        {/* <Button variant="contained"
      startIcon={<ArrowBackIosIcon/>}
      onClick={()=>{navigate('/')}}>
        Contact Page
      </Button> */}
      <SentSms/>
    </div>
    </Layout>
  )
}

export default SMScommunication
