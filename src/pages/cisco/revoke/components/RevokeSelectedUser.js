// ** MUI Imports
import Grid from '@mui/material/Grid'
import FormLayoutTypeBasket from 'src/views/baskets/FormLayoutTypeBasket'
import { apiUrls } from 'src/configs/apiurls';

// ** Demo Components Imports
import { useEffect,useState } from 'react';
import Paper from '@mui/material/Paper'
import {Button,Alert} from '@mui/material/'
import InputLabel from '@mui/material/InputLabel'
import FormControl  from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableContainer from '@mui/material/TableContainer'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Profilestatus } from 'src/redux/actions/profileActions';
import { ConvertToPersianDateTime } from 'src/lib/utils';
import EditIcon from 'src/views/iconImages/editicon';
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'
import { ConvertMonthFromAgentFormat } from 'src/views/baskets/basketUtils';
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools';
import CircularProgress from '@mui/material/CircularProgress';
import { v4 as uuidv4 } from 'uuid';
  
const RevokeSelectedUser = (props) => {

  // const dispatch = useDispatch();
  const [tariffs, setTariffs] = useState([]);
  const [calculatedTariff,setCalculatedTariff] = useState();
  const [months,setMonths] = useState([]);
  const [selectedTariffPlanCode,setSelectedTariffPlanCode] = useState();
  const [selectedUser,setSelectedUser] = useState();
  const [selectedUserBasket,setSelectedUserBasket] = useState();
  const [selectedPlanType,setSelectedPlanType]= useState();
  const [showLoadingProgress,setShowLoadingProgress]= useState(false)
  const [userName,setUserName] = useState("");
  const [expireUser,setExpireUser]= useState("2020/01/01");
  useEffect(async ()=>{
    if(props!=undefined && props.selectedUser!=undefined && props.selectedUser.username!=undefined){
      setUserName(props.selectedUser.username)
      GetUserInformation(props.selectedUser.username)
      setShowLoadingProgress(true);
      setExpireUser(props.selectedUser.expires);
    }

  },[props]);

  async function GetUserInformation(username){
    var userInformation = await axios.get(apiUrls.userUrl.getUserInformationUrl+username);
    setSelectedUser(userInformation.data.name);
    tariffPlansFunction(userInformation.data.name.type);
    var userBasketData = await axios.get(apiUrls.UserBasketUrls.getUserBasketByUserNameApi+userInformation.data.name.username);
    setSelectedUserBasket(userBasketData.data.name);
    
    var body ={
      username:username,
      uuid:userBasketData.data.name.uuid
    }
    var calculateUser = await axios.post(apiUrls.userUrl.calculateUserForRevokeRul,body);
    setCalculatedTariff(calculateUser.data.name);
    tariffTypeChangeHandler(userInformation.data.name.type);
    setSelectedTariffPlanCode(calculateUser.data.name.selectedTarifPlan.tariffplancode);
  }

  useEffect(()=>{
    if(calculatedTariff!=undefined&&selectedUser!=undefined)
        calculatePlanPrices(calculatedTariff.selectedTarifPlan.tariffplancode)
  },[calculatedTariff,selectedUser])

  function tariffPlansFunction(type){
     axios.get(apiUrls.localUrl.getTariffsUrl+type).then(response =>{
      setTariffs(response.data.name);
    });
  }


  function planTypeHandler(e){
    
    const tariffplancode = e.target.value;
    setSelectedTariffPlanCode(tariffplancode);
    calculatePlanPrices(tariffplancode);
  }

  function calculatePlanPrices(tariffplancode){
    var selectedPlanType = calculatedTariff.AgentTariffPrices
                                           .filter((item)=>item.tariffplancode==tariffplancode)[0];
      if(selectedUser.isfromagent)
      selectedPlanType.price = selectedPlanType.agentprice;
      setSelectedPlanType(selectedPlanType);
      setShowLoadingProgress(false);
  }


  const tariffTypeChangeHandler =async (typeVpn,isFromAgent)=>{
    var url = apiUrls.localUrl.getTariffPlanUrl+typeVpn;
    await axios.get(url).then((monthResponse)=>{
      setMonths(monthResponse.data.name)
    });
}

 async function ReovkeBtnHandler(e){
    e.preventDefault();

    const uuid = uuidv4();

    const calculatedPrice = await axios.post(apiUrls.UserBasketUrls.insertusersbasketForRevokingApi,{
      username:userName,
      tariffplancode:selectedTariffPlanCode,
      tariffcode:calculatedTariff.selectedTarifPlan.tarrifcode,
      type:selectedUser.type,
      uuid: uuid,
      prveUUID:selectedUserBasket.uuid
    });

    
    const result = await axios.post(apiUrls.userUrl.revokeuserUrl,{
      username:userName,
      tariffplancode:selectedTariffPlanCode,
      tariffcode:calculatedTariff.selectedTarifPlan.tarrifcode,
      type:selectedUser.type,
      uuid:uuid
    });
    if(resul.data.isValid==false){
      console.log(result.data.message);
    }
  }
  

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop:'40px' }}>
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
    <Grid item xs={12}>
        <Card>
          <CardHeader title='تمدید اکانت انتخاب شده' titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ margin: 0 }} />
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <TextField name="username" 
                type='input'
                disabled={true}
                value={userName}
                fullWidth label='نام کاربر' placeholder='جسجتو اکانت بر اساس نام کاربری' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="expireTime" 
                type='input'
                disabled={true}
                value={ConvertToPersianDateTime(expireUser)}
                fullWidth label='نام کاربر' placeholder='جسجتو اکانت بر اساس نام کاربری' />
            </Grid>
          </Grid>
          <Grid style={{marginTop:'20px'}}>
            {
              showLoadingProgress&&
              <div style={{display:'flex', justifyContent:'center'}}>
                  <CircularProgress></CircularProgress>
              </div>
            }


          </Grid>
          {
            (tariffs&&calculatedTariff) && (

            <Grid container spacing={6}  style={{marginTop:'20px'}}>
            <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-select-label'>تعداد کاربر</InputLabel>
                    <Select
                      name="plantType"
                      disabled={true}
                      label='تعداد کاربر'
                      defaultValue={calculatedTariff.selectedTarifPlan.tarrifcode}
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                    >
                      {tariffs &&
                        tariffs.map((item,index)=>(
                          <MenuItem key={index} value={item.code}>{item.title}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>ماه</InputLabel>
                <Select
                  onChange={planTypeHandler} 
                  name="planTime"
                  label='انتخاب زمان'
                  defaultValue={calculatedTariff.selectedTarifPlan.tariffplancode}
                  
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  {months &&
                    months.map((item,index)=>(
                      <MenuItem key={index} value={item.code}>{item.title}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            </Grid>
            )
          }
          {
          selectedPlanType&&
            <CardActions>
                  <div>
                      <Alert severity="success"> مبلغ قابل پرداخت:  {addCommas(digitsEnToFa(selectedPlanType.price))} تومان</Alert>
                  </div>
              <Button onClick={ReovkeBtnHandler}>تمدید اکانت</Button>
            </CardActions>
          }
        </Card>
    </Grid>
  </TableContainer>
  </Paper>
  )
}

export default RevokeSelectedUser
