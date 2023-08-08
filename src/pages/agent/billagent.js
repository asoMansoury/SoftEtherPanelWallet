// ** MUI Imports
import Grid from '@mui/material/Grid'
import FormLayoutTypeBasket from 'src/views/baskets/FormLayoutTypeBasket'
import { apiUrls } from 'src/configs/apiurls';

// ** Demo Components Imports
import { useEffect } from 'react';
import { useState } from 'react';
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import AgentUsers from './components/AgentUsers';
import { useSession } from 'next-auth/react';

const BillAgent = () => {

  // const dispatch = useDispatch();
  const [users,setUsers] = useState([]);
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

      await axios.get(apiUrls.agentUrl.isAgentUrl+session.user.email).then((response)=>{
        if(response.data.name.isAgent==true){
          console.log(response.data.name.agentcode)
            axios.post(apiUrls.agentUrl.getAgentBill,{body:{email:session.user.email}}).then((agentResponse)=>{
                setUsers(agentResponse.data.name);
            });
        }else{

        }
    });
    }
  },[status])


  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
                <CardHeader title='اکانت های خریداری شده توسط شما' titleTypographyProps={{ variant: 'h6' }} />
                {
                    users.length>0 &&
                        <AgentUsers users={users}></AgentUsers>
                }
                
            </Card>
        </Grid>
  </Grid>
  )
}

export default BillAgent
