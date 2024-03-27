import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import {  sendEmailCiscoClient } from 'src/lib/emailsender';
import { GenerateOneMonthExpiration, GenerateRandomPassword, GenerateTestExpiration, MONGO_URI, formatDate } from 'src/lib/utils';
import GetServerByCode from '../server/getServerByCode';
import GetServers, { GetServersForTest } from '../server/getservers';
import { CreateUserOnCisco } from 'src/lib/Cisco/createuser';
import { GetCustomerByEmail } from '../customers/getcustomer';
import { DeleteUserCisco } from 'src/lib/Cisco/deleteuser';
import { RemoveUserSoftEther } from 'src/lib/createuser/RemoveUserSoftEther';
import { RemoveUserOpenVpn } from 'src/lib/OpenVpn/RemoveUserOpenVpn';


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
            }
        }

        return allExpiredUsers;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}
