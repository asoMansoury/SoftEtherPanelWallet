// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FormLayoutTypeBasket from 'src/views/baskets/FormLayoutTypeBasket'
import { useRouter } from 'next/router';

// ** Demo Components Imports
import FormLayoutsSeparator from 'src/views/form-layouts/FormLayoutsSeparator'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { apiUrls } from 'src/configs/apiurls';
import { useUserState } from 'src/configs/useUserState ';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

const Cisco = () => {
    const router = useRouter();
    const [agent,setAgent] = useState();
    const [tariffs, setTariffs] = useState([]);
    const [agentInformation,setAgentInformation]=useState();

    const {  data:session,status } = useSession();
    const [profileSelector,setProfileSelector] = useState({
      isLoggedIn:false
    });
    
    useEffect(async()=>{

      if(status ==="authenticated"){
        setProfileSelector({
          email:session.user.email,
          isLoggedIn:true
        });
      }
    },[status])

    useEffect(async ()=>{
      var agentCode = router.query['agent'];

      if(profileSelector.isLoggedIn==true){
        var userLoggedDetails =await axios.get(apiUrls.userUrl.getUserInformationByEmail+profileSelector.email)
        .then((response)=>{
          var userDetail = userLoggedDetails.data.name;
          if(userDetail.isfromagent==true){
            setAgent(userDetail.agentIntoducer);
            getAgentInformation(userDetail.agentIntoducer);
            agentCode=userDetail.agentIntoducer;
          }else{
            router.push('/cisco/');
          }
        })
      }
      
      if(router.query['agent']!= undefined ){
        setAgent(agentCode);
        getAgentInformation(agentCode);
      }else{
      }
    },[router.query]);

    async function getAgentInformation(agentCode){
      var url = apiUrls.agentUrl.getAgentInformation+agentCode+`&type=${apiUrls.types.Cisco}`;
      axios.get(url).then(data =>{
        var result = data.data.name.agentInformation;
        if(result==null){
          router.push('/cisco/');
        }else{
          setAgentInformation(data.data.name);
          var tariffsTmp = data.data.name.tariff;
          var agentTariffs = data.data.name.agentTariffs;
          tariffHandler(tariffsTmp,agentTariffs)
        }
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
            agentInformation!= undefined&&
            <FormLayoutTypeBasket typeVpn = {apiUrls.types.Cisco} agentData={agentInformation} tariffs={tariffs} agent={agent} />
          }
        </Grid>
  </Grid>
  )
}

export default Cisco;
