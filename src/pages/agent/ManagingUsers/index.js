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
import { ValidateUIElements } from 'src/lib/utils';
import AgentUsersTable from './Components/AgentUsersTable';

const Index = () => {
    const { data: session, status } = useSession();
    const [agentInformation, setAgentInformation] = useState();

    const [error, setError] = useState({
        isValid: true,
        errosMsg: "",
        severity: "error"
    })

    const [disableBtn, setDisableBtn] = useState(false)
    const [loading, setLoading] = useState(false);
    useEffect(async () => {
        setDisableBtn(true);
        if (status === "authenticated") {
            if (session.user.isAgent == true) {
                var result = await axios.get(apiUrls.agentUrl.getAgentInformation+session.user.agentcode);
                setAgentInformation(result.data.name);
                console.log(result.data.name);
            }
        }
    }, [status]);



    return <div>
        {
            agentInformation!=undefined && status == 'authenticated' &&
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <Divider></Divider>
                        {
                            loading &&
                            <Alert severity="info">در حال بارگزاری اطلاعات لطفا منتظر بمانید...</Alert>
                        }
                        <AgentUsersTable email={agentInformation.customer.email}></AgentUsersTable>
                    </Card>
                </Grid>
                <Divider></Divider>

            </Grid>
        }

    </div>
}

export default Index
