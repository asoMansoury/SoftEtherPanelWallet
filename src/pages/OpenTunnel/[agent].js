// ** MUI Imports
import Grid from '@mui/material/Grid'
import FormLayoutTypeBasket from 'src/views/baskets/FormLayoutTypeBasket'
import { useRouter } from 'next/router';

// ** Demo Components Imports
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { apiUrls } from 'src/configs/apiurls';
import { useUserState } from 'src/configs/useUserState ';

const Basket = () => {
    const router = useRouter();
    const [agent,setAgent] = useState();
    const [tariffs, setTariffs] = useState([]);
    const [agentInformation,setAgentInformation]=useState();
    const {isLoggedIn,userEmail} = useUserState();
    
    useEffect(()=>{
      router.push('/openvpn');
      var agentCode = router.query['agent'];
      if(isLoggedIn==true)
        router.push('/openvpn');
      
      if(router.query['agent']!= undefined ){
        setAgent(agentCode);
        var url = apiUrls.agentUrl.getAgentInformation+agentCode+`&${apiUrls.types.SoftEther}`;
        axios.get(url).then(data =>{
          var result = data.data.name.agentInformation;
          if(result==null){
            router.push('/openvpn');
          }else{
            setAgentInformation(data.data.name);
            var tariffsTmp = data.data.name.tariff;
            var agentTariffs = data.data.name.agentTariffs;
            tariffHandler(tariffsTmp,agentTariffs)
          }
        });
      }else{
      }
    },[router.query]);

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
            agentInformation!= undefined&&
            <FormLayoutTypeBasket typeVpn = {apiUrls.types.Cisco} agentData={agentInformation} tariffs={tariffs} agent={agent} />
          }
        </Grid>
  </Grid>
  )
}

export default Basket;
