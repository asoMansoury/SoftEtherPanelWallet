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
import { SubAgentsTable } from './Components/SubAgentsTable';
import SubAgentDetails from './Components/SubAgentDetails';
import AgentWalletComponent from './AgentWalletComponents/AgentWalletComponent';

const Index = () => {
    const { data: session, status } = useSession();
    const [agentInformation, setAgentInformation] = useState();

    const [isSubAgentSelected, setSubAgentSelected] = useState(false);
    const [isSubAgentWallet, setIsSubAgentWallet] = useState(false);
    const [subAgents, setSubAgents] = useState();
    const [subAgentInformation, setSubAgentInformation] = useState();
    const [selectedRow,setSelectedRow] = useState();

    const [disableBtn, setDisableBtn] = useState(false)
    const [loading, setLoading] = useState(false);
    useEffect(async () => {
        setDisableBtn(true);
        if (status === "authenticated") {
            if (session.user.isAgent == true) {
                var getSubAgents = await axios.get(apiUrls.SubAgentUrl.GetAllSubAgentsUrl);
                setAgentInformation(getSubAgents.data.agentInformation);
                setSubAgents(getSubAgents.data.subAgents);
            }
        }
    }, [status]);

    async function btnShowDetailHandler(row) {
        setLoading(true);
        setIsSubAgentWallet(false);
        var getSubAgents = await axios.get(apiUrls.agentUrl.getAgentInformation + row.agentcode);
        setSubAgentInformation(getSubAgents.data.name);
        setSubAgentSelected(true);

        setLoading(false);
    }

    async function btnManaginWalletHandler(row){
        setSelectedRow(row);
        setLoading(true);
        setSubAgentSelected(false);
        var getSubAgents = await axios.get(apiUrls.agentUrl.getAgentInformation + row.agentcode);
        setIsSubAgentWallet(true);
        setSubAgentInformation(getSubAgents.data.name);
        setLoading(false); 
    }



    return <div>
        {
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title='اطلاعات نماینده فروش شما' titleTypographyProps={{ variant: 'h6' }} />
                        <Divider sx={{ margin: 0 }} />
                        <SubAgentsTable subAgents={subAgents} btnShowDetailHandler={btnShowDetailHandler} btnManaginWalletHandler={btnManaginWalletHandler}></ SubAgentsTable>
                        <Divider></Divider>
                        {
                            loading &&
                            <Alert severity="info">در حال بارگزاری اطلاعات لطفا منتظر بمانید...</Alert>
                        }
                        {
                            isSubAgentSelected == true &&
                            <SubAgentDetails  subAgentInformation={subAgentInformation}></SubAgentDetails>
                        }
                        {
                            isSubAgentWallet == true && 
                                <AgentWalletComponent selectedRow={selectedRow}  btnManaginWalletHandler={btnManaginWalletHandler} subAgentInformation={subAgentInformation}></AgentWalletComponent>
                        }

                    </Card>
                </Grid>
                <Divider></Divider>

            </Grid>
        }

    </div>
}

export default Index
