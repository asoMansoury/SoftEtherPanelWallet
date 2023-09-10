// ** MUI Imports
import Grid from '@mui/material/Grid'
import { apiUrls } from 'src/configs/apiurls';
import { Alert } from '@mui/material';
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
// ** Demo Components Imports
import { useEffect } from 'react';
import TextField from '@mui/material/TextField'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools';
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Button, Input } from '@mui/material';
import { isEmail } from 'validator';
import TableContainer from '@mui/material/TableContainer'
import {GetAllTypes } from 'src/lib/utils';

const ConvertUsersComponent = (props)=>{
    const [selectedUser,setSelectedUser] = useState();
    const [servers,setServers] = useState([]);
    const { data: session, status } = useSession();
    const [types,setTypes] = useState([]);


    useEffect(async () => {
        if(props!=undefined){
            if(props.selectedUser!=undefined){
                var selectedTypes= GetAllTypes().filter((z=>z.code!=apiUrls.types.SoftEther&& z.code!= props.selectedUser.type));
                setTypes(selectedTypes);
                setSelectedUser(props.selectedUser);
            }
        }
    }, [props]);

    async function LoadServers(e){
        var tmpServers = await axios.get(apiUrls.server.getServersByTypeApi );
        setServers(tmpServers.data.name);
    }
    
    return <div>
    </div>
}

export default ConvertUsersComponent;