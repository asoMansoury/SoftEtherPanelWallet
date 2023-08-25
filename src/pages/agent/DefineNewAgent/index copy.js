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
import AgentProfileComponent from './Component/AgentProfileComponent';

const Index = () => {
    const { data: session, status } = useSession();
    const [agentInformation, setAgentInformation] = useState();
    const [agentWallet, setAgentWallet] = useState();
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
            if (session.user.isAgent == true) {
                var agentInformation = await axios.get(apiUrls.agentUrl.getAgentInformation + session.user.agentcode);
                setAgentInformation(agentInformation.data.name);
                setAgentWallet(agentInformation.data.name.agentWallet);
                setPlansMethod();
                setProfileSelector({
                    email: session.user.email,
                    cashAmount: session.user.cashAmount,
                    isAgent: session.user.isAgent,
                    isLoggedIn: true
                });
            }
        }
    }, [status]);

    async function setPlansMethod() {
        setPlans([]);
        var agentTariffs = await axios.get(apiUrls.localUrl.getAllTarifPriceUrl);
        setPlans(agentTariffs.data.name);
    }

    function formDataHandler(formData) {
        setFormData(formData);
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

        console.log(formData);
        return;
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
        // var result = await axios.post(apiUrls.AdminManagementUrls.DefineNewAgent, obj);
        // if(result.isValid==false){
        //     setDisableBtn(false);
        //     setError({
        //         isValid:false,
        //         errorMsg:"با خطا مواجه شد",
        //         severity:'error'
        //     })
        // }
        // setError({
        //     isValid:false,
        //     errorMsg:"عملیات با موفقیت انجام گردید.",
        //     severity:'success'
        // })
        // setFormData({
        //     email: '',
        //     cashAmount: 0,
        //     password: "",
        //     agentcode: '',
        //     agentprefix: "",
        //     name:""
        // });
    }

    return <div>
        {
            agentInformation != undefined && agentWallet !=undefined &&<>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title='اطلاعات نماینده فروش شما' titleTypographyProps={{ variant: 'h6' }} />
                            <Divider sx={{ margin: 0 }} />
                            <AgentProfileComponent formDataHandler={formDataHandler} agentInformation={agentInformation} agentWallet={agentWallet}></AgentProfileComponent>
                        </Card>
                    </Grid>
                    <Divider></Divider>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title='ثبت قیمت' titleTypographyProps={{ variant: 'h6' }} />
                            <Divider sx={{ margin: 0 }} />
                            <CardContent>
                                <Table stickyHeader sx={{ minWidth: 650 }} aria-label='simple table'>
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
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </>
        }

    </div>
}

export default Index
