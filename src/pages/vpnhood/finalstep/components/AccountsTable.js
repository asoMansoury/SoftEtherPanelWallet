// ** MUI Imports
import {Alert} from '@mui/material';
import {TableContainer,TableHead,Paper,TableRow ,TableCell ,TableBody,TableFooter,Table} from '@mui/material'
import { useEffect,useState } from 'react'
import { digitsEnToFa,addCommas } from "@persian-tools/persian-tools";
import { ConvertToPersianDateTime } from 'src/lib/utils';
import CopyToClipboard from 'react-copy-to-clipboard';


const columns = [
  { id: 'username',    align: 'right', label: 'نام کاربری', minWidth: 100 },
  { id: 'password',    align: 'right', label: 'کلمه عبور', minWidth: 100 },
  { id: 'token',    align: 'right', label: 'آدرس سرور', minWidth: 100 },
  {
    id: 'expires',
    label: 'تاریخ اعتبار',
    minWidth: 120,
    align: 'right',
    format: value => value.toLocaleString('en-US')
  }
]





const AccountsTable = (props) => {
  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState([]);
  const [basket,setBasket] = useState();
  const [price,setPrice]= useState(0);
  useEffect(()=>{
    if(props.users!=undefined) {
      // props.users.map((item,index)=>{
      //   item.expires = ConvertToPersianDateTime(item.expires);
      // })
      setData(props.users);
    } 

    if(props.basket!=undefined) {
      setBasket(props.basket);
      if(props.basket.isFromAgent){
        setPrice(props.basket.agentPrice)
      }else{
        setPrice(props.basket.price)
      }
    }
  },[props])
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead style={{fontWeight:'bold', fontSize:'18px'}}>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow  hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    if(column.id==="token"){
                      const value = row[column.id];

                      return ( 
                        <TableCell key={column.id} align={column.align}>
                          <CopyToClipboard
                                            text={value}
                                            onCopy={() => alert("کپی شد")}>
                                            <Alert severity='info'>کلیک کنید.</Alert>
                                        </CopyToClipboard>
                        </TableCell>
                      )
                    }
                    else{
                      const value = row[column.id];

                      return ( 
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      )
                    }

                  })}
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              {
                basket&&
                  <div style={{paddingRight:'30px', paddingTop:'30px',paddingBottom: '15px'}}>
                    <Alert severity="success"> جمع مبلغ:  {addCommas(digitsEnToFa(price.toString()))} تومان</Alert>
                </div>
              }
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default AccountsTable
