// ** Styled Component Import
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useEffect, useState } from 'react';

// ** Icons Imports
import CardAppleWatch from 'src/views/cards/CardAppleWatch';
import { useSession } from 'next-auth/react';
import { signIn,getProviders,getSession } from 'next-auth/react';

const Dashboard = () => {
  const [calledPush, setCalledPush] = useState(false);
  const router = useRouter();
  const {  status } = useSession()


  useEffect(async()=>{
    router.push('/OpenTunnel');
  })

  return (
    <ApexChartWrapper dir='rtl'>
          <Grid item xs={12} md={6} lg={4}>
            <Grid container spacing={6}>
              <Grid item xs={6}>
              </Grid>
          </Grid>
        </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
