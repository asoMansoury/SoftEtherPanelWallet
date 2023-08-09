// ** MUI Imports
import Grid from '@mui/material/Grid'
import FormLayoutTypeBasket from 'src/views/baskets/FormLayoutTypeBasket'
import { apiUrls } from 'src/configs/apiurls';

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
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Profilestatus } from 'src/redux/actions/profileActions';
import { ConvertToPersianDateTime } from 'src/lib/utils';
import TablePagination from '@mui/material/TablePagination';
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import { useSession } from 'next-auth/react';

const createData = (username, expires,type,userwithhub) => {
    return { username, expires,type,userwithhub }
  }

  
const UsersPurchasedTable = () => {

  // const dispatch = useDispatch();
  const [usernameForSearch,setUserNameForSearch] = useState("");
  const [email,setEmail] = useState();
  const [rows,setRows] = useState([]);
  const [mainRows,setMainRows] = useState([]);
  const {  data:session,status } = useSession();
  const [profileSelector,setProfileSelector] = useState({
    isLoggedIn:false
  });
  const [errors,setErrors]= useState({
    hasError:false,
    errorMsg:""
  })


  useEffect(async()=>{

    if(status ==="authenticated"){
      setProfileSelector({
        email:session.user.email,
        isLoggedIn:true
      });

      var tmp = [];
      var usersAccounts =await axios.get(apiUrls.userUrl.getpurchasedUrl+session.user.email);
      usersAccounts.data.name.map((item,index)=>{
          tmp.push(createData(item.username,item.expires,item.type,item.userwithhub));
      })
      setRows(tmp);
      setMainRows(tmp)
      setEmail(session.user.email)
    }
  },[status])

  

  async function sentToEmailHandler(e){
    e.preventDefault();
    setErrors({
      errorMsg: ""
    })
    var sendToEmail =await axios.get(apiUrls.userUrl.senToEmailUrl+profileSelector.email);
    setErrors({
      errorMsg: sendToEmail.data.name
    })
  }

  const searchByUserNameHandler =(e)=>{
    e.preventDefault();
    setUserNameForSearch(e.target.value);
    var tmp = [];
    var findedElements = mainRows.filter(item => item.username.toLowerCase().includes(e.target.value.toLowerCase()));
    setRows(findedElements);
    
  }


  return (
  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
    <Grid item xs={12}>
        <Card>
          <Grid container spacing={6} style={{marginTop:'8px'}}>
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
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>نام اکانت</TableCell>
            <TableCell align='center'>تاریخ اعتبار</TableCell>
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
                {row.type==apiUrls.types.SoftEther?row.userwithhub: row.username}
              </TableCell>
              <TableCell align='center' component='th' scope='row'>
                {ConvertToPersianDateTime(row.expires)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          {
            errors.errorMsg!=''&&
            <TableRow style={{paddingLeft:'100px'}}>
                <div style={{paddingRight:'30px', paddingTop:'30px',paddingBottom: '15px'}}>
                      <Alert severity="success">{errors.errorMsg}</Alert>
                </div>
            </TableRow>
          }

          <TableRow style={{paddingLeft:'100px'}}>
              <div style={{paddingRight:'30px', paddingTop:'30px',paddingBottom: '15px'}}>
                <Button onClick={sentToEmailHandler}>ارسال به ایمیل</Button>
              </div>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  </Paper>
  )
}

export default UsersPurchasedTable
