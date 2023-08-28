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
import SubAgentUsersTable from './SubAgentUsersTable';

const SubAgentDetails = (props) => {
    const [agentInformation, setAgentInformation] = useState();
    const [agentWallet, setAgentWallet] = useState();
    const [customer, setCustomer] = useState();


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
        }

    }, [props]);



    return <div>
        {
            agentInformation != undefined && agentWallet != undefined &&
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title='جزئیات نماینده فروش' titleTypographyProps={{ variant: 'h6' }} />
                        <Divider sx={{ margin: 0 }} />
                        <CardContent>
                            <Grid container spacing={6}>
                                <Grid item xs={12}>
                                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                        ایمیل
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label='ایمیل' placeholder='carterLeonard' value={customer.email} disabled={true} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Alert severity='info'>موجودی نماینده فروش در حال حاضر : {addCommas(digitsEnToFa(agentWallet.cashAmount))} تومان می باشد</Alert>
                                </Grid>
                                <Divider></Divider>
                                <Grid item xs={12}>
                                    <SubAgentUsersTable  email = {customer.email}></SubAgentUsersTable>
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

export default SubAgentDetails
