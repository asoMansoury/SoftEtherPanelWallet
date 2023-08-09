import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { apiUrls } from 'src/configs/apiurls';
import DownloadIcon from 'src/views/iconImages/DownloadIcon'

export default function DownloadServerLink(props) {
    const [row,setRow] = useState(null);
    useEffect(()=>{
        setRow(props.row);
    },[props]);

    if(row==null)
        return <></>
    else{
        if(row.type==apiUrls.types.SoftEther){
            return (
                <a className="download-img-con btn-for-select" target="_blank" rel="noreferrer" href={row.url} >
                    <DownloadIcon></DownloadIcon>
                    <div>
                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                        دانلود فایل کانفیگ
                    </Typography>
                    </div>
                </a>
              )
        }else {
            return <span>{row.url}</span>
        }

    }

}
