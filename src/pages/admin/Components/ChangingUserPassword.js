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

const ChangingUserPassword = (props) => {
    const [selectedUser, setSelectedUser] = useState();
    const [password, setPassword] = useState();
    const [enableBtn, setEnableBtn] = useState(true);

    useEffect(async () => {
        if (props != undefined) {
            setSelectedUser(props.selectedUser);
        }
    }, [props]);


    async function btnChangePassword(e) {
        var obj = {
            username: selectedUser.username,
            password:password
        }
        setEnableBtn(true);
        var result = await axios.post(apiUrls.userUrl.ChangeUserVpnPasswordUrl, obj);
        clearForm();
        props.refreshComponent(e);
    }

    function clearForm() {
        setSelectedUser();
        setEnableBtn(false);

    }

    function txtChangePasswordHandler(e){
        e.preventDefault();
        if(e.target.value.length>3){
            setEnableBtn(false)
            setPassword(e.target.value);
        }else{
            setPassword("");
            setEnableBtn(true);
        }
    }


    return (
        selectedUser != null && selectedUser != undefined &&
        <Paper sx={{ width: '100%', overflow: 'hidden',marginTop:'40px',padding:"30px" }}>
            <Grid container spacing={6}>
                <Grid item xs={12} sm={3}>
                    {
                        selectedUser != undefined &&
                        <TextField fullWidth label='کلمه عبور خود را وارد نمایید.' placeholder='کلمه عبور اکانت' onChange={txtChangePasswordHandler}/>
                    }
                </Grid>


                <Grid item xs={12} sm={3}>
                    {
                        selectedUser != undefined &&
                        <Button disabled={enableBtn} size='large' onClick={btnChangePassword} type='submit' sx={{ mr: 2 }} variant='contained'>
                            نغییر کلمه عبور
                        </Button>
                    }
                </Grid>
            </Grid>

        </Paper>
    )
}

export default ChangingUserPassword;