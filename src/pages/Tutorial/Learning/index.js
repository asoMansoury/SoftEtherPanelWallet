import { TabContext, TabList, TabPanel } from '@mui/lab'
import Tab from '@mui/material/Tab'
import { Card, CardHeader, Grid } from '@mui/material'
import React from 'react'
import CardContent from '@mui/material/CardContent'
import { useState } from 'react'
import CiscoLearning from './CiscoPart/CiscoLearning'
import SoftEtherLearning from './SoftEtherPart/SoftEtherLearning'
import { useEffect } from 'react'
import axios from 'axios'
import { apiUrls } from 'src/configs/apiurls'

export default function index() {
    const [ciscoTutorial,setCiscoTutorial]= useState({});
    const [softEtherTutorial,setSoftEtherTutorial]= useState({});
      // ** State
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(async ()=>{
    var tutorials =await axios.get(apiUrls.TutorialUrls.GetTutorial);
    setCiscoTutorial(tutorials.data.name.filter((z)=>z.type==apiUrls.types.Cisco)[0]);
    setSoftEtherTutorial(tutorials.data.name.filter((z)=>z.type==apiUrls.types.SoftEther)[0]);
  },[])

  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
                <CardHeader title="رو آموزش مربوطه کلیک کنید" titleTypographyProps={{ variant: 'h6' }} />
            </Card>
        </Grid>
        <Grid item xs={12} lg={12}>
            <Card>
                <TabContext value={value}>
                    <TabList centered onChange={handleChange} aria-label='card navigation example'>
                    <Tab value='1' label='وی پی ان ایران' />
                    <Tab value='2' label='سیسکو' />
                    </TabList>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <TabPanel value='1' sx={{ p: 0 }}>
                            <CiscoLearning ciscoTutorial = {ciscoTutorial}></CiscoLearning>
                        </TabPanel>
                        <TabPanel value='2' sx={{ p: 0 }}>
                            <SoftEtherLearning ciscoTutorial = {ciscoTutorial}></SoftEtherLearning>
                        </TabPanel>
                    </CardContent>
                </TabContext>
            </Card>
        </Grid>
  </Grid>
  )
}
