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
import { ValidateUIElements, isNumber } from 'src/lib/utils';

const AgentWalletComponent = (props) => {
    const [agentInformation, setAgentInformation] = useState();
    const [agentWallet, setAgentWallet] = useState();
    const [customer, setCustomer] = useState();
    const [isSubmit,setIsSubmit] = useState(false);
    const [selectedRow, setSelectedRow] = useState();
    const [data, setData] = useState({
        refundMoney: 0,
        agentcode: "",
        email: ""
    })


    const [error, setError] = useState({
        isValid: true,
        errosMsg: "",
        severity: "error"
    })


    useEffect(async () => {
        if (props.subAgentInformation != undefined) {
            setAgentInformation(props.subAgentInformation.agentInformation);
            setAgentWallet(props.subAgentInformation.agentWallet);
            setCustomer(props.subAgentInformation.customer);
            setData({
                ...data,
                email: props.subAgentInformation.customer.email,
                agentcode: props.subAgentInformation.agentInformation.agentcode
            });
            setSelectedRow(props.selectedRow);
        }

    }, [props]);

    function refundMoneyHandler(e) {
        e.preventDefault();
        if (isNumber(e.target.value) == false)
            return;
        if (e.target.value > agentWallet.cashAmount)
            e.target.value = agentWallet.cashAmount;
        setData({
            ...data,
            refundMoney: e.target.value
        })
    }

    async function btnSubmitHandler(e) {
        e.preventDefault();
        if (data.refundMoney == 0)
        {
            setError({
                ...error,
                isValid:false,
                errosMsg:"مبلغ برگشت اعتبار باید بیشتر از 0 باشد."
            });
            return;
        }
        setIsSubmit(true);
        setError({
            isValid:false,
            errosMsg:"در حال ثبت تغییرات...",
            severity:'info'
        });
        const obj = {
            refundMoney:data.refundMoney,
            agentcode:data.agentcode,
            email:data.email
        }
        const result = await axios.post(apiUrls.agentUrl.refundSubAgentUrl,obj);
        console.log(result);
        if(result.data.result.isValid==true){
            setError({
                isValid:false,
                errosMsg:"عملیات برگشت اعتبار با موفقیت انجام گردید",
                severity:'success'
            });
            props.btnManaginWalletHandler(selectedRow);
        }else{
            setError({
                isValid:true,
                errosMsg:result.data.errorMsg,
                severity:'error'
            });
        }

        setIsSubmit(false);
            

    }

    return <div>
        {
            agentInformation != undefined && agentWallet != undefined &&
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="مدیریت کیف پول نماینده فروش" titleTypographyProps={{ variant: 'h6' }} />
                        <Divider sx={{ margin: 0 }} />
                        {
                            error.isValid == false &&
                                <Alert severity={error.severity}>{error.errosMsg}</Alert>
                        }
                        <CardContent>
                            <Grid container spacing={6}>
                                <Grid item xs={12}>
                                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                        ایمیل
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label='ایمیل' placeholder='ایمیل ایجنت' value={customer.email} disabled={true} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Alert severity='info'>موجودی نماینده فروش در حال حاضر : {addCommas(digitsEnToFa(agentWallet.cashAmount))} تومان می باشد</Alert>
                                </Grid>
                                <Divider></Divider>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label='برگشت اعتبار داده شده' placeholder='مقدار اعتبار بازگشت' value={data.refundMoney} onChange={refundMoneyHandler} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    {
                                        data.refundMoney != undefined &&
                                        <Alert severity='info'>{addCommas(digitsEnToFa(data.refundMoney.toString()))} تومان </Alert>

                                    }
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button size='large' sx={{ mr: 2 }} variant='contained' onClick={btnSubmitHandler} disabled={isSubmit}>ثبت تغییرات</Button>
                                </Grid>
                            </Grid>
                        </CardContent>

                    </Card>
                </Grid>
                <Divider></Divider>

            </Grid>
        }

    </div>
}

export default AgentWalletComponent
