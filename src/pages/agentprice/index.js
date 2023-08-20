// ** MUI Imports
import Grid from '@mui/material/Grid'
import { apiUrls } from 'src/configs/apiurls';

// ** Demo Components Imports
import { useEffect } from 'react';
import { useState } from 'react';
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import PlansComponent from './component/PlansComponent';
import {Button,Alert} from '@mui/material/'

const index = () => {

  // const dispatch = useDispatch();
  const [plans,setPlans] = useState([]);
  const {  data:session,status } = useSession();
  const [profileSelector,setProfileSelector] = useState({
    isLoggedIn:false
  });

  useEffect(async()=>{

    if(status ==="authenticated"){
      setProfileSelector({
        email:session.user.email,
        isLoggedIn:true
      });
      getAgentPlans();

    }
  },[status]);

  async function getAgentPlans(){
    setPlans([]);
    var agentPrice = await axios.get(apiUrls.agentUrl.getagentprice);
    setPlans(agentPrice.data.name);
  }




  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
                <CardHeader title='از طریق بخش زیر می توانید قیمت فروش خود را تغییر دهید' titleTypographyProps={{ variant: 'h6' }} />
                {
                  plans.length>0 ?
                    <PlansComponent  getAgentPlansFunc={getAgentPlans} plans={plans}></PlansComponent>
                    :
                      <Alert severity="info">در حال بارگزاری اطلاعات از سمت سرور...</Alert>
                }
            </Card>
        </Grid>
  </Grid>
  )
}

export default index
