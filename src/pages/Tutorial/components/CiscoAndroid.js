// ** MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import DownloadIcon from 'src/views/iconImages/DownloadIcon'
import PlayStoreIcon from 'src/views/iconImages/PlayStoreIcon'
import { useEffect, useState } from 'react'

const CiscoAndroid = (props) => {
  const [links,setLinks] = useState({});
  useEffect(()=>{
    setLinks(props.ciscoLinks);

  },[props])
  
  return (
    <Card>
      <CardMedia sx={{ height: '14.5625rem' }} image='/images/cards/glass-house.png' />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2,fontWeight: 'bold',fontSize: '26px',color: 'rebeccapurple' }}>
          برای دانلود نسخه آندروید از لینک های زیر استفاده نمایید.
        </Typography>
        <div className="download-img-parent">
            <a className="download-img-con btn-for-select" target="_blank" rel="noreferrer" href={links.androidcloud} >
                  <DownloadIcon></DownloadIcon>
                  <div>
                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                      دانلود از سرور ابری
                    </Typography>
                  </div>
            </a>
              <a className="download-img-con btn-for-select" target="_blank" rel="noreferrer" href={links.playstore} >
                <PlayStoreIcon></PlayStoreIcon>
              </a>
        </div>

      </CardContent>
    </Card>
  )
}

export default CiscoAndroid
