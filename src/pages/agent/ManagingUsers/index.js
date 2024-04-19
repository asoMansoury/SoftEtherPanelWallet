// ** MUI Imports
import Grid from '@mui/material/Grid'
import { apiUrls } from 'src/configs/apiurls';
import { Alert } from '@mui/material';
// ** Demo Components Imports
import { useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
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
                        
                    </Card>
                    <AgentUsersTable email={agentInformation.customer.email}></AgentUsersTable>
                </Grid>
                <Divider></Divider>

            </Grid>
        }

    </div>
}

export default Index
