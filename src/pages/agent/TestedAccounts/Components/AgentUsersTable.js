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
import select from 'src/@core/theme/overrides/select';
import RichEditorComponent from '../../components/RichEditorComponent';

const createData = (email, password, username, typeTitle, expires, removedFromServer, servertitle, type) => {
  return { email, username, password, typeTitle, expires, removedFromServer, servertitle, type }
}


const AgentUsersTable = (props) => {

  // const dispatch = useDispatch();
  const [usernameForSearch, setUserNameForSearch] = useState("");
  const [email, setEmail] = useState();
  const [rows, setRows] = useState([]);
  const [mainRows, setMainRows] = useState([]);
  const [selectUser, setSelectUser] = useState({
    isSelectedUser: false
  });
  const [userDetail, setUserDetail] = useState({
    isUserLoaded: false,
    email: "",
    password: ""
  })
  const [error, setError] = useState({
    isValid: true,
    errosMsg: "",
    severity: "error",
    isValidForEmail:false
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
    var usersAccounts = await axios.get(apiUrls.agentUrl.GetAgentTestAccountsUrl);
    // getsubagentpurchasedUrl
    usersAccounts.data.result.users.map((item, index) => {
      tmp.push(createData(item.email, item.password, item.username, item.typeTitle, item.expires, item.removedFromServer, item.servertitle, item.type));
    })
    setRows(tmp);
    setMainRows(tmp)
    setEmail(email);
    setLoading(false);
  }

  function ClearForm() {
    setUserDetail({
      isUserLoaded: false,
      email: "",
      password: ""
    });
    setSelectUser({
      isSelectedUser: false
    });
    setError({
      ...error,
      isValidForEmail:false
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

  const RefreshPageHandler = (e)=>{
    ClearForm();
    setError({
      ...error,
      isValidForEmail:true
    })
  }


  const btnSendingEmail = async (e) => {
    e.preventDefault();
    setError({
      isValid: true,
      errosMsg: "",
      severity: "success"
    })
    setLoading(true);
    ClearForm();
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    row.isSelectedUser = true;
    setSelectUser(row);
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
              <TableCell style={{ width: '40px' }} align='center'>ایمیل</TableCell>
              <TableCell style={{ width: '80px' }} align='center'>نام اکانت</TableCell>
              <TableCell style={{ width: '80px' }} align='center'>کلمه عبور</TableCell>
              <TableCell style={{ width: '80px' }} align='center'>نام سرور</TableCell>
              <TableCell style={{ width: '80px' }} align='center'>تاریخ اعتبار</TableCell>
              <TableCell style={{ width: '80px' }} align='center'>عملیات</TableCell>
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
                <TableCell style={{ maxWidth: '120px' }} align='center' component='th' scope='row'>
                  {row.email}
                </TableCell>
                <TableCell style={{ width: '80px' }} align='center' component='th' scope='row'>
                  {row.username}
                </TableCell>
                <TableCell style={{ width: '80px' }} align='center' component='th' scope='row'>
                  {row.password}
                </TableCell>
                <TableCell style={{ width: '80px' }} align='center' component='th' scope='row'>
                  {row.servertitle}
                </TableCell>
                <TableCell style={{ width: '80px' }}>{ConvertToPersianDateTime(row.expires)}</TableCell>
                <TableCell style={{ width: '80px' }} align='center' component='th' scope='row'>
                  <div className="delete-img-con btn-for-select" style={{ cursor: 'pointer', minWidth: '80px' }} row={JSON.stringify(row)} onClick={btnSendingEmail}>
                    <span style={{ fontWeight: 'bolder', color: 'blue', cursor: 'pointer' }}>ارسال ایمیل</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {error.isValidForEmail==true&&<Alert severity='success'>ایمیل ارسال گردید.</Alert>}
      {

        selectUser.isSelectedUser == true &&
        <>

          <RichEditorComponent RefreshPageHandler={RefreshPageHandler} email={selectUser.email}></RichEditorComponent>
        </>


      }

    </Paper>
  )
}

export default AgentUsersTable
