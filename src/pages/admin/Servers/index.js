// ** MUI Imports
import Grid from '@mui/material/Grid'
import { apiUrls } from 'src/configs/apiurls';
import Button from '@mui/material/Button';

// ** Demo Components Imports
import { useEffect } from 'react';
import TextField from '@mui/material/TextField'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider'
import { useState } from 'react';

const Index = () => {
  const [usernameForSearch,setUserNameForSearch] = useState("");
  const [basket,setBasket]= useState([]);

  useEffect(async ()=>{
  },[]);

  const searchByUserNameHandler =(e)=>{
    e.preventDefault();
    setUserNameForSearch(e.target.value);
  }

  async function btnServerHandler(e){
    var apiServer = await axios.get(apiUrls.AdminManagementUrls.EnableIPV4Api);

  }

  return (
    <Card>
      <Grid container spacing={6} style={{padding:'8px'}}>
        <Grid item xs={3}>
          <Button   size='large' onClick={btnServerHandler}  type='submit' sx={{ mr: 2 }} variant='contained'>
              فعال کردن
          </Button>
        </Grid>
      </Grid>

      {/* <Divider></Divider>
      <Grid container spacing={6} style={{padding:'8px'}}>
        <SettleWithAgent AgentInvoiceHandler={AgentInvoiceHandler} agentCode={usernameForSearch} users={basket}></SettleWithAgent>
      </Grid> */}
    </Card>
  )
}

export default Index
