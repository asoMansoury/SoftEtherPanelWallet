import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiUrls } from "src/configs/apiurls";
import Grid from '@mui/material/Grid'
import {CardHeader,Card} from "@mui/material";
import Divider from "src/@core/theme/overrides/divider";
import AccountsTable from "./components/AccountsTable";
import CircularProgress from '@mui/material/CircularProgress';

const FinalStep = ()=>{
    const router = useRouter();
    const [servers,setServers] = useState([]);
    const [customer,setCustomer] = useState();
    const [data,setData]= useState();
    const [users,setUsers] = useState([]);
    const [basket,setBasket] = useState();
    const [showLoadingProgress,setShowLoadingProgress]= useState(false)

    useEffect(async ()=>{
      var uuid = router.query.uuid;

      var obj ={
        agent:router.query.tariffPlans,
        plans:router.query.agent,
        uuid:uuid
      }

      setShowLoadingProgress(true);
      await GetBasketByUUID(obj);
    },[]);

    async function GetBasketByUUID(obj){
     const result = await axios.post(apiUrls.userUrl.insertuserbasketUrl,{UUID:obj.uuid});
     setData(result.data.result);
     createNewUser(result.data.result);
    }

    const createNewUser = async (objPlan) => {
        try {
          var url =apiUrls.userUrl.createNewUserUrl;
          const response = await axios.post(url, { UUID: objPlan.uuid });
          if(response.data.name.isValid==true){
            setBasket(response.data.name.basket);
            setUsers(response.data.name.users);
            setCustomer(response.data.name.customer); 
            setServers(response.data.name.servers);
            setShowLoadingProgress(false);
          }
        } catch (error) {
          console.error(error);
        }

    };
    
    return   (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="لیست اکانت های خریداری شده" titleTypographyProps={{ variant: 'h6' }} />
            {
              (servers&&users&&basket) && 
                  <AccountsTable users = {users} basket={basket}></AccountsTable>
            }
          </Card>
        </Grid>
        <Grid style={{marginTop:'20px'}}>
            {
              showLoadingProgress&&
              <div style={{display:'flex', justifyContent:'center'}}>
                  <CircularProgress></CircularProgress>
              </div>
            }
        </Grid>
        {/* <Grid style={{marginTop:'20px'}}>
            {
              !showLoadingProgress&&
              <div style={{display:'flex', justifyContent:'center'}}>
                  <Card>
                    <CardHeader title="لیست اکانت های خریداری شده" titleTypographyProps={{ variant: 'h6' }} />
                    {
                      (servers&&users&&basket) && 
                          <AccountsTable users = {users} basket={basket}></AccountsTable>
                    }
                  </Card>
              </div>
            }
        </Grid> */}
      </Grid>
    )
}

export default FinalStep;