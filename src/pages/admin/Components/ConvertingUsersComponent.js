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
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools';
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Button, Input } from '@mui/material';
import { isEmail } from 'validator';
import TableContainer from '@mui/material/TableContainer'
import { GetAllTypes } from 'src/lib/utils';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const ConvertUsersComponent = (props) => {
    const [selectedUser, setSelectedUser] = useState();
    const [servers, setServers] = useState([]);
    const { data: session, status } = useSession();
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState();
    const [selectedServer, setSelectedServer] = useState();
    const [enableBtn, setEnableBtn] = useState(true);

    useEffect(async () => {
        if (props != undefined) {
            if (props.selectedUser != undefined) {
                var selectedTypesResult = GetAllTypes().filter((z => z.code != apiUrls.types.SoftEther && z.code != props.selectedUser.type));
                setTypes(selectedTypesResult);
                setSelectedUser(props.selectedUser);
                setSelectedType(selectedTypesResult[0].code);
                LoadServers(selectedTypesResult[0].code)
            }
        }
    }, [props]);

    async function typesHandler(e) {
        e.preventDefault();
        setEnableBtn(true);
        setSelectedType(e.target.value)
        LoadServers(e.target.value);


    }

    async function LoadServers(code) {
        var tmpServers = await axios.get(apiUrls.server.getServersByTypeApi + code);
        setServers(tmpServers.data.name);
        setSelectedServer(tmpServers.data.name[0].servercode);
        setEnableBtn(false);
    }


    async function btnConvertHandler(e) {
        var obj = {
            newType: selectedType,
            servercode: selectedServer,
            username: selectedUser.username
        }
        setEnableBtn(true);
        var result = await axios.post(apiUrls.userUrl.ConvertingUsersUrl, obj);
        clearForm();
        props.refreshComponent(e);
    }

    function clearForm() {
        setServers([]);
        setTypes([]);
        setSelectedServer();
        setSelectedType();
        setSelectedUser();
        setEnableBtn(false);

    }


    return (
        selectedUser != null && selectedUser != undefined &&
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Grid container spacing={6}>
                <Grid item xs={12} sm={3}>
                    {
                        types.length > 0 && selectedType != undefined &&
                        <Select
                            name="plantType"
                            label='انتخاب نوع اکانت'
                            defaultValue={selectedType}
                            onChange={typesHandler}
                            id='form-layouts-separator-select'
                            labelId='form-layouts-separator-select-label'
                        >
                            {
                                types.map((item, index) => (
                                    <MenuItem key={index} value={item.code}>{item.title}</MenuItem>
                                ))
                            }
                        </Select>
                    }
                </Grid>

                <Grid item xs={12} sm={3}>
                    {
                        servers.length > 0 && selectedServer != undefined &&
                        <Select
                            name="plantType"
                            label='انتخاب سرور'
                            defaultValue={selectedServer}
                            onChange={(e) => setSelectedServer(e.target.value)}
                            id='form-layouts-separator-select'
                            labelId='form-layouts-separator-select-label'
                        >
                            {
                                servers.map((item, index) => (
                                    <MenuItem key={index} value={item.servercode}>{item.title}</MenuItem>
                                ))
                            }
                        </Select>
                    }
                </Grid>


                <Grid item xs={12} sm={3}>
                    {
                        selectedType != undefined && selectedServer != undefined &&
                        <Button disabled={enableBtn} size='large' onClick={btnConvertHandler} type='submit' sx={{ mr: 2 }} variant='contained'>
                            تبدیل اکانت
                        </Button>
                    }
                </Grid>
            </Grid>

        </Paper>
    )
}

export default ConvertUsersComponent;