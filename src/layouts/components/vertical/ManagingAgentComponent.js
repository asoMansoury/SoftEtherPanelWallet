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
import { useRouter } from "next/router";
const ManagingAgentComponent = (props) => {
  const router = useRouter();
  function goToManaginAgents(e){
    router.push(props.url);
  }

    // ** Hook
    const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
            <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                <div style={{display:'flex', cursor:'pointer', flexDirection:'row', justifyItems:'center', justifyContent:'space-between'}} onClick={goToManaginAgents}>
                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                        {} 
                        {props.title != undefined && props.title} 
                    </Typography>
                </div>
            </CardContent>
        </Card>
    )
}

export default ManagingAgentComponent;