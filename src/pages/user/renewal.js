// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports

import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'

const RenewalAccount = () => {

  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
                <CardHeader title='Basic Table' titleTypographyProps={{ variant: 'h6' }} />
            </Card>
        </Grid>
  </Grid>
  )
}

export default RenewalAccount;
