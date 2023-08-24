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
import { isNumber } from 'src/lib/utils';

const AgentProfileComponent = (props) => {
    const [agentInformation, setAgentInformation] = useState();
    const [agentWallet, setAgentWallet] = useState();
    const [formData, setFormData] = useState({
        email: '',
        cashAmount: 0,
        password: "",
        agentcode: '',
        agentprefix: "",
        name: ""
    });
    const [error, setError] = useState({
        isValid: true,
        errosMsg: "",
        severity: "error"
    })

    useEffect(() => {
        setAgentWallet(props.agentWallet);
        setAgentInformation(props.agentInformation);
    }, [props]);



    function formDataHandler(e) {
        e.preventDefault();

        var element = e.target;
        if (element['id'] === 'cashAmount') {
            if (isNumber(e.target.value) == false)
                return;
            if (e.target.value > agentWallet.cashAmount)
                e.target.value = agentWallet.cashAmount;

        }
        setFormData({
            ...formData,
            [element['id']]: e.target.value
        })
        props.formDataHandler(formData);
    }




    return <> {
        agentInformation != undefined && agentWallet != undefined && <CardContent>
            {
                <>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={6}>
                            <Alert severity='info'>موجودی کیف پول شما : {addCommas(digitsEnToFa(agentWallet.cashAmount))} تومان</Alert>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField id="name" fullWidth label='نام' onChange={formDataHandler} value={formData.name} defaultValue={formData.name} placeholder='نام کاربر' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="email" fullWidth label='ایمیل' onChange={formDataHandler} value={formData.email} defaultValue={formData.email} placeholder='ایمیل' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="password" fullWidth label='کلمه عبور' onChange={formDataHandler} value={formData.password} defaultValue={formData.password} placeholder='کلمه عبور' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id='agentcode' fullWidth label='کد ایجنت' onChange={formDataHandler} value={formData.agentcode} defaultValue={formData.agentcode} placeholder='کد ایجنت' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id='agentprefix' fullWidth label='پیشوند کاربر' onChange={formDataHandler} value={formData.agentprefix} defaultValue={formData.agentprefix} placeholder='کد ایجنت' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="cashAmount" type='number' fullWidth label='مبلغ شارژ کیف پول' onChange={formDataHandler} value={formData.cashAmount} defaultValue={formData.cashAmount} placeholder='مبلغ شارژ کیف پول' />
                        </Grid>
                        <Divider></Divider>
                        <Grid item xs={12} sm={6}>
                            <Alert severity='info'>{addCommas(digitsEnToFa(formData.cashAmount))} تومان</Alert>
                        </Grid>

                    </Grid>
                </>
            }
        </CardContent>
    }

    </>
}

export default AgentProfileComponent
