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
import ConvertUsersComponent from 'src/pages/admin/Components/ConvertingUsersComponent';
import UserDetail from './UserDetail';

const createData = (username, typeTitle, expires, removedFromServer, servertitle, type) => {
  return { username, typeTitle, expires, removedFromServer, servertitle, type }
}


const AgentUsersTable = (props) => {

  // const dispatch = useDispatch();
  const [usernameForSearch, setUserNameForSearch] = useState("");
  const [email, setEmail] = useState();
  const [rows, setRows] = useState([]);
  const [mainRows, setMainRows] = useState([]);
  const [selectUser, setSelectUser] = useState();
  const [userDetail,setUserDetail] = useState({
    isUserLoaded:false,
    email:"",
    password:""
  })
  const [error, setError] = useState({
    isValid: true,
    errosMsg: "",
    severity: "error"
  })

  useEffect(async () => {
    if (props != undefined) {
      setEmail(props.email);
      await GetUsersData(props.email);
    }
  }, [])
  const [loading, setLoading] = useState(false);

  const GetUsersData = async (email) => {
    ClearForm();
    var tmp = [];
    setRows([]);
    setLoading(true);
    var usersAccounts = await axios.get(apiUrls.userUrl.getsubagentpurchasedUrl + email);
    // getsubagentpurchasedUrl
    usersAccounts.data.name.map((item, index) => {
      tmp.push(createData(item.username, item.typeTitle, item.expires, item.removedFromServer, item.servertitle, item.type));
    })
    setRows(tmp);
    setMainRows(tmp)
    setEmail(email);
    setLoading(false);
  }

function ClearForm(){
  setUserDetail({
    isUserLoaded:false,
    email:"",
    password:""
  })
}

  const searchByUserNameHandler = (e) => {
    e.preventDefault();
    ClearForm();
    setUserNameForSearch(e.target.value);
    var tmp = [];
    var findedElements = mainRows.filter(item => item.username.toLowerCase().includes(e.target.value.toLowerCase()));
    setRows(findedElements);

  }


  const btnManageUserHandler = async (e) => {
    e.preventDefault();
    ClearForm();
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

  const btnConvertUsersHandler = async (e) => {
    e.preventDefault();
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    setSelectUser(row);
  }

  async function refreshConvertComponent(e) {
    e.preventDefault();
    setSelectUser(null);
    GetUsersData(email);
    ClearForm();
  }

  const btnUserDetailHandler = async (e) => {
    e.preventDefault();
    setError({
      isValid: true,
      errosMsg: "",
      severity: "success"
    })
    setLoading(true);
    ClearForm();
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    const result = await axios.get(apiUrls.userUrl.ShowUserDetailUrl +  row.username)
    if (result.data.isValid == false) {
      setError({
        isValid: false,
        errosMsg: result.data.errorMsg,
        severity: "error"
      })
    } else {
      setUserDetail({
        isUserLoaded:true,
        email:result.data.userBasket.email,
        password:result.data.userBasket.password
      })
    }
    setLoading(false);
  }

  async function btnLoadingUsers(e) {
   await GetUsersData(email);

  }
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
              <TextField name="username"
                type='input'
                value={usernameForSearch}
                onChange={searchByUserNameHandler}
                fullWidth label='نام کاربر' placeholder='جسجتو اکانت بر اساس نام کاربری' />
            </Grid>
            <Grid item xs={2}>
              <Button size='small' onClick={btnLoadingUsers} type='submit' sx={{ mr: 2 }} variant='contained'>
                دریافت اطلاعات
              </Button>

            </Grid>
          </Grid>
        </Card>
      </Grid>
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
      }} style={{ userSelect: 'none' }} >
        <Table sx={{ minWidth: 400, touchAction: 'manipulation' }} style={{ userSelect: 'none' }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '40px' }} align='center'>نوع اکانت</TableCell>
              <TableCell style={{ width: '80px' }} align='center'>نام اکانت</TableCell>
              <TableCell style={{ width: '80px' }} align='center'>نام سرور</TableCell>
              <TableCell style={{ width: '120px' }} align='center'>تاریخ اعتبار</TableCell>
              <TableCell style={{ width: '80px' }} align='center'>وضعیت اکانت</TableCell>
              <TableCell style={{ width: '120px' }} align='center'>عملیات</TableCell>
              <TableCell style={{ width: '120px' }} align='center'>تبدیل</TableCell>
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
                <TableCell style={{ width: '80px' }} align='center' component='th' scope='row'>
                  {row.servertitle}
                </TableCell>
                <TableCell style={{ width: '120px' }} align='center' component='th' scope='row'>
                  {ConvertToPersianDateTime(row.expires)}
                </TableCell>
                <TableCell style={{ width: '80px' }}>{row.removedFromServer == true ? "غیر فعال" : "فعال"}</TableCell>
                <TableCell style={{ width: '150px' }} align='center' component='th' scope='row'>
                  <div className="delete-img-con btn-for-select" style={{ cursor: 'pointer', minWidth: '80px' }} row={JSON.stringify(row)} onClick={btnUserDetailHandler}>
                    <span style={{ fontWeight: 'bolder', color: 'blue', cursor: 'pointer' }}>نمایش جزئیات</span>
                  </div>
                </TableCell>
                <TableCell style={{ width: '150px' }} align='center' component='th' scope='row'>
                  <div className="delete-img-con btn-for-select" style={{ cursor: 'pointer', minWidth: '80px' }} row={JSON.stringify(row)} onClick={btnManageUserHandler}>
                    <span style={{ fontWeight: 'bolder', color: 'blue', cursor: 'pointer' }}>{row.removedFromServer == false ? "غیر فعال کردن" : "فعال کردن"}</span>
                  </div>
                </TableCell>
                <TableCell style={{ width: '150px' }} align='center' component='th' scope='row'>
                  <div className="delete-img-con btn-for-select" style={{ cursor: 'pointer', minWidth: '80px' }} row={JSON.stringify(row)} onClick={btnConvertUsersHandler}>
                    <span style={{ fontWeight: 'bolder', color: 'blue', cursor: 'pointer' }}>تبدیل اکانت</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid item xs={12}>
        <Card>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <ConvertUsersComponent refreshComponent={refreshConvertComponent} selectedUser={selectUser}></ConvertUsersComponent>
            </Grid>
            <Grid item xs={12}>
              <UserDetail userDetail={userDetail}></UserDetail>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Paper>
  )
}

export default AgentUsersTable
