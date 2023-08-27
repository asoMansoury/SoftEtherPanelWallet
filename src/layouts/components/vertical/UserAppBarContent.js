import { useEffect } from "react";
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState } from "react";
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools";
import Refresh from 'mdi-material-ui/Refresh'
const UserAppBarContent = (props) => {
    const [cashAmount, setCashAmount] = useState(0);
    useEffect(() => {
        if (props != undefined)
            setCashAmount(props.cashAmount);
    }, [props]);

    // ** Hook
    const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
            <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                <div style={{display:'flex', flexDirection:'row', justifyItems:'center', justifyContent:'space-between'}}>
                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                        {`موجود حساب شما در حال حاضر ${addCommas(digitsEnToFa(cashAmount!=undefined?cashAmount.toString():'0'))} تومان است`}  
                    </Typography>
                    <Refresh color="white" style={{cursor:'pointer'}} onClick={props.UpdateWalletFunc}></Refresh>
                </div>

                {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Anne Burke' src='/images/avatars/8.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
              Anne Burke
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
              <Heart sx={{ marginRight: 1.25 }} />
              <Typography variant='body2' sx={{ color: 'common.white' }}>
                1.1k
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShareVariant sx={{ marginRight: 1.25 }} />
              <Typography variant='body2' sx={{ color: 'common.white' }}>
                67
              </Typography>
            </Box>
          </Box>
        </Box> */}
            </CardContent>
        </Card>
    )
}

export default UserAppBarContent;