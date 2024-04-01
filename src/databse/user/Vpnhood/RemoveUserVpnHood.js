import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { GetVpnHoodConfiguration } from 'src/databse/VpnhoodConfiguration/getVpnHoodConfiguration';
import { apiUrls } from 'src/configs/apiurls';
import { DeleteVpnhoodUserAccount } from 'src/lib/Vpnhood/CreateNewUserVpnhood';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function RemoveUserVpnHood(server,user){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        var vpnHoodConfiguration = await GetVpnHoodConfiguration(apiUrls.vpnhoodTypes.All);
        var bearerToken = vpnHoodConfiguration.bearerToken;
        var vpnHoodBaseUrl = vpnHoodConfiguration.vpnhoodBaseUrl;
        await DeleteVpnhoodUserAccount(server, user.currenthubname, bearerToken, vpnHoodBaseUrl);
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}
