// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'


import { apiUrls } from 'src/configs/apiurls';

// ** Demo Components Imports
import { useEffect,useState } from 'react';
import Paper from '@mui/material/Paper'
import {Button,Alert} from '@mui/material/'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const SettleWithAgent = (props) => {

  // const dispatch = useDispatch();
  const [usernameForSearch,setUserNameForSearch] = useState("");
  const [rows,setRows] = useState([]);
  const [totalPrice,setTotalPrice]= useState(0);
  const [amountInvoice,setAmounInvoice]= useState(0);
  const [isDisabledCalculating,setDisabledCalculating] = useState(true);

  const [error,setErros]=useState({
    isShowAlarm:false,
    alarmMsg:''
  })

  useEffect(async ()=>{
    if(props!=undefined && props!= null){
      setRows(props.users);
      const sum = props.users.reduce((accumulator, currentValue) => accumulator + currentValue.debitToAgent, 0);
      setTotalPrice(sum);
    }
  },[props]);

function validaInputtetAmount(value){
    setErros({
        isShowAlarm:false,
        alarmMsg:""
    });
    if(value>totalPrice || value==0)
    {
        setErros({
            isShowAlarm:true,
            alarmMsg:"مبلغ تسویه شده درست وارد نشده است، لطفا مجددا چک نمایید."
        });

        return false;
    }
}

const agentPriceHandler =(e)=>{
    e.preventDefault();
    setDisabledCalculating(true);
    setAmounInvoice(e.target.value);
    if(validaInputtetAmount(e.target.value)==false)
        return;
    setDisabledCalculating(false);
}

const InvoiceWithAgentHandler = async (e)=>{
    e.preventDefault();
    if(validaInputtetAmount(amountInvoice)==false)
        return;
        
    setDisabledCalculating(true);
    
    var obj = {
        amountInvoice: amountInvoice,
        agentCode:props.agentCode
    }
    var result =await axios.get(apiUrls.AdminManagementUrls.InvoiceWithAgent+
                                obj.agentCode+"&amountInvoice="+obj.amountInvoice);
    setDisabledCalculating(false);
    props.AgentInvoiceHandler();
  }

  return (
  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Grid container spacing={6} style={{padding:'8px'}}>
        <Grid item xs={6}>
          <TextField name="username" 
            type='input'
             onChange={agentPriceHandler}
             defaultValue={0}
            fullWidth label='مبلغ تسویه' placeholder='مبلغ مورد نظر برای تسویه با نماینده فروش'/>
        </Grid>
        <Grid item xs={12}>
            {
                error.isShowAlarm && 
                    <div style={{paddingRight:'30px', paddingTop:'30px',paddingBottom: '15px'}}>
                        <Alert severity="error">{error.alarmMsg}</Alert>
                    </div>
            }

        </Grid >
        <Grid item xs={3}>
          <Button disabled={isDisabledCalculating}  size='large' onClick={InvoiceWithAgentHandler}   type='submit' sx={{ mr: 2 }} variant='contained'>
              تسویه با ایجنت
          </Button>
        </Grid >
      </Grid>
  </Paper>
  )
}

export default SettleWithAgent
