// ** MUI Imports
import { apiUrls } from 'src/configs/apiurls';

// ** Demo Components Imports
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { Alert } from '@mui/material';
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { isEmail } from 'validator';
import Profilestatus from 'src/redux/actions/profileActions';
import { useSession } from 'next-auth/react';
import Select from '@mui/material/Select'
import { useRouter } from 'next/router';

const index = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isEnablePassword, setIsEnablePassword] = useState(false);
  const [isEnableEmail, setIsEnableEmail] = useState(false);
  const [isEnabledConfirm, setIsEnabledConfirm] = useState(false);
  // const dispatch = useDispatch();

  const { data: session, status } = useSession();
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState([]);
  const [agentCode,setAgentCode] = useState("");
  const [profileSelector, setProfileSelector] = useState({
    isLoggedIn: false
  });
  const [error, setError] = useState({
    isValid: true,
    isValidShow: false,
    errosMsg: ""
  });


  useEffect(async () => {
    var agentCode = router.query['agent'];
    if(agentCode!=undefined)
        setAgentCode(agentCode);
    if (status === "authenticated") {
      setProfileSelector({
        email: session.user.email,
        isLoggedIn: true
      });
    }
  }, [status])


  useEffect(async () => {
    await LoadServers();

    if (profileSelector.isLoggedIn == true) {
      var isUserValid = (await axios.get(apiUrls.testAccountsUrls.isvalid + profileSelector.email + "&type=" + apiUrls.types.Cisco)).data;
      if (isUserValid.name.isValid == false) {
        setError({
          isValid: false,
          errosMsg: isUserValid.name.message
        });
      }
      setEmail(profileSelector.email);
      setIsEnablePassword(true);
      setIsEnableEmail(true);
      setIsEnabledConfirm(true);
    }else{
      setIsEnabledConfirm(false);
    }

  }, []);


  async function LoadServers(){
    setIsEnabledConfirm(true);
    var servers = await axios.get(apiUrls.server.getServersForTestApi + apiUrls.types.Cisco);
    var tmp = [];
    servers.data.name.map((item) => {
      tmp.push(item);
    });
    setSelectedServer(tmp[0].servercode);
    setServers(tmp);
  }

  function validateEmail(email) {
    if (email == undefined || email == "" || !isEmail(email)) {
      setError({
        isValid: false,
        errosMsg: "فرمت ایمیل صحیح نمی باشد."
      });

      return false;
    } else {

      setError({
        isValid: true,
        errosMsg: ""
      });

    }

    return true;
  }

  async function GetTestAccount(e) {
    e.preventDefault();
    if (profileSelector.isLoggedIn == false) {
      if (validateEmail(email) == false)
        return;
    }

    setIsEnabledConfirm(true);

    var isUserValid = (await axios.get(apiUrls.testAccountsUrls.isvalid + email + "&type=" + apiUrls.types.Cisco+"&servercode="+selectedServer)).data;

    if (isUserValid.name.isValid == true) {
      //بعد از اعتبارسنجی هایه بالا برای کاربر یک اکانت تستی درست می کنیم و به ایمیل او ارسال می کنیم.
      var generateAccount = (await axios.get(apiUrls.testAccountsUrls.gettestaccount + email + "&type=" + apiUrls.types.Cisco+"&servercode="+selectedServer+"&agentcode="+agentCode));
      setError({
        isValid: generateAccount.data.name.isValid,
        isValidShow: generateAccount.data.name.isValid,
        errosMsg: generateAccount.data.name.message
      });
    } else {
      setError({
        isValid: false,
        errosMsg: isUserValid.name.message
      });
    }
    setIsEnabledConfirm(false);
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={12} >
        <Card>
          <CardHeader title='دریافت اکانت تست ' titleTypographyProps={{ variant: 'h6' }} >
          </CardHeader>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={12}>
                <Alert severity="error">اطلاعات اکانت یک روزه به تست  به ایمیل شخصی شما به ازای هر سرور تنها برای یکبار ارسال میگردد. لطفا ایمیل معتبر و شخصی خود را وارد نمایید.</Alert>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="email"
                  disabled={isEnableEmail}
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth label='ایمیل' placeholder='وارد کردن ایمیل اجباری است' />
              </Grid>
              <Grid item xs={12} sm={12}>
                  {
                    servers.length > 0 &&
                    <Select
                      name="plantType"
                      label='انتخاب سرور'
                      defaultValue={selectedServer}
                      onChange={(e) => { setSelectedServer(e.target.value) }}
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                    >
                      {
                        servers.map((item, index) => (
                          <MenuItem key={index} value={item.servercode}>{item.title}</MenuItem>
                        ))
                      }
                    </Select>
                  }
              </Grid>


              <Grid item xs={12} sm={12}>
                {
                  (error.isValid == false) &&
                  <Alert severity="error">{error.errosMsg}</Alert>
                }
                {
                  (error.isValidShow == true) &&
                  <Alert severity="success">{error.errosMsg}</Alert>
                }
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button disabled={isEnabledConfirm} size='large' onClick={GetTestAccount} type='submit' sx={{ mr: 2 }} variant='contained'>
              دریافت اکانت تست
            </Button>
          </CardActions>
        </Card>
      </Grid>

    </Grid>
  )
}

export default index
