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
import AgentPriceComponent from './Component/AgentPriceComponent';
import { ValidateUIElements } from 'src/lib/utils';

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

    const [planError, setPlanError] = useState({
        isValid: true,
        errosMsg: "",
        severity: "error"
    })

    const [disableBtn, setDisableBtn] = useState(false)

    useEffect(async () => {
        setDisableBtn(true);
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
                setDisableBtn(false);
            }
        }
    }, [status]);

    async function setPlansMethod() {
        setPlans([]);
        var agentTariffs = await axios.get(apiUrls.localUrl.getAllAgentPlansUrl);
        setPlans(agentTariffs.data.result);
    }

    function formDataHandler(formData) {
        setFormData(formData);
    }


    function changePriceHandler(updatedPlans) {
        setPlans(updatedPlans);
    }

    function ValidateFormData() {
        if (formData.email || formData.cashAmount == 0 || formData.password || formData.agentcode == "", formData.agentprefix == "" || formData.name == "") {
            setError({
                isValid: false,
                errorMsg: "اطلاعات به صورت کامل پر نشده است",
                severity: 'error'
            });
            setDisableBtn(false);
            return false;
        }
    }

    function ValidatePlansData() {
        plans.forEach((item, index) => {
            if (parseInt(item.price) < parseInt(item.ownerPrice)) {
                setPlanError({
                    isValid: false,
                    errorMsg: `قیمت  فروش شما به نماینده فروش برای اکانت << ${item.tarrifTitle} >> و نوع اکانت << ${item.typeTitle} >> نباید از قیمت فروش به شما کمتر باشد. حداقل قیمت می بایست بزرگتر یا برابر با <<${addCommas(digitsEnToFa(item.ownerPrice))}>>. ردیف شماره ${digitsEnToFa(index+1)} چک گردد.`,
                    severity: 'error'
                })
                return false;
            }
        })
    }

    function ClearErrors(){
        setError({
            isValid: true,
            errorMsg: "",
            severity: 'error'
        });
        setPlanError({
            isValid: true,
            errorMsg: "",
            severity: 'error'
        })
    }


    async function btnFinalHandler(e) {
        e.preventDefault();
        console.log(formData);
        setDisableBtn(true);
        if (ValidateFormData() == false)
            return;
        if (!isEmail(formData.email)) {
            setError({
                isValid: false,
                errorMsg: "فرمت ایمیل صحیح نمی باشد.",
                severity: 'error'
            });
            return;
        }

        if (ValidatePlansData() == false)
            return;
        ClearErrors();

        var obj = {
            agent: formData,
            plans: plans
        }
        var result = await axios.post(apiUrls.agentUrl.defineSubAgentUrl, obj);
        if(result.data.result.isValid==true){
            setPlanError({
                isValid:false,
                errorMsg:"عملیات با موفقیت انجام گردید.",
                severity:'success'
            })
        }else{
            setPlanError({
                isValid:false,
                errorMsg:result.data.result.errorMsg,
                severity:'error'
            })
        }
        setDisableBtn(false);
    }

    return <div>
        {
            agentInformation != undefined && agentWallet != undefined && <>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title='اطلاعات نماینده فروش شما' titleTypographyProps={{ variant: 'h6' }} />
                            <Divider sx={{ margin: 0 }} />
                            <AgentProfileComponent formDataHandler={formDataHandler} agentInformation={agentInformation} agentWallet={agentWallet}></AgentProfileComponent>
                            <Divider></Divider>
                            <Table>
                                <TableFooter>
                                    <TableRow style={{ paddingLeft: '100px' }}>
                                        {error.isValid == false && <Alert severity={error.severity}>{error.errorMsg}</Alert>}
                                        <Grid item xs={12} >

                                        </Grid>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Card>
                    </Grid>
                    <Divider></Divider>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title='تعریف قیمت نماینده فروش' titleTypographyProps={{ variant: 'h6' }} />
                            <Divider sx={{ margin: 0 }} />
                            <CardContent>
                                <AgentPriceComponent changePriceHandler={changePriceHandler} plans={plans}></AgentPriceComponent>
                            </CardContent>
                            <Divider></Divider>
                            <Table>
                                <TableFooter>
                                    <TableRow style={{ paddingLeft: '100px' }}>
                                        {planError.isValid == false && <Alert severity={planError.severity}>{planError.errorMsg}</Alert>}
                                        <Button size='large' sx={{ mr: 2 }} disabled={disableBtn} variant='contained' onClick={btnFinalHandler}>تعریف ایجنت جدید</Button>
                                        <Grid item xs={12} >

                                        </Grid>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Card>
                    </Grid>
                </Grid>
            </>
        }

    </div>
}

export default Index
