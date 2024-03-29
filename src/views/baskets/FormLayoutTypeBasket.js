
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { Alert } from '@mui/material';
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { apiUrls } from 'src/configs/apiurls'
import { digitsEnToFa, addCommas } from "@persian-tools/persian-tools";
import BasketTable from './basketTable';
import { useRouter } from 'next/router';
import { ConvertMonthFromAgentFormat, ConvertPriceFromAgentFormat } from './basketUtils';
import { v4 as uuidv4 } from 'uuid';
import { isEmail } from 'validator';
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CalculatedAmountComponent from './CalculatedAmountComponent';

const planSelectedNummber = 1;
const FormLayoutTypeBasket = ({ tariffs, agent, agentData, typeVpn }) => {
  const [tariffTypes, setTariffTypes] = useState([]);
  const [months, setMonths] = useState([]);
  const [isFromAgent, setIsFromAgent] = useState(true);
  const [planPrice, setPlanPrice] = useState();

  const [error, setError] = useState({
    isEmailValid: true,
    isPasswordValid: true,
    isPlansValid: true,
    mesg: "",
    isUserValid: true,
    userMsg: "",
    isAddToCartValid: true,
    addToCartMsg: ""
  });

  const [isEnableEmail, setIsEnableEmail] = useState(false);
  const [isEnablePass, setIsEnablePass] = useState(false);
  const [formData, setFormData] = useState({});

  const [selectedPlan, setSelectedPlan] = useState({});
  const [selectedTariffPlans, setSelectedTariffPlans] = useState([]);
  const [planRow, setPlanRow] = useState(1);

  const [isCalculated, setIsCalculated] = useState(false);
  const [enableMonth, setEnableMonth] = useState(false);

  const [agentInformation, setAgentInformation] = useState();

  const { data: session, status } = useSession();
  const [profileSelector, setProfileSelector] = useState({
    isLoggedIn: false
  });
  const emailRef = useRef();
  const router = useRouter();

  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState("");
  // const dispatch = useDispatch();
  const [showLoadingProgress, setShowLoadingProgress] = useState(false)
  const [emailToUser, setEmailToUser] = useState({
    checked: false,
    email: ""
  });

  const [passwordUser, setPasswordUser] = useState({
    checked: true,
    password: ""
  });

  useEffect(() => {
    planSelectedNummber = 1;
  }, [])

  useEffect(async () => {

    if (status === "authenticated") {
      setProfileSelector({
        email: session.user.email,
        isLoggedIn: true,
        isAgent: session.user.isAgent
      });

      setFormData({
        ...formData,
        email: session.user.email
      });

      setIsEnablePass(true);
      setIsEnableEmail(true);
    }
  }, [status]);


  useEffect(() => {
    setTariffTypes(tariffs.name);
  }, [tariffs]);

  useEffect(async () => {
    if (typeVpn != undefined) {
      var servers = await axios.get(apiUrls.server.getServersByTypeApi + typeVpn);
      var tmp = [];
      servers.data.name.map((item) => {
        tmp.push(item);
      });
      if(tmp[0]!=null ){
        setSelectedServer(tmp[0].servercode);
        setServers(tmp);
      }
    }
  }, [typeVpn])

  useEffect(() => {
    if (agent == "nobody") {
      //setIsFromAgent(false);
    } else {
      if (agentData != undefined) {
        setAgentInformation(agentData.agentInformation);
        //setIsFromAgent(true);
      } else {
      }
    }
  }, [agent]);

  useEffect(() => {
    selectedPlanFunc();
  }, [formData.tariffPlanCode, formData.tariffCode])

  const tariffTypeChangeHandler = (e) => {

    var url = apiUrls.localUrl.getTariffPlanUrl + typeVpn;
    axios.get(url).then((monthResponse) => {
      if (isFromAgent == false) {
        setMonths(monthResponse.data.name);

      } else {
        var monthResult = ConvertMonthFromAgentFormat(agentData, monthResponse.data.name, e.target.value);
        setMonths(monthResult);
        var planPriceResult = ConvertPriceFromAgentFormat(agentData, monthResponse.data.name, e.target.value);
        setPlanPrice(planPriceResult);

      }
    }).then((prevResponse) => {
      if (isFromAgent == false) {
        var tariffPriceUrl = apiUrls.localUrl.getTariffPriceUrl + typeVpn;
        axios.get(tariffPriceUrl).then((priceResponse) => {
          setPlanPrice(priceResponse.data.name);
        });
      }
      setEnableMonth(true);
    });



    setFormData({
      ...formData,
      tariffCode: e.target.value,
    })
  }

  const planTypeHandler = (e) => {
    setIsCalculated(false);
    setFormData({
      ...formData,
      tariffPlanCode: e.target.value
    });
    setIsCalculated(true);

  }

  function removeItem(rowNum) {
    var tmp = [];
    tmp = selectedTariffPlans;
    var indexOfItem = tmp.findIndex(z => z.rowNum = rowNum);
    tmp.splice(indexOfItem, 1);
    setSelectedTariffPlans(tmp);
    validatePlans();
    planSelectedNummber = planSelectedNummber - 1;
    setError({
      ...error,
      isAddToCartValid: true,
      addToCartMsg: ""
    })
  }




  function selectedPlanFunc() {
    if (isCalculated && planPrice != undefined) {
      var selectedPlanPrice = findElement(formData.tariffCode, formData.tariffPlanCode);
      setSelectedPlan(selectedPlanPrice);
    }
  }




  function findElement(tariffCode, tariffPlaceCode) {
    const foundElement = planPrice.find(
      item => item.tarrifcode === tariffCode && item.tariffplancode === tariffPlaceCode
    );

    return foundElement;
  }



  function emailHandler(e) {
    setFormData({
      ...formData,
      email: e.target.value
    });
    validateEmail();
  }

  function passwordHandler(e) {
    setFormData({
      ...formData,
      password: e.target.value
    });
    validatePassowrd();
  }


  function validateEmail() {
    if (formData['email'] == undefined || !isEmail(formData['email'])) {
      setError({
        ...error,
        isEmailValid: false,
        mesg: "فرمت ایمیل صحیح نمی باشد."
      });

      return false;
    } else {
      setError({
        ...error,
        isEmailValid: true,
        mesg: ""
      });
    }

    return true;
  }

  function validatePassowrd() {
    if (formData['password'] == undefined || !formData['password'] != '') {
      setError({
        ...error,
        isPasswordValid: false,
        mesg: "فرمت پسورد صحیح نمی باشد."
      });

      return false;
    } else {
      setError({
        ...error,
        isPasswordValid: true,
        mesg: ""
      });
    }

    return true;
  }

  function validateSendToOther() {
    if (emailToUser.checked == true) {
      if (emailToUser.email == undefined || !isEmail(emailToUser.email)) {
        setError({
          ...error,
          isEmailValid: false,
          mesg: "فرمت ایمیل صحیح نمی باشد."
        });

        return false;
      } else {
        setError({
          ...error,
          isEmailValid: true,
          mesg: ""
        });
      }
      return true;
    }
    return true;
  }

  function validatePlans() {
    if (selectedTariffPlans == undefined || selectedTariffPlans.length == 0) {
      setError({
        ...error,
        isPlansValid: false,
        mesg: "هیچ پلنی انتخاب نشده است."
      })

      return false;
    } else {
      setError({
        ...error,
        isPlansValid: true,
        mesg: ""
      })
    }

    return true;
  }

  function emailToUserHandler(e) {
    e.preventDefault();
    setEmailToUser({ ...emailToUser, checked: !emailToUser.checked });
  }


  function passwordToUserHandler(e) {
    e.preventDefault();
    setPasswordUser({ ...passwordUser, checked: !passwordUser.checked });
  }

  const addToCart = (e) => {
    e.preventDefault();
    setError({
      ...error,
      isAddToCartValid: true,
      addToCartMsg: ""
    })
    if(passwordUser.checked==true && passwordUser.password.length<=3){
      setError({
        ...error,
        isAddToCartValid: false,
        addToCartMsg: "کلمه عبور حداقل بایستی 4 کلمه باشد."
      })
      return;
    }else {
      setError({
        ...error,
        isAddToCartValid: false,
        addToCartMsg: ""
      })
    }
    if (planSelectedNummber > 1) {
      setError({
        ...error,
        isAddToCartValid: false,
        addToCartMsg: "در حال حاضر امکان انتخاب بیش از یک پلن وجود ندارد."
      })
      return;
    }
    var rowNum = planRow + 1;
    planSelectedNummber = planSelectedNummber + 1;
    var obj = {
      rowNum: 0
    };

    obj = selectedPlan;
    obj.rowNum = rowNum;
    obj.tariffPlanTitle = months.find(z => z.code == selectedPlan.tariffplancode).title;
    obj.tariffTitle = tariffTypes.find(z => z.code == selectedPlan.tarrifcode).title;
    if (isFromAgent == false) {
      obj.agentcode = 'nobody';
      obj.agentprefix = 'User';
      setAgentInformation(obj);
    } else {
      obj.agentcode = agent;
    }
    setPlanRow(rowNum);
    var tmp = [];
    tmp = selectedTariffPlans;
    tmp.push(obj);
    setSelectedTariffPlans(tmp);
    validatePlans();
  }

  async function finishHandler(e) {
    e.preventDefault();
    setShowLoadingProgress(true);
    setError({
      ...error,
      isUserValid: false,
      userMsg: ""
    });

    const uuid = uuidv4();
    if (validateSendToOther() == false) {
      setShowLoadingProgress(false);
      return;
    }
    if (!validateEmail() && profileSelector.isLoggedIn == false) {
      setShowLoadingProgress(false);
      return;
    }


    if (!validatePassowrd() && profileSelector.isLoggedIn == false) {
      setShowLoadingProgress(false);
      return;
    }

    if (!validatePlans()) {
      setShowLoadingProgress(false);
      return;
    }


    if (profileSelector.isLoggedIn == false) {
      setShowLoadingProgress(false);
      setError({
        ...error,
        isUserValid: false,
        userMsg: "شما دسترسی خرید اکانت ندارید لطفا با مدیریت در تماس باشید."
      });
      return;
    }


    var obj = {
      tariffPlans: selectedTariffPlans,
      agentInformation: agentInformation,
      uuid: uuid,
      price: 0,
      agentPrice: 0,
      isFromAgent: isFromAgent,
      inserttime: Date.now(),
      isAccountsCreated: false,
      isSetteledWithAgent: isFromAgent ? false : true,
      email: formData['email'],
      password: formData['password'],
      isLoggedIn: profileSelector.isLoggedIn,
      type: typeVpn,
      isSendToOtherEmail: emailToUser.checked,
      sendEmailToOther: emailToUser.checked == true ? emailToUser.email : formData['email'],
      isInputPasswrd:passwordUser.checked,
      userPassword:passwordUser.password,
      servercode: selectedServer
    };

    await axios.post(apiUrls.localUrl.calculateTotalPrice, { body: obj }).then((response) => {
      if (response.data.name.isValid == false) {
        setError({
          ...error,
          isUserValid: false,
          userMsg: response.data.name.message
        });
        setShowLoadingProgress(false);
        return;
      }
      obj.price = response.data.name.ownerPrice;
      obj.agentPrice = response.data.name.agentPrice;
      obj.debitToAgent = isFromAgent ? (obj.agentPrice - obj.price) : 0;

      axios.post(apiUrls.redisUrl.setRedisApi, { data: obj }).then((redisResponse) => {
        planSelectedNummber = 1;
        var finalPath = "/finalstep";
        if (typeVpn == apiUrls.types.Cisco)
          finalPath = "/cisco/finalstep";
        if (typeVpn == apiUrls.types.OpenVpn)
          finalPath = "/OpenTunnel/finalstep";
          if (typeVpn == apiUrls.types.VpnHood)
          finalPath = "/vpnhood/finalstep";
        router.push({
          pathname: finalPath, query: {
            tariffPlans: JSON.stringify(redisResponse.tariffPlans),
            agent: JSON.stringify(redisResponse.agentInformation),
            uuid: uuid,
            ownerPrice: response.data.ownerPrice,
            agentPrice: response.data.agentPrice
          }
        });
      });
    });
  }

  return (
    <Card>
      <CardHeader title='انتخاب اکانت مورد نظر' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600, fontFamily: 'PersianFont' }}>
                1. انتخاب نوع اکانت
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>تعداد کاربر</InputLabel>
                <Select
                  name="plantType"
                  onChange={tariffTypeChangeHandler}
                  label='تعداد کاربر'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  {tariffTypes &&
                    tariffTypes.map((item, index) => (
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
                  disabled={!enableMonth}
                  onChange={planTypeHandler}
                  name="planTime"
                  label='انتخاب زمان'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  {months &&
                    months.map((item, index) => (
                      <MenuItem key={index} value={item.code}>{item.title}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            {
              (isCalculated && selectedPlan && selectedPlan.price != undefined) &&
              <Grid item xs={12} sm={6} style={{ display: 'flex' }}>
                <CalculatedAmountComponent profileSelector={profileSelector} price={selectedPlan.price} agentprice={selectedPlan.agentprice}></CalculatedAmountComponent>
              </Grid>
            }
          </Grid>
          <Grid container spacing={5} style={{ marginTop: '10px', paddingRight: 'px' }}>
            <Grid item xs={12} sm={2} >
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={passwordUser.checked}
                  onChange={passwordToUserHandler} />} label="میخواهم خودم پسورد وارد کنم." />
              </FormGroup>
            </Grid>
            {
              passwordUser.checked == true && (
                <>
                  <Grid item xs={12} sm={4} >
                    <TextField name="passwordUser"
                      type='email'
                      value={passwordUser.password}
                      onChange={(e) => setPasswordUser({
                        ...passwordUser,
                        password: e.target.value
                      })}
                      fullWidth label='کلیمه عبور' placeholder='کلمه عبور را وارد نمایید.' />
                  </Grid>
                </>
              )
            }
          </Grid>

        </CardContent>
        <Divider sx={{ margin: 0 }} />
        {

          !(error.isAddToCartValid) &&
          error.addToCartMsg != "" && <Alert severity="error">{error.addToCartMsg}</Alert>
        }
        <CardActions>
          <Button disabled={!isCalculated && months != undefined} size='large' type='submit' onClick={addToCart} sx={{ mr: 2 }} variant='contained'>
            اضافه کردن اکانت
          </Button>
        </CardActions>


        <Divider sx={{ margin: 0 }} />
        <BasketTable profileSelector={profileSelector} removeItem={removeItem} parentData={selectedTariffPlans}></BasketTable>

        <Divider></Divider>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600, fontFamily: 'PersianFont' }}>
              1. انتخاب سرور
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-select-label'>سرور مورد نظر</InputLabel>
              {
                servers.length > 0 &&
                <Select
                  name="plantType"
                  label='انتخاب سرور'
                  defaultValue={selectedServer}
                  onChange={(e) => { setSelectedServer(e.target.value) }}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  {
                    servers.map((item, index) => (
                      <MenuItem key={index} value={item.servercode}>{item.title}</MenuItem>
                    ))
                  }
                </Select>
              }

            </FormControl>
          </Grid>
        </Grid>
        <Divider sx={{ margin: 0 }} />
        <Grid container spacing={5} style={{ marginTop: '10px', paddingRight: 'px' }}>
          <Grid item xs={12} sm={6} >
            <TextField name="email"
              disabled={isEnableEmail}
              type='email'
              ref={emailRef}
              value={formData.email}
              onChange={emailHandler}
              fullWidth label='ایمیل' placeholder='وارد کردن ایمیل اجباری است' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="password"
              disabled={isEnablePass}
              type='password'
              onChange={passwordHandler} fullWidth label="پسورد اکانت" placeholder="پسورد اکانت " />
          </Grid>
        </Grid>
        <Grid container spacing={5} style={{ marginTop: '10px', paddingRight: 'px' }}>
          <Grid item xs={12} sm={2} >
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={emailToUser.checked}
                onChange={emailToUserHandler} />} label="ارسال اکانت به ایمیل دیگران" />
            </FormGroup>
          </Grid>
          {
            emailToUser.checked == true && (
              <>
                <Grid item xs={12} sm={5} >
                  <TextField name="userEmail"
                    type='email'
                    ref={emailRef}
                    value={emailToUser.email}
                    onChange={(e) => setEmailToUser({
                      ...emailToUser,
                      email: e.target.value
                    })}
                    fullWidth label='ایمیل' placeholder='ایمیل پنل کاربر' />
                </Grid>
              </>
            )
          }

        </Grid>
        {

          !(error.isEmailValid && error.isPasswordValid && error.isPlansValid) &&
          error.mesg != "" && <Alert severity="error">{error.mesg}</Alert>
        }
        {

          !(error.isUserValid) &&
          error.userMsg != "" && <Alert severity="error">{error.userMsg}</Alert>
        }
        <CardActions>
          {
            showLoadingProgress &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress></CircularProgress>
            </div>
          }
          <Button size='large' disabled={showLoadingProgress} onClick={finishHandler} type='submit' sx={{ mr: 2 }} variant='contained'>
            نهایی کردن خرید
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormLayoutTypeBasket
