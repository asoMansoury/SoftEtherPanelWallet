// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** Next-auth Imports
import { signIn,getProviders,getSession,useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Alert } from '@mui/material';
import { isEmail } from 'validator';

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))



const LoginPage = () => {
  const {  data:session,status } = useSession();
  const [error,setError] = useState({
    isEmailValid:true,
    isPasswordValid:true,
    isUserLogged:false,
    mesg:""
  });

  // ** State
  const [values, setValues] = useState({
    password: '',
    email:'',
    showPassword: false
  })

  const router = useRouter()

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }


  function validateEmail(){
    if(values.email==''||!isEmail(values.email)) {
      setError({
        ...error,
        isEmailValid:false,
        mesg:"فرمت ایمیل صحیح نمی باشد."
      });
      return false;
    }else{
      setError({
        ...error,
        isEmailValid:true,
        mesg:""
      });
      return true;
    }
  }

  function validatePassowrd(){
    if(values.email=='') {
      setError({
        ...error,
        isPasswordValid:false,
        mesg:"فرمت پسورد صحیح نمی باشد."
      });
      return false;
    }else{
      setError({
        ...error,
        isPasswordValid:true,
        mesg:""
      });
    }
    return true;
  }

  async function btnLoginByEmailHandler(e){
    e.preventDefault();
  if(!validateEmail()) 
    return;
  
  if(!validatePassowrd()) 
    return;
    const payload = {email:values.email,password:values.password};
    const result =await signIn("credentials",{...payload,redirect:false});
    if(result.error!=null){
      setError({
        ...error,
        isUserLogged:false,
        mesg:"نام کاربری یا کلمه عبور اشتباه می باشد."
      });
      return;
    }
    //const session = await getSession();

  }

  useEffect(()=>{

    if(status == 'authenticated'){

      router.push("/cisco");
    }else{

    }
  },[status])

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              ورود به پنل کاربری! 👋🏻
            </Typography>
            <Typography variant='body2'>لطفا نام کاربری و کلمه عبور خود را وارد نمایید.</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField autoFocus onChange={handleChange('email')} fullWidth id='email' label='ایمیل' sx={{ marginBottom: 4 }} />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>کلمه عبور</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {/* <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel control={<Checkbox />} label='Remember Me' />
              <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
              </Link>
            </Box> */}
            {
                !(error.isEmailValid&&error.isPasswordValid) &&
                          error.mesg!=""&&<Alert severity="error">{error.mesg}</Alert>
            }
            {
                !(error.isUserLogged) &&
                          error.mesg!=""&&<Alert severity="error">{error.mesg}</Alert>
            }
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={btnLoginByEmailHandler}
            >
              ورود
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2'>
                <Link passHref href='/cisco/'>
                  <LinkStyled>خرید اکانت</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
