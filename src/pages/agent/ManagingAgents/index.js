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
import SubAgentsTable from '../ManagingSubAgents/Components/SubAgentsTable';
import AgentWalletComponent from '../ManagingSubAgents/AgentWalletComponents/AgentWalletComponent';
import SubAgentDetails from '../ManagingSubAgents/Components/SubAgentDetails';
import IncAgentWalletComponent from './Components/IncAgentWalletComponent';
import DecAgentWalletComponent from './Components/DecAgentWalletComponent';

const index = () => {
    const { data: session, status } = useSession();
    const [agentInformation, setAgentInformation] = useState();
    const [selectedRow, setSelectedRow] = useState();
    const [subAgentInformation, setSubAgentInformation] = useState();
    const [agents, setAgents] = useState();
    const [mainRows, setMainRows] = useState([]);
    const [isSubAgentSelected, setSubAgentSelected] = useState(false);
    const [usernameForSearch, setUserNameForSearch] = useState("");
    const [isSubAgentWallet, setIsSubAgentWallet] = useState(false);
    const [isIncAgentWallet, setIsIncAgentWallet] = useState(false);
    const [isDecAgentWallet,setIsDecAgentWallet] = useState(false);

    const [disableBtn, setDisableBtn] = useState(false)
    const [loading, setLoading] = useState(false);
    useEffect(async () => {
        setDisableBtn(true);
        if (status === "authenticated") {
            if (session.user.isAdmin == true) {
                LoadAllMainAgents();
            }
        }
    }, [status]);

    async function LoadAllMainAgents() {
        var agents = await axios.get(apiUrls.agentUrl.GetAllAgentsUrl);
        setAgents(agents.data.subAgents);
        setMainRows(agents.data.subAgents);
    }
    async function LoadAgentUsers(agentcode) {
        setAgentInformation(null);
        var result = await axios.get(apiUrls.agentUrl.getAgentInformation + agentcode);
        setAgentInformation(result.data.name);
    }


    const searchByUserNameHandler = (e) => {
        e.preventDefault();
        setUserNameForSearch(e.target.value);
        var tmp = mainRows;
        setAgents([]);
        var findedElements = tmp.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setAgents(findedElements);

    }

    async function btnShowDetailHandler(row) {
        LoadAgentUsers(row.agentcode);
    }

    async function btnManaginWalletHandler(row) {
        setSelectedRow(row);
        clearForm(false);
        var getSubAgents = await axios.get(apiUrls.agentUrl.getAgentInformation + row.agentcode);
        setIsSubAgentWallet(true);
        setSubAgentInformation(getSubAgents.data.name);
    }

    async function btnIncreateAgentHandler(row){
        setSelectedRow(row);
        setLoading(true);
        clearForm();
        var getSubAgents = await axios.get(apiUrls.agentUrl.getAgentInformation + row.agentcode);
        setIsIncAgentWallet(true);
        setSubAgentInformation(getSubAgents.data.name);
        setLoading(false); 
    }

    async function btnDecAgentHandler(row){
        setSelectedRow(row);
        setLoading(true);
        clearForm();
        var getSubAgents = await axios.get(apiUrls.agentUrl.getAgentInformation + row.agentcode);
        setIsDecAgentWallet(true);
        setSubAgentInformation(getSubAgents.data.name);
        setLoading(false); 
    }
    
    function clearForm(){
        setIsIncAgentWallet(false);
        setSubAgentSelected(false);
        setSubAgentSelected(false);
        setIsSubAgentWallet(false);
        setIsDecAgentWallet(false);
        setSubAgentInformation(null);
        setAgentInformation(null);
    }

    return <div>

        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Grid container spacing={6}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                        <TextField name="username"
                            type='input'
                            value={usernameForSearch}
                            onChange={searchByUserNameHandler}
                            fullWidth label='نام کاربر' placeholder='جسجتو اکانت بر اساس نام کاربری' />
                    </Grid>
                </Grid>
                <Divider></Divider>
                <Card>
                    <SubAgentsTable btnDecAgentHandler={btnDecAgentHandler} btnIncreateAgentHandler={btnIncreateAgentHandler} subAgents={agents} btnShowDetailHandler={btnShowDetailHandler} btnManaginWalletHandler={btnManaginWalletHandler}></SubAgentsTable>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    {
                        agentInformation != undefined && status == 'authenticated' && <>
                            <Divider></Divider>
                            {
                                loading &&
                                <Alert severity="info">در حال بارگزاری اطلاعات لطفا منتظر بمانید...</Alert>
                            }
                            <AgentUsersTable email={agentInformation.customer.email}></AgentUsersTable>

                            {
                                isSubAgentSelected == true &&
                                <SubAgentDetails subAgentInformation={subAgentInformation}></SubAgentDetails>
                            }
                        </>
                    }

                    {
                        isSubAgentWallet == true &&
                        <AgentWalletComponent selectedRow={selectedRow} btnManaginWalletHandler={btnManaginWalletHandler} subAgentInformation={subAgentInformation}></AgentWalletComponent>
                    }
                                        {
                        isIncAgentWallet == true &&
                        <IncAgentWalletComponent selectedRow={selectedRow} btnManaginWalletHandler={btnManaginWalletHandler} subAgentInformation={subAgentInformation}></IncAgentWalletComponent>
                    }
                    {
                        isDecAgentWallet == true &&
                        <DecAgentWalletComponent selectedRow={selectedRow} btnManaginWalletHandler={btnManaginWalletHandler} subAgentInformation={subAgentInformation}></DecAgentWalletComponent>
                    }
                </Card>
            </Grid>

        </Grid>


    </div>
}

export default index
