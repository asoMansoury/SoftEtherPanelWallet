// ** MUI Imports
import Grid from '@mui/material/Grid'
import { apiUrls } from 'src/configs/apiurls';

// ** Demo Components Imports
import { useEffect } from 'react';
import { useState } from 'react';
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools';
import { Button, Input } from '@mui/material';
import TableContainer from '@mui/material/TableContainer'
const PlansComponent = (props) => {

  // const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    setPlans(props.plans);
  }, [props])

  function changePrice(e, row) {
    const updatedPlans = plans.map((plan) => {
      if (plan.tariffplancode === row.tariffplancode &&
        plan.tarrifcode === row.tarrifcode &&
        plan.type === row.type) {
        return {
          ...plan,
          agentprice: parseInt(e.target.value),
        };
      }
      return plan;
    });

    setPlans(updatedPlans);
  }


  async function btnSubmit(e) {
    e.preventDefault();
    props.getAgentPlansFunc();
    const result = await axios.post(apiUrls.agentUrl.registerAgentPrice, { plans: plans });
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableContainer sx={{ maxHeight: 800, overflow: 'scroll', touchAction: 'pan-y' }}>
            <Table stickyHeader sx={{ minWidth: 650 }} style={{ userSelect: 'none' }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>نوع اکانت</TableCell>
                  <TableCell align='center'>تعداد کاربر</TableCell>
                  <TableCell align='center'>زمان کاربر</TableCell>
                  <TableCell align='center'>قیمت فروش به شما(تومان)</TableCell>
                  <TableCell align='center'>قیمت فروش شما به کاربران(تومان)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      '&:last-of-type td, &:last-of-type th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell align='center' component='th' scope='row'>
                      {
                        row.type === apiUrls.types.SoftEther ? <span>وی پی ان ایران</span> : <span>سیسکو</span>
                      }
                    </TableCell>
                    <TableCell align='center' component='th' scope='row'>
                      <span>{row.tariffTitle}</span>
                    </TableCell>
                    <TableCell align='center' component='th' scope='row'>
                      <span>{row.plantitle}</span>
                    </TableCell>
                    <TableCell align='center' component='th' scope='row'>
                      <span>{addCommas(digitsEnToFa(row.price))}</span>
                    </TableCell>
                    <TableCell align='center' component='th' scope='row'>
                      <div row={JSON.stringify(row)}>
                        <Input onChange={(e) => changePrice(e, row)} defaultValue={row.agentprice}></Input>
                        <span >{addCommas(digitsEnToFa(row.agentprice))} تومان</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow style={{ paddingLeft: '100px' }}>
                  <Button size='large' sx={{ mr: 2 }} variant='contained' onClick={btnSubmit}>ثبت تغییرات</Button>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PlansComponent
