// ** MUI Imports
import Grid from '@mui/material/Grid'
import FormLayoutTypeBasket from 'src/views/baskets/FormLayoutTypeBasket'
import { apiUrls } from 'src/configs/apiurls';

// ** Demo Components Imports
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {  useSession } from 'next-auth/react';
const Cisco = () => {
  const [tariffs, setTariffs] = useState([]);
  const [agent,setAgent]=useState("nobody");
  const [agentInformation,setAgentInformation]=useState();
  const {  data:session,status } = useSession();
  const [profileSelector,setProfileSelector] = useState({
    isLoggedIn:false
  });
  
  useEffect(async()=>{
    //var session =await getSession();
    await axios.get(apiUrls.localUrl.getTariffsUrl+apiUrls.types.Cisco).then(data =>{
      setTariffs(data.data)
    });
    if(status ==="authenticated"){
      setProfileSelector({
        email:session.user.email,
        isLoggedIn:true
      });

      await axios.get(apiUrls.agentUrl.isAgentUrl+profileSelector.email).then(response=>{
        if(response.data.name.isAgent==true){
          getAgentInformation(response.data.name.agentcode);
        }else{
          getIntroducerAgent();

        }
      });
    }
  },[status])

  async function getIntroducerAgent(){
    await axios.get(apiUrls.userUrl.getUserInformationByEmail+profileSelector.email)
    .then((response)=>{
      var userDetail = response.data.name;
      if(userDetail.isfromagent==true){
        setAgent(userDetail.agentIntoducer);
        getAgentInformation(userDetail.agentIntoducer);
      }else{
        setAgent("nobody");
      }
    })
  }
  async function getAgentInformation(agentCode){
    setAgent(agentCode);
    var url = apiUrls.agentUrl.getAgentInformation+agentCode+`&type=${apiUrls.types.Cisco}`;
    axios.get(url).then(data =>{
      setAgentInformation(data.data.name);
      var tariffsTmp = data.data.name.tariff;
      var agentTariffs = data.data.name.agentTariffs;
      tariffHandler(tariffsTmp,agentTariffs)
    });
  }

  function tariffHandler(tariffsTmp,agentTariffs){
    var tmpTariffs=  [];
    tariffsTmp.forEach(element => {
      let result =agentTariffs.find(z=>z.tarrifcode==element.code);
      tmpTariffs.push(element);
    });
    setTariffs({name:tmpTariffs});
  }



  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
          {
            agentInformation&&(agent!='nobody')&&status=="authenticated"&&
            <FormLayoutTypeBasket typeVpn = {apiUrls.types.Cisco} agentData={agentInformation} tariffs={tariffs} agent={agent} />

          }

          {
            (agent=='nobody')&&status=="authenticated"&&
            <FormLayoutTypeBasket typeVpn = {apiUrls.types.Cisco} agentData={agentInformation} tariffs={tariffs} agent={agent} />

          }
        </Grid>
  </Grid>
  )
}

export default Cisco
