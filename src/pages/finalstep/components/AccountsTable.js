// ** MUI Imports
import { Alert } from '@mui/material';
import { TableContainer, TableHead, Paper, TableRow, TableCell, TableBody, TableFooter, Table } from '@mui/material'
import { useEffect, useState } from 'react'
import { digitsEnToFa, addCommas } from "@persian-tools/persian-tools";
import DownloadIcon from 'src/views/iconImages/DownloadIcon'
import Typography from '@mui/material/Typography'
import { apiUrls } from 'src/configs/apiurls';

const columns = [
  { id: 'username', align: 'right', label: 'نام کاربری', minWidth: 100 },
  { id: 'password', align: 'right', label: 'کلمه عبور', minWidth: 100 },
  {
    id: 'expires',
    label: 'تاریخ اعتبار',
    minWidth: 120,
    align: 'right',
    format: value => value.toLocaleString('en-US')
  },
  {
    id: 'ovpnurl',
    label: 'دانلود فایل کانفیگ',
    minWidth: 120,
    align: 'right',
  }
]




const AccountsTable = (props) => {
  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState([]);
  const [basket, setBasket] = useState();
  useEffect(() => {
    if (props.users != undefined) {
      // props.users.map((item,index)=>{
      //   item.expires = ConvertToPersianDateTime(item.expires);
      // })
      setData(props.users);
    }

    if (props.basket != undefined) {
      setBasket(props.basket);
    }
  }, [props])

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead style={{ fontWeight: 'bold', fontSize: '18px' }}>
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
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    const value = row[column.id];

                    if (column.id == "ovpnurl" && row.type == apiUrls.types.OpenVpn) {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <a className="download-img-con btn-for-select" target="_blank" rel="noreferrer" href={value} >
                            <DownloadIcon></DownloadIcon>
                            <div>
                              <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                دانلود فایل کانفیگ
                              </Typography>
                            </div>
                          </a>
                        </TableCell>
                      )
                    } else {
                      if (column.id == "ovpnurl") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {row.ciscourl}
                          </TableCell>
                        )
                      } else {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        )
                      }

                    }
                  })}
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              {
                basket &&
                <div style={{ paddingRight: '30px', paddingTop: '30px', paddingBottom: '15px' }}>
                  <Alert severity="success"> جمع مبلغ:  {addCommas(digitsEnToFa(basket.price.toString()))} تومان</Alert>
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
