// ** MUI Imports
import Grid from '@mui/material/Grid'
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
import CardActions from '@mui/material/CardActions'
import { ConvertToPersianDateTime } from 'src/lib/utils';
import EditIcon from 'src/views/iconImages/editicon';
import TextField from '@mui/material/TextField'
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
const createData = (username, expires,userwithhub,type,typeTitle,password) => {
    return { username, expires ,userwithhub,type,typeTitle,password}
  }

  
const ChanginServerTable = (props) => {

  const [rows,setRows] = useState([]);
  const [mainRows,setMainRows] = useState([]);
  const [showLoadingProgress,setShowLoadingProgress]= useState(false)
  const [error,setError] = useState({
    isUserValid:true,
    userMsg:""
  });
  const [form,setForm]= useState({
    username:"",
    password:""
  })


  const [errors,setErrors]= useState({
    hasError:false,
    errorMsg:""
  })

  useEffect(async ()=>{
    
  },[]);

  async function ChangeServerHandler(e){
    e.preventDefault();
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    props.getUsersServerHandler(row);
  }

  async function FetchUserHandler(e){
    e.preventDefault();
    var tmp = [];
    var usersAccounts =await axios.get(apiUrls.userfreeUrls.GetUsersByUsername+form.username+"&password="+form.password);
    usersAccounts.data.name.map((item,index)=>{
        tmp.push(createData(item.username,item.expires,item.userwithhub,item.type,item.typeTitle,item.password));
    });

    setRows(tmp);
    setMainRows(tmp);
  }
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
    <Grid item xs={12}>

        <Grid container spacing={6}>
          <Grid item sm={6}>
            <TextField name="username" 
              type='input'
              onChange={(e)=>{setForm({
                ...form,
                username:e.target.value
              })}}  
              fullWidth label='نام کاربر' placeholder='نام کاربر را وارد نمایید.' />
          </Grid>
          <Grid item  sm={6}>
            <TextField name="username" 
              type='input'
              onChange={(e)=>{setForm({
                ...form,
                password:e.target.value
              })}}  
              fullWidth label='کلمه عبور' placeholder='کلمه عبور را وارد کنید' />
          </Grid>
        </Grid>

        <Grid container spacing={6}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
          {
          
            !(error.isUserValid) &&
                    error.userMsg!=""&&<Alert severity="error">{error.userMsg}</Alert>
          }
          <CardActions>
          {
              showLoadingProgress&&
              <div style={{display:'flex', justifyContent:'center'}}>
                  <CircularProgress></CircularProgress>
              </div>
            }
          <Button size='large' disabled={showLoadingProgress} onClick={FetchUserHandler} type='submit' sx={{ mr: 2 }} variant='contained'>
            دریافت اطلاعات
          </Button>
        </CardActions>
          </Grid>
        </Grid>

    </Grid>
    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
      <TableHead stickyHeader>
        <TableRow>
          <TableCell align='center'>نام اکانت</TableCell>
          <TableCell align='center'>تاریخ اعتبار</TableCell>
          <TableCell align='center'>تغییر سرور</TableCell>
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
              {row.type==apiUrls.types.SoftEther? row.userwithhub:row.username}
            </TableCell>
            <TableCell align='center' component='th' scope='row'>
              {ConvertToPersianDateTime(row.expires)}
            </TableCell>
            <TableCell align='center' component='th' scope='row'>
                <div className="delete-img-con btn-for-select" style={{cursor:'pointer'}} row={JSON.stringify(row)} onClick={ChangeServerHandler}>
                  <EditIcon></EditIcon>
                </div>
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

      </TableFooter>
    </Table>
  </TableContainer>
  </Paper>
  )
}

export default ChanginServerTable
