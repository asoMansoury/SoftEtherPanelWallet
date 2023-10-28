import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { apiUrls } from 'src/configs/apiurls';
import DownloadIcon from 'src/views/iconImages/DownloadIcon'
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Alert } from '@mui/material';
export default function DownloadServerLink(props) {
    const [row, setRow] = useState(null);
    useEffect(() => {
        setRow(props.row);
        console.log(props.row)
    }, [props]);

    if (row == null)
        return <></>
    else {
        if ( row.type == apiUrls.types.OpenVpn) {
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
        }else if(row.type == apiUrls.types.SoftEther){
            return <CopyToClipboard
                text={row.url+":"+row.port}
                onCopy={() => alert("کپی شد")}>
                <Alert severity='info'>{row.url+":"+row.port}</Alert>
            </CopyToClipboard>
        } else {
            return <CopyToClipboard
                text={row.url+":"+row.port}
                onCopy={() => alert("کپی شد")}>
                <Alert severity='info'>{row.url+":"+row.port}</Alert>
            </CopyToClipboard>
        }

    }

}
