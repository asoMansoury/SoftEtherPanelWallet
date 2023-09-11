// ** MUI Imports
import Grid from '@mui/material/Grid'
import FormLayoutTypeBasket from 'src/views/baskets/FormLayoutTypeBasket'
import { apiUrls } from 'src/configs/apiurls';

// ** Demo Components Imports
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper'
import { Button, Alert } from '@mui/material/'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableContainer from '@mui/material/TableContainer'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Profilestatus } from 'src/redux/actions/profileActions';
import { ConvertToPersianDateTime } from 'src/lib/utils';
import TablePagination from '@mui/material/TablePagination';
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import { addCommas, digitsEnToFa, numberToWords } from '@persian-tools/persian-tools';

const createData = (username, expires, type, userwithhub) => {
  return { username, expires, type, userwithhub }
}


const UsersPurchasedTable = (props) => {

  // const dispatch = useDispatch();
  const [usernameForSearch, setUserNameForSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0)
  useEffect(async () => {
    if (props != undefined && props != null) {
      setRows(props.users);
      const sum = props.users.reduce((accumulator, currentValue) => accumulator + currentValue.debitToAgent, 0);
      setTotalPrice(sum);
    }
  }, [props]);




  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper} sx={{
        maxHeight: 440, overflowX: 'auto', scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '10px',
          height: '10px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '10px',
        }
      }}>
        <Table stickyHeader sx={{ minWidth: 650 }} style={{ userSelect: 'none' }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>پرداخت شده توسط مشتری(تومان)</TableCell>
              <TableCell align='center'>بدهی به نماینده فروش(تومان)</TableCell>
              <TableCell align='center'>کمیسیون شما(تومان)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow
                key={row.name}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell align='center' component='th' scope='row'>
                  {addCommas(digitsEnToFa(row.agentPrice))}
                </TableCell>
                <TableCell align='center' component='th' scope='row'>
                  {addCommas(digitsEnToFa(row.debitToAgent))}
                </TableCell>
                <TableCell align='center' component='th' scope='row'>
                  {addCommas(digitsEnToFa(row.price))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow style={{ paddingLeft: '100px' }}>
              <div style={{ paddingRight: '30px', paddingTop: '30px', paddingBottom: '15px' }}>
                <Alert severity="success">مجموع بدهی شما به نماینده فروش  {addCommas(digitsEnToFa(totalPrice))}  معادل {numberToWords(totalPrice)} تومان </Alert>
              </div>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default UsersPurchasedTable
