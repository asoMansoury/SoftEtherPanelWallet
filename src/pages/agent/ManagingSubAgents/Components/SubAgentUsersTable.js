// ** MUI Imports
import Grid from '@mui/material/Grid'
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
import { ConvertToPersianDateTime } from 'src/lib/utils';
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import EditIcon from 'src/views/iconImages/editicon';
import { useSession } from 'next-auth/react';

const createData = (username, typeTitle, expires, removedFromServer) => {
  return { username, typeTitle, expires, removedFromServer }
}


const SubAgentUsersTable = (props) => {

  // const dispatch = useDispatch();
  const [usernameForSearch, setUserNameForSearch] = useState("");
  const [email, setEmail] = useState();
  const [rows, setRows] = useState([]);
  const [mainRows, setMainRows] = useState([]);

  const [error, setError] = useState({
    isValid: true,
    errosMsg: "",
    severity: "error"
  })

  useEffect(async () => {

    await GetUsersData(props.email);

  }, [])
  const [loading, setLoading] = useState(false);

  const GetUsersData = async (email) => {
    var tmp = [];
    setRows([]);
    setLoading(true);
    var usersAccounts = await axios.get(apiUrls.userUrl.getsubagentpurchasedUrl + email);
    // getsubagentpurchasedUrl
    usersAccounts.data.name.map((item, index) => {
      tmp.push(createData(item.username, item.typeTitle, item.expires, item.removedFromServer));
    })
    setRows(tmp);
    setMainRows(tmp)
    setEmail(email);
    setLoading(false);
  }



  const searchByUserNameHandler = (e) => {
    e.preventDefault();
    setUserNameForSearch(e.target.value);
    var tmp = [];
    var findedElements = mainRows.filter(item => item.username.toLowerCase().includes(e.target.value.toLowerCase()));
    setRows(findedElements);

  }


  const btnManageUserHandler = async (e) => {
    e.preventDefault();
    setError({
      isValid: true,
      errosMsg: "",
      severity: "success"
    })
    setLoading(true);
    var tmpRow = rows;
    setRows([]);
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    const result = await axios.get(apiUrls.userUrl.TogglingUserConnectionUrl + email + "&username=" + row.username)
    if (result.data.name.isValid == false) {
      setRows(tmpRow);
      setError({
        isValid: false,
        errosMsg: result.data.name.errosMsg,
        severity: "error"
      })
    } else {
      GetUsersData(email);
    }
    setLoading(false);
  }


  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>

      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Grid item xs={12}>
          {
            error.isValid == false ? (
              <Alert severity='error'>{error.errosMsg}</Alert>
            ) : <></>
          }
        </Grid>
        <Grid item xs={12}>
          <Card>
            {
              loading &&
              <Alert severity="info">در حال بارگزاری اطلاعات لطفا منتظر بمانید...</Alert>
            }
            <Grid container spacing={6}>
              <Grid item xs={3}></Grid>
              <Grid item xs={6}>
                <TextField name="username"
                  type='input'
                  value={usernameForSearch}
                  onChange={searchByUserNameHandler}
                  fullWidth label='نام کاربر' placeholder='جسجتو اکانت بر اساس نام کاربری' />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <TableContainer component={Paper} sx={{ maxHeight: 800, overflow: 'scroll', touchAction: 'manipulation' }}>
          <Table stickyHeader sx={{ minWidth: 650 }} style={{ userSelect: 'none',touchAction: 'manipulation' }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '40px' }} align='center'>نوع اکانت</TableCell>
                <TableCell style={{ width: '80px' }} align='center'>نام اکانت</TableCell>
                <TableCell style={{ width: '120px' }} align='center'>تاریخ اعتبار</TableCell>
                <TableCell style={{ width: '80px' }} align='center'>وضعیت اکانت</TableCell>
                <TableCell style={{ width: '120px' }} align='center'>عملیات</TableCell>
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
                  <TableCell style={{ width: '40px' }} align='center' component='th' scope='row'>
                    {row.typeTitle}
                  </TableCell>
                  <TableCell style={{ width: '80px' }} align='center' component='th' scope='row'>
                    {row.username}
                  </TableCell>

                  <TableCell style={{ width: '120px' }} align='center' component='th' scope='row'>
                    {ConvertToPersianDateTime(row.expires)}
                  </TableCell>
                  <TableCell style={{ width: '80px' }}>{row.removedFromServer == true ? "غیر فعال" : "فعال"}</TableCell>
                  <TableCell style={{ width: '150px' }} align='center' component='th' scope='row'>
                    <div className="delete-img-con btn-for-select" style={{ cursor: 'pointer', minWidth: '80px' }} row={JSON.stringify(row)} onClick={btnManageUserHandler}>
                      <span style={{ fontWeight: 'bolder', color: 'blue', cursor: 'pointer' }}>{row.removedFromServer == false ? "غیر فعال کردن" : "فعال کردن"}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TableContainer>
    </Paper>
  )
}

export default SubAgentUsersTable
