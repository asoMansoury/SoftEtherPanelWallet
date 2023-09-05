import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI, formatDate } from 'src/lib/utils';
import GetUsersBasketByUUID, { GetUsersBasketByUsername } from '../usersbasket/getusersbasket';
import { getAgentPlans } from '../tariffagent/getAgentPlans';
import { getTariffs } from '../tariff/getTariff';
import { getTariffPrices } from '../tariff/tariffPrice';
import { apiUrls } from 'src/configs/apiurls';
import GetServers from '../server/getservers';
import { DeleteUserCisco } from 'src/lib/Cisco/deleteuser';
import { RemoveUserSoftEther } from 'src/lib/createuser/RemoveUserSoftEther';
import { RemoveUserOpenVpn } from 'src/lib/OpenVpn/RemoveUserOpenVpn';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});




export async function DeleteExpiredUsersJob(date) {
    const today = new Date();

    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');
        const allExpiredUsers = await collection.find({
            expires: { $lt: formatDate(today) },
            removedFromServer: false
        }).toArray();


        var CiscoServers = await GetServers(apiUrls.types.Cisco);
        var SoftEtherServers = await GetServers(apiUrls.types.SoftEther);
        var OpenVpnServers = await GetServers(apiUrls.types.OpenVpn);
        for (const user of allExpiredUsers) {
            if (user.type === apiUrls.types.Cisco) {
                var selectedServer = CiscoServers.filter(server => server.servercode == user.servercode)[0];
                DeleteUserCisco(selectedServer, user.username);
                user.removedFromServer = true;

                //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                const filter = { _id: user._id };
                const updateOperation = { $set: user };
                await collection.updateOne(filter, updateOperation);
            } else if (user.type === apiUrls.types.SoftEther) {
                var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.servercode)[0];
                user.removedFromServer = true;
                //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                RemoveUserSoftEther(selectedSoftEtherServer, user);
                const filter = { _id: user._id };
                const updateOperation = { $set: user };
                await collection.updateOne(filter, updateOperation);
            } else if (user.type === apiUrls.types.OpenVpn) {
                var selectedOpenVpnServer = OpenVpnServers.filter(server => server.servercode == user.servercode)[0];
                user.removedFromServer = true;
                //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                RemoveUserOpenVpn(selectedOpenVpnServer, user);
                const filter = { _id: user._id };
                const updateOperation = { $set: user };
                await collection.updateOne(filter, updateOperation);
            }
        }

        return allExpiredUsers;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}




export default DeleteExpiredUsersJob;