
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid'
import {CardHeader,Card, Typography} from "@mui/material";
import CiscoAndroid from "./components/CiscoAndroid";
import CiscoApple from "./components/CiscoIPhone";
import CiscoWindows from "./components/CiscoWindows";
import axios from "axios";
import { apiUrls } from "src/configs/apiurls";

const CiscoTutorial = ()=>{
    const router = useRouter();
    const [ciscoLinks,setCiscoLinks] = useState({});

    useEffect(async ()=>{
      await axios.get(apiUrls.softwareUrls.getLinksApi).then((response)=>{
        setCiscoLinks(response.data.name.find((e)=>e.type==apiUrls.types.Cisco))
      })
    },[]);



    return   (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="لینک دانلود نرم افزار های سیسکو" titleTypographyProps={{ variant: 'h6' }} />
          </Card>
        </Grid>
        <Grid item xs={12} lg={12}>
          <CiscoAndroid ciscoLinks={ciscoLinks}></CiscoAndroid>
        </Grid>
        <Grid item xs={12} lg={12}>
          <CiscoApple ciscoLinks={ciscoLinks}></CiscoApple>
        </Grid>
        <Grid item xs={12} lg={12}>
          <CiscoWindows ciscoLinks={ciscoLinks}></CiscoWindows>
        </Grid>
      </Grid>
    )
}

export default CiscoTutorial;