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
import { Profilestatus } from 'src/redux/actions/profileActions';
import UsersPurchasedTable from './components/usersPurchasedTable';
import RevokeSelectedUser from './components/RevokeSelectedUser';
import {Button,Alert} from '@mui/material/';
import { useSession } from 'next-auth/react';
import CopyToClipboard from 'react-copy-to-clipboard';

const index = () => {

  // const dispatch = useDispatch();
  const [isShowRevokePage,setIsShowRevokePage] = useState(false);
  const [isShowSuccess,setIsShowSuccess] = useState(false);
  const [selectedUser,setSelectedUser] = useState();
  const [revokedUserResult,setRevokedUserResult] = useState({
    type:apiUrls.types.Cisco
  });
  const {  data:session,status } = useSession();
  const [profileSelector,setProfileSelector] = useState({
    isLoggedIn:false
  });

  useEffect(async()=>{
    if(status ==="authenticated"){
      console.log(session);
      setProfileSelector({
        email:session.user.email,
        isAgent:session.user.isAgent,
        isLoggedIn:true
      });
    }
  },[status])

  function RevokeUserHandler(row){
    setSelectedUser(row);
    setIsShowRevokePage(true);
  }
  
  function FinishRevokingHandler(result){
    setIsShowRevokePage(false);
    setIsShowSuccess(true);
    setRevokedUserResult(result);
  }
  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
                <CardHeader title='اکانت های خریداری شده توسط شما' titleTypographyProps={{ variant: 'h6' }} />
                <UsersPurchasedTable RevokeUserHandler={RevokeUserHandler}/>
                {
                  isShowSuccess && 
                    <div style={{paddingRight:'30px', paddingTop:'30px',paddingBottom: '15px'}}>
                      {
                        revokedUserResult.type != apiUrls.types.VpnHood ?<Alert severity="success">عملیات با موفقیت انجام گردید.</Alert>:
                        <CopyToClipboard
                            text={revokedUserResult.generatedToken}
                           onCopy={() => alert("کپی شد")}>
                          <Alert severity='success'>برای کپی کد کلیک کنید.</Alert>
                    </CopyToClipboard>
                      }
                    </div>
                }

                {isShowRevokePage && 
                        <RevokeSelectedUser profileSelector={profileSelector} FinishRevokingHandler={FinishRevokingHandler} selectedUser={selectedUser}></RevokeSelectedUser>
                }
            </Card>
        </Grid>
  </Grid>
  )
}

export default index
