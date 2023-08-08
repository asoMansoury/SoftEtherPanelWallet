import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiUrls } from "src/configs/apiurls";
import Grid from '@mui/material/Grid'
import {CardHeader,Card, Typography} from "@mui/material";
import AccountsTable from "./components/AccountsTable";
import TutorialComponent from "src/views/tutorial";
import DownloadIcon from "src/views/iconImages/DownloadIcon";
import CircularProgress from '@mui/material/CircularProgress';

const FinalStep = ()=>{
    const router = useRouter();
    const [servers,setServers] = useState([]);
    const [customer,setCustomer] = useState();
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
     createNewUser(result.data.result);
    }

    const createNewUser = async (objPlan) => {
        try {
          var url =apiUrls.userUrl.createNewCiscoUserUrl;
          const response = await axios.post(url, { UUID: objPlan.uuid });

          setBasket(response.data.name.basket);
          setUsers(response.data.name.users);
          setCustomer(response.data.name.customer); 
          setServers(response.data.name.servers);
          setShowLoadingProgress(false);
        } catch (error) {
          console.error(error);
        }

    };
    
    return   (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={users&&basket?"لیست اکانت های خریداری شده":"در حال بارگزاری، لطفا منتظر بمانید..."} titleTypographyProps={{ variant: 'h6' }} />
            {
              users&&basket && 
                  <AccountsTable users = {users} basket={basket}></AccountsTable>
            }
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title={users&&basket?"دانلود نرم افزار مورد نیاز":"در حال بارگزاری..."} titleTypographyProps={{ variant: 'h6' }} />
            {
              users&&basket && 
              <div className="download-img-parent">
                <a target="_blank" href="/Tutorial/Cisco/" className="download-img-con btn-for-select" style={{cursor:'pointer'}} >
                      <DownloadIcon></DownloadIcon>
                      <div>
                        <Typography variant='h6' sx={{ marginBottom: 2 }}>
                          اینجا کلیک نمایید.
                        </Typography>
                      </div>
                </a>
            </div>
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
      </Grid>
    )
}

export default FinalStep;