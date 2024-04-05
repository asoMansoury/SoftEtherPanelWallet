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
import CopyToClipboard from 'react-copy-to-clipboard';
const ChangeServer = () => {

  // const dispatch = useDispatch();
  const [userServer, setUserServers] = useState([]);
  const [isShowServerComponent, setShowServerComponent] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const { data: session, status } = useSession();
  const [isWorking, setIsWorking] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [vpnType,setVpnType] = useState("");
  const [profileSelector, setProfileSelector] = useState({
    isLoggedIn: false
  });

  const [erros, setErros] = useState({
    hasErros: false,
    erroMsg: ''
  });

  useEffect(async () => {

    if (status === "authenticated") {
      setProfileSelector({
        email: session.user.email,
        isLoggedIn: true
      });
    }
  }, [status])

  async function getUsersServerHandler(item) {
    setErros({
      hasErros: false,
      erroMsg: ''
    })
    setShowServerComponent(false);
    var getUsersServer = await axios.get(apiUrls.server.getUsersServerApi + item.username);
    setVpnType(getUsersServer.data.name[0].type);
    setUserServers(getUsersServer.data.name);
    setShowServerComponent(true);
    setSelectedUser(item.username);
  }

  async function ToggleActivateUserHandler(item) {
    setIsWorking(true);
    var obj = {
      servercode: item.servercode,
      username: selectedUser
    }

    setShowServerComponent(false);
    const result = await axios.get(apiUrls.userUrl.RestartUserConnectionUrl + item.username);
    console.log(result);
    setTimeout(() => {
      setIsWorking(false);
      setErros({
        hasErros: true,
        erroMsg: result.data.name.message
      });
    }, 2000);

  }

  async function changeServerHandler(item) {
    setIsWorking(true);
    var obj = {
      servercode: item.servercode,
      username: selectedUser
    }

    setShowServerComponent(false);
    var result = await axios.post(apiUrls.userUrl.changeUserServerUrl, { body: obj });
    setLoadingUsers(false);
    setIsWorking(false);
    setErros({
      hasErros: true,
      erroMsg: result.data.name
    });
    setLoadingUsers(false);
  }

  async function RefreshUserDataHandler(e) {
    setShowServerComponent(false);
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='لیست اکانت ها برای تغییر سرور' titleTypographyProps={{ variant: 'h6' }} />
          <ChanginServerTable RefreshUserDataHandler={RefreshUserDataHandler} LoadingUsers={loadingUsers} getUsersServerHandler={getUsersServerHandler} ToggleActivateUserHandler={ToggleActivateUserHandler}></ChanginServerTable>
          {
            isWorking == true &&
            <Alert severity="info">در حال لود اطلاعات. لطفا منتظر بمانید...</Alert>
          }
          {
            isShowServerComponent && (
              <>
                <div style={{ paddingRight: '30px', paddingTop: '30px', paddingBottom: '30px' }}>
                  <Alert severity="success">از سرورهای زیر یکی از سرورها را انتخاب نمایید.</Alert>
                </div>

                <LoadinServerForChange changeServerHandler={changeServerHandler} servers={userServer}></LoadinServerForChange>
              </>
            )
          }


          {
            erros.hasErros && (
              <>
                <div style={{ paddingRight: '30px', paddingTop: '30px', paddingBottom: '30px' }}>
                  {
                    vpnType!= apiUrls.types.VpnHood && <Alert severity="success">{vpnType} : {erros.erroMsg}</Alert>
                  }
                  {
                    vpnType == apiUrls.types.VpnHood && <CopyToClipboard
                                                          text={erros.erroMsg}
                                                          onCopy={() => alert("کپی شد")}>
                                                          <Alert severity='info'>برای کپی کد کلیک کنید.</Alert>
                                                      </CopyToClipboard>
                  }

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
