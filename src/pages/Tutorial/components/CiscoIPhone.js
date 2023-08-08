// ** MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import AppStoreImage from 'src/views/iconImages/AppstoreIcon'
import { useEffect, useState } from 'react'

const CiscoApple = (props) => {
  const [links,setLinks] = useState({});
  useEffect(()=>{
    setLinks(props.ciscoLinks);
  },[props])
  
  return (
    <Card style={{marginTop:'30px'}}>
      <CardMedia sx={{ height: '14.5625rem' }} image='/images/cards/glass-house.png' />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2,fontWeight: 'bold',fontSize: '26px',color: 'rebeccapurple' }}>
          برای دانلود نسخه آیفون روی لینک زیر کلیک کنید
        </Typography>
        <div className="download-img-parent">
            <a className="btn-for-select" target="_blank" rel="noreferrer" href={links.appstore} >
              <AppStoreImage></AppStoreImage>
            </a>
        </div>

      </CardContent>
    </Card>
  )
}

export default CiscoApple
