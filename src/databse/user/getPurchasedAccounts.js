import { MongoClient, ServerApiVersion } from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { MONGO_URI } from 'src/lib/utils';
import { GetCustomerByEmail } from '../customers/getcustomer';
import { GetAgentByUserCode, IsAgentValid } from '../agent/getagentinformation';
import GetServers, { GetAllServers } from '../server/getservers';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

function wrappUsers(data, servers) {

    var result = data.map((item) => {
        var typeTitle = "";
        if (item.type == apiUrls.types.SoftEther)
            typeTitle = "ایران";
        else if (item.type == apiUrls.types.Cisco)
            typeTitle = "سیسکو"
        else if (item.type == apiUrls.types.OpenVpn)
            typeTitle = "اپن وی پی ان"
        else if (item.type == apiUrls.types.VpnHood)
            typeTitle = "Vpnhood"

        var selectedServer = servers.filter((z) => z.servercode == item.currentservercode)[0];
        if(selectedServer==null)
            selectedServer  = servers.filter((z)=>z.type===apiUrls.types.SoftEther)[0];
        return {
            email: item.email,
            username: item.username,
            expires: item.expires,
            type: item.type,
            typeTitle: typeTitle,
            userwithhub: item.userwithhub,
            removedFromServer: item.removedFromServer,
            servertitle: selectedServer.title,
            servercode:selectedServer.servercode,
            removedBySubAgent:item.removedBySubAgent,
            removedByAgent:item.removedByAgent,
            removedByAdmin:item.removedByAdmin
        }
    });
    return result;
}
async function GetPurchasedAccounts(email,token) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');

        const agentDoc = await IsAgentValid(email);
        const servers = await GetAllServers();
        if(token.isAdmin==true){
            const data = (await collection.find({ agentcode: agentDoc.agentcode }).sort({ _id: -1 }).toArray());
            return wrappUsers(data, servers);
        }else if(token.isAgent==true&& token.isSubAgent==false){
            const data = (await collection.find({ agentcode: agentDoc.agentcode,removedByAdmin:{ $ne: true } }).sort({ _id: -1 }).toArray());
            return wrappUsers(data, servers);
        }else if(token.isAgent==true && token.isSubAgent==true){
            const data = (await collection.find({ agentcode: agentDoc.agentcode,removedByAdmin:{ $ne: true },removedByAgent:{ $ne: true }  }).sort({ _id: -1 }).toArray());
            return wrappUsers(data, servers);
        }else{
            const data = (await collection.find({ email: { $regex: `^${email}$`, $options: "i" },removedByAdmin:{ $ne: true },removedByAgent:{ $ne: true },removedBySubAgent:{ $ne: true } }).sort({ _id: -1 }).toArray());
            return wrappUsers(data, servers);
        }

    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}

export async function GetPurchasedAccountsForAgents(email,token) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');

        const agentDoc = await IsAgentValid(email);
        const servers = await GetAllServers();

        if(token.isAdmin==true){
            const data = (await collection.find({ agentcode: agentDoc.agentcode,removedByAdmin:{ $ne: true } }).sort({ _id: -1 }).toArray());
            return wrappUsers(data, servers);
        }else if(token.isAgent==true&& token.isSubAgent==false){
            const data = (await collection.find({ agentcode: agentDoc.agentcode,removedByAdmin:{ $ne: true } }).sort({ _id: -1 }).toArray());
            return wrappUsers(data, servers);
        }else if(token.isAgent==true && token.isSubAgent==true){
            const data = (await collection.find({ agentcode: agentDoc.agentcode,removedByAdmin:{ $ne: true },removedByAgent:{ $ne: true }  }).sort({ _id: -1 }).toArray());
            return wrappUsers(data, servers);
        }else{
            const data = (await collection.find({ email: { $regex: `^${email}$`, $options: "i" },removedByAdmin:{ $ne: true },removedByAgent:{ $ne: true },removedBySubAgent:{ $ne: true } }).sort({ _id: -1 }).toArray());
            return wrappUsers(data, servers);
        }


    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}

export async function GetUserInformation(username) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');

        const data = (await collection.findOne({ username: username }));

        return {
            email: data.email,
            username: data.username,
            expires: data.expires,
            type: data.type,
            agentcode: data.agentcode,
            isfromagent: data.isfromagent
        }
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}


export async function GetUserInformationByEmail(email) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');

        const data = (await collection.findOne({ email: { $regex: `^${email}$`, $options: "i" } }));

        return {
            expires: data.expires,
            type: data.type,
            agentcode: data.agentcode,
            isfromagent: data.isfromagent,
            agentIntoducer: data.agentIntoducer
        }
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}


export default GetPurchasedAccounts;