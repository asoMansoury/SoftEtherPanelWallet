// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { useEffect } from 'react';
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import UsersPurchasedTable from './components/usersPurchasedTable';

const PurchasedAccounts = () => {

  useEffect(async ()=>{
  },[]);


  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
                <CardHeader title='اکانت های خریداری شده توسط شما' titleTypographyProps={{ variant: 'h6' }} />
                <UsersPurchasedTable />
                
            </Card>
        </Grid>
  </Grid>
  )
}

export default PurchasedAccounts
