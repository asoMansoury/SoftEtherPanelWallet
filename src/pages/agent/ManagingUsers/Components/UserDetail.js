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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
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
import { ValidateUIElements } from 'src/lib/utils';

const UserDetail = (props) => {
    const [customer, setCustomer] = useState({
        isUserLoaded:false,
        email:"",
        password:""
    });

    useEffect(async () => {
        if (props.userDetail != undefined) {
            setCustomer(props.userDetail);
        }

    }, [props]);



    return <div>
        {
            customer.isUserLoaded==true &&
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title='اطلاعات کاربر انتخاب شده' titleTypographyProps={{ variant: 'h6' }} />
                        <Divider sx={{ margin: 0 }} />
                        <CardContent>
                            <Grid container spacing={6}>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                        ایمیل
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Alert severity='info'>{customer.email}</Alert>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                        کلمه عبور
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Alert severity='info'>{customer.password}</Alert>
                                </Grid>
                                <Divider></Divider>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Divider></Divider>

            </Grid>
        }

    </div>
}

export default UserDetail
