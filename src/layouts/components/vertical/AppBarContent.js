// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import UserAppBarContent from './UserAppBarContent'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { apiUrls } from 'src/configs/apiurls'
import ManaginSubAgentComponent from './ManaginSubAgentComponent'


const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  // ** Hook
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const { data: session, status } = useSession();
  const [cashAmount, setCashAmount] = useState(0);

  useEffect(async () => {
    if (status == 'authenticated') {
      UpdateWalletFunc();
    }
  }, [status]);

  async function UpdateWalletFunc() {
    setCashAmount(0);
    var wallet = (await axios.get(apiUrls.WalletUrls.GetUserWalletApi + session.user.email));
    setCashAmount(wallet.data.name.cashAmount);
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        {
          <div style={{display:'flex', flexDirection:'row', marginTop:'8px'}}>
            {
              !hidden && status == 'authenticated' ? (
                <Box>
                  <UserAppBarContent UpdateWalletFunc={UpdateWalletFunc} cashAmount={cashAmount}></UserAppBarContent>
                </Box>
              ) : null}
            {
              !hidden && status == 'authenticated' ? (
                <Box style={{marginRight:'10px'}}>
                  <ManaginSubAgentComponent UpdateWalletFunc={UpdateWalletFunc} cashAmount={cashAmount}></ManaginSubAgentComponent>
                </Box>
              ) : null
            }
          </div>
        }



      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>

        <ModeToggler settings={settings} saveSettings={saveSettings} />

        <UserDropdown cashAmount={cashAmount} />
      </Box>
    </Box>
  )
}

export default AppBarContent
