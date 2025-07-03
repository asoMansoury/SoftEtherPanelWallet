import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import {  MONGO_URI, formatDate } from 'src/lib/utils';

import GetServers from '../server/getservers';
import { DeleteUserCisco } from 'src/lib/Cisco/deleteuser';
import { RemoveUserOpenVpn } from 'src/lib/OpenVpn/RemoveUserOpenVpn';
import { DeleteVpnhoodUserAccount } from 'src/lib/Vpnhood/CreateNewUserVpnhood';
import { GetVpnHoodConfiguration } from '../VpnhoodConfiguration/getVpnHoodConfiguration';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



export async function DeleteExpiredTestedUsersJob(date){
    const today = new Date();
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TestAccounts');
        const allExpiredUsers = await await collection.find({ 
                                                                expires: { $lt: formatDate(today) },
                                                                removedFromServer:false
                                                            }).toArray();

        var servers=await GetServers(apiUrls.types.Cisco);
        var SoftEtherServers = await GetServers(apiUrls.types.SoftEther);
        var OpenVpnServers = await GetServers(apiUrls.types.OpenVpn);
        var VpnHoodServers = await GetServers(apiUrls.types.VpnHood);
        var vpnHoodConfiguration = await GetVpnHoodConfiguration(apiUrls.vpnhoodTypes.All);
        for (const user of allExpiredUsers) {
            if (user.type === apiUrls.types.Cisco) {
                var selectedServer = servers.filter(server=>server.servercode==user.servercode)[0];
                DeleteUserCisco(selectedServer,user.username);
                user.removedFromServer = true;

              //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
              const filter = { _id: user._id };
              const updateOperation = { $set: user };
              await collection.updateOne(filter, updateOperation);
            }else if (user.type === apiUrls.types.SoftEther){
                var selectedSoftEtherServer = SoftEtherServers.filter(server=>server.servercode==user.servercode)[0];
                user.removedFromServer = true;
                //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                DeleteUserCisco(selectedSoftEtherServer,user.username);
                const filter = { _id: user._id };
                const updateOperation = { $set: user };
                await collection.updateOne(filter, updateOperation);
            }else if(user.type === apiUrls.types.OpenVpn){
                var selectedOpenVpnServer = OpenVpnServers.filter(server=>server.servercode==user.servercode)[0];
                user.removedFromServer = true;
                //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                RemoveUserOpenVpn(selectedOpenVpnServer,user);
                const filter = { _id: user._id };
                const updateOperation = { $set: user };
                await collection.updateOne(filter, updateOperation);
            }else if(user.type === apiUrls.types.VpnHood){
                var selectedVpnhoodserver =VpnHoodServers.filter(server=>server.servercode==user.servercode)[0]; 
                user.removedFromServer = true;
                DeleteVpnhoodUserAccount(selectedVpnhoodserver,user.password,vpnHoodConfiguration.bearerToken,vpnHoodConfiguration.vpnhoodBaseUrl);
            }
        }

        return allExpiredUsers;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}
