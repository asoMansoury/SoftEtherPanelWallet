import {MongoClient,ServerApiVersion} from 'mongodb';
import {  MONGO_URI } from 'src/lib/utils';
import  { GetAllEnabledServers, GetServersForRestartServer, GetServersForTest } from '../server/getservers';
import { EnableIPV4Commands } from 'src/lib/AdminConfigs/EnableIPV4Commands';
import { apiUrls } from 'src/configs/apiurls';
import { RestartOpenVpn } from 'src/lib/AdminConfigs/RestartOpenVpn';



const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function RestartOpenVpnFunc(){
    try{
        //  const connectionState =  await client.connect();

        //  const db = client.db('SoftEther');
        //  const serverCollection = db.collection('Servers');
        // const basketCollection = db.collection('UsersBasket');
        var servers = await GetServersForRestartServer(apiUrls.types.OpenVpn);
        servers.forEach((item)=>{
            RestartOpenVpn(item);
        });

                                                
        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}





export default RestartOpenVpnFunc;