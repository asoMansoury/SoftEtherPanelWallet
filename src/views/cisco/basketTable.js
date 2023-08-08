// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination';
import { Alert, TableFooter } from '@mui/material';
import { useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import deleteIcon from '../iconImages/deleteIcon.svg'
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools'
import DeleteIcon from '../iconImages/deleteicon'


const columns = [
  {id:"rowNum",align:"center", label:'شناسه رکورد'},
  { id: 'tariffTitle',    align: 'right', label: 'نوع کاربر', minWidth: 100 },
  { id: 'tariffPlanTitle',    align: 'right', label: 'تعداد ماه', minWidth: 100 },
  {
    id: 'price',
    label: 'قیمت',
    minWidth: 120,
    align: 'right',
    format: value => value.toLocaleString('en-US')
  },
  {
    id:'tariffCode',
    label:'کد کاربر'
  },
  {
      id:'tariffPlanCode',
      label:'کد پلن'
  }
]
function createData(tariffTitle,tariffPlanTitle, price,tariffCode,tariffPlanCode,rowNum) {
  return { tariffTitle, tariffPlanTitle, price,tariffCode,tariffPlanCode,rowNum }
}




const BasketTable = (props) => {
  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState([]);
  const [totalPrice,setTotalPrice]=useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0);
  }

  const dataHandler =(selectedPlans)=>{
    setData([]);
    var tmp = [];
    selectedPlans.map((item,index)=>{
      tmp.push(createData(item.tariffTitle, item.tariffPlanTitle, item.price,item.tariffCode,item.tariffPlanCode,item.rowNum));
    });
    setData(tmp);
    setRowsPerPage(selectedPlans.length);
    
    const price = tmp.map(item => item.price)
                                            .reduce((prev, curr) => prev + curr, 0);

    setTotalPrice(price);
  }

  const removeItem =(e)=>{
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    var indexOfItem= data.findIndex(z=>z.rowNum= row.rowNum);
    data.splice(indexOfItem, 1);
    dataHandler(data);
    props.removeItem(indexOfItem);
  }


  useEffect(()=>{
    dataHandler(props.parentData);
  },[props]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell>
                {"عملیات"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    const value = row[column.id];

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                  <TableCell >
                    <Tooltip arrow title='حذف اکانت از سبد' placement='top'>
                      <Card>
                          <CardContent  sx={{ display: 'flex', left:0,justifyContent:'center' }}>
                          <div className="delete-img-con btn-for-select" style={{cursor:'pointer'}} row={JSON.stringify(row)} onClick={removeItem}><DeleteIcon></DeleteIcon></div>
                          </CardContent>
                      </Card>
                    </Tooltip >
                    </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              {
                (data&&data.length>0)&&
                <div style={{display:'flex',paddingRight:'30px', paddingTop:'30px'}}>
                  <Alert severity="success">جمع مبلغ: </Alert>
                  <Alert severity="error">{addCommas(digitsEnToFa(totalPrice.toString()))} تومان</Alert>
                </div>
              }

            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default BasketTable
