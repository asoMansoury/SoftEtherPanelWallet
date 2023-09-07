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
import { CreateUserOnCisco } from 'src/lib/Cisco/createuser';
import { CreateUserOnSoftEther } from 'src/lib/createuser/createuser';
import { emailForDisconnectedUsers, emailForReconnectingUsers } from 'src/lib/Emails/emailForDisconnectedUsers';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});




export async function DeleteUserOfAgent(email, agentcode, username, isAdmin) {
    const today = formatDate(new Date());

    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');
        const allExpiredUsers = await collection.find({
            username: username,
            agentcode: agentcode,
            expires: { $gt: today }
        }).toArray();

        var CiscoServers = await GetServers(apiUrls.types.Cisco);
        var SoftEtherServers = await GetServers(apiUrls.types.SoftEther);
        for (const user of allExpiredUsers) {
            if (user.removedFromServer == false) {
                user.removedByAgent = isAdmin == false ? true : false;
                user.removedByAdmin = isAdmin == true ? true : false;
                if (user.type === apiUrls.types.Cisco) {
                    var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                    DeleteUserCisco(selectedServer, user.username);
                    user.removedFromServer = true;

                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    emailForDisconnectedUsers(user.email, "دلیل قطع شدن اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                } else if (user.type === apiUrls.types.SoftEther) {
                    var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.servercode)[0];
                    user.removedFromServer = true;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    RemoveUserSoftEther(selectedSoftEtherServer, user);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    emailForDisconnectedUsers(user.email, "دلیل قطع شدن اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                }

            } else {
                user.removedByAgent = false;
                user.removedByAdmin = false;
                if (user.type === apiUrls.types.Cisco) {
                    var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                    CreateUserOnCisco(selectedServer, user.username, user.password, user.expires);
                    user.removedFromServer = false;

                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    emailForReconnectingUsers(user.email, "فعال شدن مجدد اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                } else if (user.type === apiUrls.types.SoftEther) {
                    var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.currentservercode)[0];
                    user.removedFromServer = false;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    CreateUserOnSoftEther(selectedServer, user, user.policy, user.expires);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                    emailForReconnectingUsers(user.email, "فعال شدن مجدد اکانت...(ایمیل اتوماتیک است)", email, selectedServer, user);
                }

            }

        }

        return allExpiredUsers;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}


export async function DeleteUserOfByClient(username) {
    const today = formatDate(new Date());
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');
        const allExpiredUsers = await collection.find({
            username: username,
            expires: { $gt: today }
        }).toArray();

        var CiscoServers = await GetServers(apiUrls.types.Cisco);
        var SoftEtherServers = await GetServers(apiUrls.types.SoftEther);
        for (const user of allExpiredUsers) {
            if (user.removedFromServer == false) {
                if (user.type === apiUrls.types.Cisco) {
                    var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
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
                }

            } else {
                if (user.type === apiUrls.types.Cisco) {
                    var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                    CreateUserOnCisco(selectedServer, user.username, user.password, user.expires);
                    user.removedFromServer = false;

                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                } else if (user.type === apiUrls.types.SoftEther) {
                    var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.currentservercode)[0];
                    user.removedFromServer = false;
                    //after deleting account from server it's necessary to set removedFromServer flag to true and update it's doc
                    CreateUserOnSoftEther(selectedServer, user, user.policy, user.expires);
                    const filter = { _id: user._id };
                    const updateOperation = { $set: user };
                    await collection.updateOne(filter, updateOperation);
                }

            }

        }

        return allExpiredUsers;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}





export default DeleteUserOfAgent;