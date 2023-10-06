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
import { Profilestatus } from 'src/redux/actions/profileActions';
import { ConvertToPersianDateTime } from 'src/lib/utils';
import EditIcon from 'src/views/iconImages/editicon';
import TextField from '@mui/material/TextField'
import { useSession } from 'next-auth/react';
import ConvertUsersComponent from 'src/pages/admin/Components/ConvertingUsersComponent';

const createData = (username, expires, userwithhub, type, typeTitle, removedFromServer, servertitle) => {
  return { username, expires, userwithhub, type, typeTitle, removedFromServer, servertitle }
}


const ChanginServerTable = (props) => {

  const { data: session, status } = useSession();
  const [usernameForSearch, setUserNameForSearch] = useState("");
  const [email, setEmail] = useState();
  const [rows, setRows] = useState([]);
  const [mainRows, setMainRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [profileSelector, setProfileSelector] = useState({
    isLoggedIn: false
  });

  useEffect(async () => {

    if (status === "authenticated") {
      setProfileSelector({
        email: session.user.email,
        isLoggedIn: true
      });
      await GetUsersData();
    }
  }, [status])

  const [errors, setErrors] = useState({
    hasError: false,
    errorMsg: ""
  })

  useEffect(async () => {
    if (props.LoadingUsers == true) {
      GetUsersData();
    }
  }, [props])

  useEffect(async () => {

  }, []);

  async function GetUsersData() {
    setSelectedUser();
    var tmp = [];
    setRows([]);
    var usersAccounts = await axios.get(apiUrls.userUrl.getpurchasedUrl + session.user.email);
    usersAccounts.data.name.map((item, index) => {
      tmp.push(createData(item.username, item.expires, item.userwithhub, item.type, item.typeTitle, item.removedFromServer, item.servertitle));
    });

    setRows(tmp);
    setMainRows(tmp);
    setEmail(session.user.email)
  }

  async function BtnRefreshUserData(e) {
    e.preventDefault();
    setSelectedUser(null);
    props.RefreshUserDataHandler(e);
    GetUsersData();
  }

  const searchByUserNameHandler = (e) => {
    e.preventDefault();
    setUserNameForSearch(e.target.value);
    var tmp = [];
    var findedElements = mainRows.filter(item => item.username.toLowerCase().includes(e.target.value.toLowerCase()));
    setRows(findedElements);

  }

  async function ToggleActivateUserHandler(e) {
    e.preventDefault();
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    props.ToggleActivateUserHandler(row);
    await GetUsersData();
  }

  async function ConvertingHandler(e) {
    e.preventDefault();
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    setSelectedUser(row);
  }

  async function refreshConvertComponent(e) {
    setSelectedUser(null);
    await GetUsersData();
  }


  async function ChangeServerHandler(e) {
    e.preventDefault();
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    setSelectedUser(null);
    props.getUsersServerHandler(row);
    setRows([]);
  }

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
        <Grid item xs={12}>

          <Grid container spacing={6}>
            <Grid item xs={6}>
              <TextField name="username"
                type='input'
                value={usernameForSearch}
                onChange={searchByUserNameHandler}
                fullWidth label='نام کاربر' placeholder='جسجتو اکانت بر اساس نام کاربری' />
            </Grid>
            <Grid item xs={2}>
              <Button type='submit' sx={{ mr: 2 }} variant='contained' onClick={BtnRefreshUserData} size='small'>بازیابی مجدد</Button>
            </Grid>
          </Grid>
        </Grid>

        <Table stickyHeader sx={{ minWidth: 650, touchAction: 'manipulation' }} style={{ userSelect: 'none' }} aria-label='simple table'>
          <TableHead stickyHeader>
            <TableRow>
              <TableCell align='center'>نام اکانت</TableCell>
              <TableCell align='center'>نوع اکانت</TableCell>

              <TableCell align='center'>نام سرور</TableCell>
              <TableCell align='center'>تاریخ اعتبار</TableCell>
              <TableCell align='center'>وضعیت اکانت</TableCell>
              <TableCell align='center'>تغییر سرور</TableCell>
              <TableCell align='center'>تبدیل</TableCell>
              <TableCell align='center'>فعال/غیر فعال</TableCell>


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
                  {row.type == apiUrls.types.SoftEther ? row.userwithhub : row.username}
                </TableCell>
                <TableCell align='center' component='th' scope='row'>
                  {row.typeTitle}
                </TableCell>
                <TableCell align='center' component='th' scope='row'>
                  {row.servertitle}
                </TableCell>
                <TableCell align='center' component='th' scope='row'>
                  {ConvertToPersianDateTime(row.expires)}
                </TableCell>
                <TableCell align='center' component='th' scope='row'>
                  {row.removedFromServer == true ? "غیر فعال است" : "فعال است"}
                </TableCell>
                <TableCell align='center' component='th' scope='row'>
                  <div className="delete-img-con btn-for-select" style={{ cursor: 'pointer' }} row={JSON.stringify(row)} onClick={ChangeServerHandler}>

                    <Button type='submit' sx={{ mr: 2 }} variant='contained' size='small'>انتخاب سرور</Button>
                  </div>
                </TableCell>
                <TableCell align='center' component='th' scope='row'>
                  <div className="delete-img-con btn-for-select" style={{ cursor: 'pointer' }} row={JSON.stringify(row)} onClick={ConvertingHandler}>

                    <Button disabled={row.type == apiUrls.types.SoftEther} type='submit' sx={{ mr: 2 }} variant='contained' size='small'>تبدیل</Button>
                  </div>
                </TableCell>
                <TableCell align='center' component='th' scope='row'>
                  <div className="delete-img-con btn-for-select" style={{ cursor: 'pointer' }} row={JSON.stringify(row)} onClick={ToggleActivateUserHandler}>

                    <Button type='submit' sx={{ mr: 2 }} variant='contained' size='small'>{row.removedFromServer == false ? "غیر فعال" : "فعال کردن"}</Button>
                  </div>
                </TableCell>




              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {
              errors.errorMsg != '' &&
              <TableRow style={{ paddingLeft: '100px' }}>
                <div style={{ paddingRight: '30px', paddingTop: '30px', paddingBottom: '15px' }}>
                  <Alert severity="success">{errors.errorMsg}</Alert>
                </div>
              </TableRow>
            }

          </TableFooter>
        </Table>
      </TableContainer>

      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ConvertUsersComponent refreshComponent={refreshConvertComponent} selectedUser={selectedUser}></ConvertUsersComponent>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ChanginServerTable
