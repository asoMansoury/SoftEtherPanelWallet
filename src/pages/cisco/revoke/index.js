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

const index = () => {

  // const dispatch = useDispatch();
  const [isShowRevokePage,setIsShowRevokePage] = useState(false);
  const [selectedUser,setSelectedUser] = useState();

  function RevokeUserHandler(row){
    setSelectedUser(row);
    setIsShowRevokePage(true);
  }
  
  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
                <CardHeader title='اکانت های خریداری شده توسط شما' titleTypographyProps={{ variant: 'h6' }} />
                <UsersPurchasedTable RevokeUserHandler={RevokeUserHandler}/>
                {isShowRevokePage && 
                        <RevokeSelectedUser selectedUser={selectedUser}></RevokeSelectedUser>
                }
            </Card>
        </Grid>
  </Grid>
  )
}

export default index
