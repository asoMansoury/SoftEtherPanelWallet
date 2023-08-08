// ** MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import AppStoreImage from 'src/views/iconImages/AppstoreIcon'
import DownloadIcon from 'src/views/iconImages/DownloadIcon'
import { useEffect, useState } from 'react'

const CiscoWindows = (props) => {
  const [links,setLinks] = useState({});
  useEffect(()=>{
    setLinks(props.ciscoLinks);
  },[props])
  
  return (
    <Card style={{marginTop:'30px'}}>
      <CardMedia sx={{ height: '14.5625rem' }} image='/images/cards/glass-house.png' />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2,fontWeight: 'bold',fontSize: '26px',color: 'rebeccapurple' }}>
          برای دانلود نسخه ویندوز روی لینک زیر کلیک کنید
        </Typography>
        <div className="download-img-parent">
            <a target="_blank" href={links.windowscloud} rel="noreferrer" className="download-img-con btn-for-select" style={{cursor:'pointer'}} >
                  <DownloadIcon></DownloadIcon>
                  <div>
                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                      دانلود از سرور ابری
                    </Typography>
                  </div>
            </a>
        </div>

      </CardContent>
    </Card>
  )
}

export default CiscoWindows
