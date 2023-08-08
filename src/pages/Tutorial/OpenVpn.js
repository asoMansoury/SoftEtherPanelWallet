
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid'
import {CardHeader,Card} from "@mui/material";
import axios from "axios";
import CiscoAndroid from "./components/CiscoAndroid";
import { apiUrls } from "src/configs/apiurls";
import CiscoApple from "./components/CiscoIPhone";
import CiscoWindows from "./components/CiscoWindows";

const OpenVpnTutorial = ()=>{
    const router = useRouter();
    const [openVpn,setOpenVpn] = useState({});

    useEffect(async ()=>{
      await axios.get(apiUrls.softwareUrls.getLinksApi).then((response)=>{
        setOpenVpn(response.data.name.find((e)=>e.type==apiUrls.types.SoftEther))
      })
    },[]);



    return   (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="لیست اکانت های خریداری شده" titleTypographyProps={{ variant: 'h6' }} />
          </Card>
        </Grid>
        <Grid item xs={12} lg={12}>
          <CiscoAndroid ciscoLinks={openVpn}></CiscoAndroid>
        </Grid>
        <Grid item xs={12} lg={12}>
          <CiscoApple ciscoLinks={openVpn}></CiscoApple>
        </Grid>
        <Grid item xs={12} lg={12}>
          <CiscoWindows ciscoLinks={openVpn}></CiscoWindows>
        </Grid>

      </Grid>
    )
}

export default OpenVpnTutorial;