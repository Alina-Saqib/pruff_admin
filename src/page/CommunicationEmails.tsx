// import { Button } from '@mui/material'
import Drafts from '../components/EmailDarfts/Drafts'
import ScheduledEmail from '../components/EmailDarfts/ScheduledEmail'
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function CommunicationEmails() {

  // const navigate = useNavigate();
  return (
    <Layout>
    <div style={{paddingTop:'20px', paddingLeft:"10px"}}>

      {/* <Button variant="contained"
      startIcon={<ArrowBackIosIcon/>}
      onClick={()=>{navigate('/')}}>
        Contact Page
      </Button> */}
        <Drafts/>
        <ScheduledEmail/>
      
    </div>
    </Layout>
  )
}

export default CommunicationEmails
