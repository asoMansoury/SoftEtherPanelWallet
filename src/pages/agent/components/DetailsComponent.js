
// ** Demo Components Imports
import { useEffect,useState } from 'react';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useSelector } from 'react-redux';

  
const DetailsComponent = (props) => {

  const profileSelector = useSelector(state => state.Profile.ProfileData);
  const [rows,setRows] = useState([]);

  useEffect(async ()=>{
    setRows(props.users.userRegistered);
  },[props]);



  return (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
      <TableHead>
        <TableRow>
          <TableCell align='center'>نام کاربر</TableCell>
          <TableCell align='center'>تاریخ انقضا</TableCell>
          <TableCell align='center'>ایمیل کاربر</TableCell>
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
              {row.username}
            </TableCell>
            <TableCell align='center' component='th' scope='row'>
                {row.expires}
            </TableCell>
            <TableCell align='center' component='th' scope='row'>
                {row.email}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  )
}

export default DetailsComponent
