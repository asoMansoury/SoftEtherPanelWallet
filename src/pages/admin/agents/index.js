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
const Index = () => {
    const { data: session, status } = useSession();
    const [profileSelector, setProfileSelector] = useState({
        isLoggedIn: false
    });
    const [plans, setPlans] = useState([]);
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

    const [disableBtn, setDisableBtn] = useState(false)

    useEffect(async () => {

        if (status === "authenticated") {
            setPlansMethod();
            setProfileSelector({
                email: session.user.email,
                cashAmount: session.user.cashAmount,
                isAgent: session.user.isAgent,
                isLoggedIn: true
            });
        }
    }, [status]);

    async function setPlansMethod() {
        setPlans([]);
        var agentTariffs = await axios.get(apiUrls.localUrl.getAllTarifPriceUrl);
        setPlans(agentTariffs.data.name);
    }

    function formDataHandler(e) {
        e.preventDefault();
        var element = e.target;
        var tmp = formData;
        tmp[element['id']] = e.target.value;
        setFormData({
            ...formData,
            tmp
        });
    }


    function changePrice(e, row) {
        var elementID = e.target['id'];
        const updatedPlans = plans.map((plan) => {
            if (plan.tariffplancode === row.tariffplancode &&
                plan.tarrifcode === row.tarrifcode &&
                plan.type === row.type) {
                return {
                    ...plan,
                    [elementID]: parseInt(e.target.value),
                };
            }
            return plan;
        });

        setPlans(updatedPlans);
    }

    async function btnFinalHandler(e) {
        e.preventDefault();
        setDisableBtn(true);
        var obj = {
            agent: formData,
            plans: plans
        }
        if (formData.email || formData.cashAmount == 0 || formData.password || formData.agentcode == "", formData.agentprefix == "" || formData.name == "") {
            setError({
                isValid: false,
                errorMsg: "اطلاعات به صورت کامل پر نشده است",
                severity: 'error'
            });
            setDisableBtn(false);
            return;
        }
        var result = await axios.post(apiUrls.AdminManagementUrls.DefineNewAgent, obj);
        if (result.isValid == false) {
            setDisableBtn(false);
            setError({
                isValid: false,
                errorMsg: "با خطا مواجه شد",
                severity: 'error'
            })
        }
        setError({
            isValid: false,
            errorMsg: "عملیات با موفقیت انجام گردید.",
            severity: 'success'
        })
        setFormData({
            email: '',
            cashAmount: 0,
            password: "",
            agentcode: '',
            agentprefix: "",
            name: ""
        });
    }

    return <div>
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='اطلاعات پروفایل شما' titleTypographyProps={{ variant: 'h6' }} />
                    <Divider sx={{ margin: 0 }} />
                    <CardContent>
                        {
                            <>
                                <Grid container spacing={6}>
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
                                        <TextField id="cashAmount" fullWidth label='مبلغ شارژ کیف پول' onChange={formDataHandler} value={formData.cashAmount} defaultValue={formData.cashAmount} placeholder='مبلغ شارژ کیف پول' />
                                    </Grid>
                                    <Divider></Divider>
                                    <Grid item xs={12} sm={6}>
                                        <Alert severity='info'>{addCommas(digitsEnToFa(formData.cashAmount))} تومان</Alert>
                                    </Grid>

                                </Grid>
                            </>
                        }
                    </CardContent>
                </Card>
            </Grid>
            <Divider></Divider>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='ثبت قیمت' titleTypographyProps={{ variant: 'h6' }} />
                    <Divider sx={{ margin: 0 }} />
                    <CardContent>
                        <TableContainer sx={{ maxHeight: 800, overflow: 'scroll', touchAction: 'pan-y' }}>
                            <Table stickyHeader sx={{ minWidth: 650 }} aria-label='simple table' style={{ userSelect: 'none' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>نوع اکانت</TableCell>
                                        <TableCell align='center'>تعداد کاربر</TableCell>
                                        <TableCell align='center'>زمان کاربر</TableCell>
                                        <TableCell align='center'>قیمت فروش به ایجینت(تومان)</TableCell>
                                        <TableCell align='center'>قیمت فروش شما به کاربران(تومان)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {plans.map((row, index) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{
                                                '&:last-of-type td, &:last-of-type th': {
                                                    border: 0
                                                }
                                            }}
                                        >
                                            <TableCell align='center' component='th' scope='row'>
                                                {row.typeTitle}
                                            </TableCell>
                                            <TableCell align='center' component='th' scope='row'>
                                                <span>{row.tarrifTitle}</span>
                                            </TableCell>
                                            <TableCell align='center' component='th' scope='row'>
                                                <span>{row.tariffplanTitle}</span>
                                            </TableCell>
                                            <TableCell align='center' component='th' scope='row'>
                                                <div row={JSON.stringify(row)}>
                                                    <Input id="price" onChange={(e) => changePrice(e, row)} defaultValue={row.price}></Input>
                                                    <span >{addCommas(digitsEnToFa(row.price))} تومان</span>
                                                </div>
                                            </TableCell>
                                            <TableCell align='center' component='th' scope='row'>
                                                <div row={JSON.stringify(row)}>
                                                    <Input id="agentprice" onChange={(e) => changePrice(e, row)} defaultValue={row.agentprice}></Input>
                                                    <span >{addCommas(digitsEnToFa(row.agentprice))} تومان</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow style={{ paddingLeft: '100px' }}>
                                        {error.isValid == false && <Alert severity={error.severity}>{error.errorMsg}</Alert>}
                                        <Button size='large' sx={{ mr: 2 }} disabled={disableBtn} variant='contained' onClick={btnFinalHandler}>تعریف ایجنت جدید</Button>
                                        <Grid item xs={12} >

                                        </Grid>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </div>
}

export default Index
