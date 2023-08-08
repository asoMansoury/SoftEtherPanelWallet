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
import UsersPurchasedTable from './component/usersPurchasedTable';
import SettleWithAgent from './component/settleWithAgent';

const Index = () => {
  const [usernameForSearch,setUserNameForSearch] = useState("");
  const [basket,setBasket]= useState([]);

  useEffect(async ()=>{
  },[]);

  const searchByUserNameHandler =(e)=>{
    e.preventDefault();
    setUserNameForSearch(e.target.value);
  }

  async function AgentInvoiceHandler(e){
    var usersAccounts =await axios.get(apiUrls.AdminManagementUrls.GetAgentInvoice+usernameForSearch);
    setBasket(usersAccounts.data.name);
  }

  return (
    <Card>
      <Grid container spacing={6} style={{padding:'8px'}}>
        <Grid item xs={6}>
          <TextField name="username" 
            type='input'
            onChange={searchByUserNameHandler}

            fullWidth label='نام کاربر' placeholder='جسجتو نماینده فروش بر اساس نام کاربری' />
        </Grid>
        <Grid item xs={3}>
          <Button   size='large' onClick={AgentInvoiceHandler}  type='submit' sx={{ mr: 2 }} variant='contained'>
              مشاهده صورتحساب
          </Button>
        </Grid>
      </Grid>

      <Divider></Divider>

      <Grid container spacing={6} style={{padding:'8px'}}>
        <UsersPurchasedTable users={basket}></UsersPurchasedTable>
      </Grid>

      <Divider></Divider>
      <Grid container spacing={6} style={{padding:'8px'}}>
        <SettleWithAgent AgentInvoiceHandler={AgentInvoiceHandler} agentCode={usernameForSearch} users={basket}></SettleWithAgent>
      </Grid>
    </Card>
  )
}

export default Index
