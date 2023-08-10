// ** Demo Components Imports
import { useEffect,useState } from 'react';
import Paper from '@mui/material/Paper'
import {Button,Alert} from '@mui/material/'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableContainer from '@mui/material/TableContainer'
import { addCommas ,digitsEnToFa,numberToWords} from '@persian-tools/persian-tools';
import DetailsComponent from './DetailsComponent';
import EditIcon from 'src/views/iconImages/editicon';

  
const AgentUsers = (props) => {

  // const dispatch = useDispatch();
  const [rows,setRows] = useState([]);
  const [selectedRow,setSelectedRow] = useState(null);
  const [totalPrice,setTotalPrice] = useState(0);
  
  useEffect(async ()=>{
    if(props.users!=undefined && props.users!= null) {
        let total = 0;
        const sum = props.users.reduce((accumulator,currentValue)=> accumulator + currentValue.debitToAgent,0);
        setTotalPrice(sum);
    }
    setRows(props.users);
    
  },[]);

  function showDetails(e){
    e.preventDefault();
    setSelectedRow(null);
    var rowObj = JSON.parse(e.currentTarget.getAttribute('row'));
    setSelectedRow(rowObj);
  }
  
  return (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
      <TableHead>
        <TableRow>
          <TableCell align='center'>پرداخت شده کاربر 'تومان'</TableCell>
          <TableCell align='center'> طلب شما 'تومان'</TableCell>
          <TableCell align='center'>کمیسیون فروش ادمین 'تومان'</TableCell>
          <TableCell align='center'>مشاهده جزئیات</TableCell>
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
              {digitsEnToFa(addCommas(row.agentPrice))}
            </TableCell>
            <TableCell align='center' component='th' scope='row'>
                {digitsEnToFa(addCommas(row.debitToAgent))}
            </TableCell>
            <TableCell align='center' component='th' scope='row'>
                {digitsEnToFa(addCommas(row.price))}
            </TableCell>
            <TableCell align='center' component='th' scope='row'>
                <div className="delete-img-con btn-for-select" style={{cursor:'pointer'}} row={JSON.stringify(row)} onClick={showDetails}>
                  <EditIcon></EditIcon>
                </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow style={{paddingLeft:'100px'}}>
            <div style={{paddingRight:'30px', paddingTop:'30px',paddingBottom: '15px'}}>
                    <Alert severity="success">طلب شما از مجموعه : {digitsEnToFa(addCommas(totalPrice))}  معادل {numberToWords(totalPrice)} تومان</Alert>
            </div>
        </TableRow>
      </TableFooter>
    </Table>
    <div style={{marginTop:'100px'}}></div>
    {
        selectedRow!=null &&
            <DetailsComponent users={selectedRow}></DetailsComponent>
    }
  </TableContainer>
  )
}

export default AgentUsers
