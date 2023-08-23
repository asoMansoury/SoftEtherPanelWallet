// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import { signOut, useSession } from 'next-auth/react'
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools'
import axios from 'axios'
import { apiUrls } from 'src/configs/apiurls'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props) => {
  const {  data:session,status } = useSession();
  const [wallet,setWallet] = useState();
  const [cashAmount,setCashAmount] = useState(0);

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  // const dispatch = useDispatch();
  // ** Hooks
  const router = useRouter()

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }
  
  useEffect(async ()=>{
    if(status == 'authenticated'){
      var wallet = (await axios.get(apiUrls.WalletUrls.GetUserWalletApi+session.user.email));
      setWallet(wallet);
      setCashAmount(wallet.data.name.cashAmount);
    }
  },[status])

  const logoutHandler =()=>{
    signOut({
      callbackUrl:"/pages/login"
    });

    handleDropdownClose('/pages/login')
  }

  function goToProfileHandler(e){
    router.push("/user/Profile")
  }
  
  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.png'
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4, cursor:'pointer' }} onClick={goToProfileHandler}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 30, alignItems: 'flex-end', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>پنل</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {status=="authenticated"?session.user.email:'کاربر مهمان'}
              </Typography>
            </Box>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>موجودی حساب</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {status=="authenticated"&&cashAmount!=undefined?addCommas(digitsEnToFa(cashAmount.toString())):'0 '} تومان
              </Typography>
            </Box>

        <Divider />
        {status=="authenticated" &&
                <MenuItem sx={{ py: 2 }} onClick={logoutHandler}>
                <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
                خروج از پنل کاربری
              </MenuItem>
        }
        {status=="unauthenticated"&&
            <MenuItem sx={{ py: 2 }} onClick={() => handleDropdownClose('/pages/login')}>
            <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
            ورود به پنل کاربری
          </MenuItem>
        }

      </Menu>
    </Fragment>
  )
}

export default UserDropdown
