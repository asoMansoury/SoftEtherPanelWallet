
// ** Demo Components Imports
import { useEffect,useState } from 'react';
import Paper from '@mui/material/Paper'
import {Alert} from '@mui/material/'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableContainer from '@mui/material/TableContainer'
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from 'src/views/iconImages/editicon';
import { useSession } from 'next-auth/react';
import { apiUrls } from 'src/configs/apiurls';
import DownloadServerLink from './DownloadServerLink';

  
const LoadinServerForChange = (props) => {
  
  // const dispatch = useDispatch();
  const [email,setEmail] = useState();
  const [rows,setRows] = useState([]);
  const {  data:session,status } = useSession();
  const [profileSelector,setProfileSelector] = useState({
    isLoggedIn:false
  });
 

  const [errors,setErrors]= useState({
    hasError:false,
    errorMsg:""
  });

  useEffect(async()=>{
    
    if(status ==="authenticated"){
      setProfileSelector({
        email:session.user.email,
        isLoggedIn:true
      });
    }
  },[status])
  
  useEffect(async ()=>{

    setRows(props.servers);
    setEmail(profileSelector.email)
  },[props]);

  async function ChangeServerHandler(e){
    e.preventDefault();
    let row = JSON.parse(e.currentTarget.getAttribute('row'));
    props.changeServerHandler(row);

  }
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label='لطفا از سرورهای زیر انتخاب نمایید.'>
      <TableHead>
        <TableRow>
          <TableCell align='center'>عنوان سرور</TableCell>
          <TableCell align='center'>توضیحات سرور</TableCell>
          <TableCell align='center'>کانفیگ سرور</TableCell>
          <TableCell align='center'>انتقال به سرور</TableCell>
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
              {row.title}
            </TableCell>
            <TableCell align='center' component='th' scope='row'>
                {row.description}
            </TableCell>

            <TableCell align='center' component='th' scope='row'>
              {
                <DownloadServerLink row={row}></DownloadServerLink>
              }
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

export default LoadinServerForChange
