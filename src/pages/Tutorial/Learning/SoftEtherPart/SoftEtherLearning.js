// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'
import {  Grid } from '@mui/material';
import DownloadIcon from 'src/views/iconImages/DownloadIcon'
import { useEffect } from 'react'
import { TabContext } from '@mui/lab';
const SoftEtherLearning = (props) => {
  const [softEtherTutorial,setSoftEtherTutorial]= useState({});
  useEffect(()=>{
    setSoftEtherTutorial(props.softEtherTutorial)
  },[props])
  return (
    <>
        {
          softEtherTutorial!=undefined && 

          <Grid container spacing={6}>
            <Grid item xs={12}>
              <div className="download-img-parent">
                  <a className="download-img-con btn-for-select" target="_blank" href={softEtherTutorial.android} rel="noreferrer"  >
                      <DownloadIcon></DownloadIcon>
                      <div>
                        <Typography variant='h6' sx={{ marginBottom: 2 }}>
                          مشاهده آموزش راه اندازی آندروید
                        </Typography>
                      </div>
                  </a>
                  <a  className="download-img-con btn-for-select" target="_blank" href={softEtherTutorial.iphone} rel="noreferrer"  >
                      <DownloadIcon></DownloadIcon>
                      <div>
                        <Typography variant='h6' sx={{ marginBottom: 2 }}>
                          مشاهده آموزش راه اندازی آیفون
                        </Typography>
                      </div>
                  </a>
                  <a  className="download-img-con btn-for-select" target="_blank" href={softEtherTutorial.windows} rel="noreferrer"  >
                      <DownloadIcon></DownloadIcon>
                      <div>
                        <Typography variant='h6' sx={{ marginBottom: 2 }}>
                          مشاهده آموزش راه اندازی ویندوز
                        </Typography>
                      </div>
                  </a>
              </div>
            </Grid>
          </Grid>
        }
    </>
  )
}

export default SoftEtherLearning
