import {MongoClient,ServerApiVersion} from 'mongodb';
import {  MONGO_URI } from 'src/lib/utils';
import  { GetAllEnabledServers, GetServersForRestartServer } from '../server/getservers';
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

async function EnableIPV4(){
    try{
        //  const connectionState =  await client.connect();

        //  const db = client.db('SoftEther');
        //  const serverCollection = db.collection('Servers');
        // const basketCollection = db.collection('UsersBasket');
        var servers = await GetAllEnabledServers();
        servers.forEach((item)=>{
            EnableIPV4Commands(item);
        });

        // var serversForManaging  = await GetServersForRestartServer(apiUrls.types.OpenVpn);
        // serversForManaging.forEach((item)=>{
        //     RestartOpenVpn()
        // });
        
                                                
        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}





export default EnableIPV4;