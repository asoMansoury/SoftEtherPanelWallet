// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { useEffect } from 'react';
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import { useDispatch, useSelector } from 'react-redux';
import ChanginServerTable from './components/ChanginServerTable';
import axios from 'axios';
import { apiUrls } from 'src/configs/apiurls';
import { useState } from 'react';
import LoadinServerForChange from './components/LoadinServerForChange';
import { Alert } from '@mui/material';
import { useSession } from 'next-auth/react';
const ChangeServer = () => {

  // const dispatch = useDispatch();
  const [userServer,setUserServers] = useState([]);
  const [isShowServerComponent,setShowServerComponent] = useState(false);
  const [selectedUser,setSelectedUser]=useState();
  

  const [erros,setErros] = useState({
    hasErros:false,
    erroMsg:''
  });



  async function getUsersServerHandler(item){
    setErros({
      hasErros:false,
      erroMsg:''
    })
    setShowServerComponent(false);
    var getUsersServer =await axios.get(apiUrls.server.getUsersServerApi+item.username);
    setUserServers(getUsersServer.data.name);
    setShowServerComponent(true);
    setSelectedUser(item);
  }

  async function changeServerHandler(item){
    var obj = {
      servercode:item.servercode,
      username:selectedUser.username,
      password:selectedUser.password
    }
    
    setShowServerComponent(false);
    var result =await axios.post(apiUrls.userfreeUrls.ChangeUserFreeServer,{body:obj});
    setErros({
      hasErros:true,
      erroMsg:result.data.name
    });
  }
  
  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
                <CardHeader title='لیست اکانت ها برای تغییر سرور' titleTypographyProps={{ variant: 'h6' }} />
                <ChanginServerTable getUsersServerHandler={getUsersServerHandler}></ChanginServerTable>

                {
                  isShowServerComponent && (
                    <>
                       <div style={{paddingRight:'30px', paddingTop:'30px',paddingBottom: '30px'}}>
                          <Alert severity="success">از بین سرورهای زیر یکی از سرورها را انتخاب نمایید.</Alert>
                      </div>
                      <LoadinServerForChange changeServerHandler={changeServerHandler} servers={userServer}></LoadinServerForChange>
                    </>
                  )
                }


              {
                  erros.hasErros && (
                    <>
                       <div style={{paddingRight:'30px', paddingTop:'30px',paddingBottom: '30px'}}>
                          <Alert severity="success">{erros.erroMsg}</Alert>
                      </div>
                    </>
                  )
                }
            </Card>
        </Grid>
  </Grid>
  )
}

export default ChangeServer;
