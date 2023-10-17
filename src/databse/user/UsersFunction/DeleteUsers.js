import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI, formatDate } from 'src/lib/utils';
import { apiUrls } from 'src/configs/apiurls';
import { RestartUserCisco } from 'src/lib/Cisco/restartuser';
import { RestartOpenVPNUser } from 'src/lib/OpenVpn/RestartOpenVPNUser';
import GetServers from 'src/databse/server/getservers';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


function IsValidateForActivatingUser(token,user){
    if (token.isAgent == true && token.isSubAgent == false) {
        if (user.removedByAdmin == true) {
            return {
                isValid: false,
                errorMsg: "شما دسترسی انجام عملیات مورد نظر را ندارید."
            }
        }
    } else if (token.isAgent == true && token.isSubAgent == true) {
        if (user.removedByAdmin == true || user.removedByAgent == true) {
            return {
                isValid: false,
                errorMsg: "شما دسترسی انجام عملیات مورد نظر را ندارید."
            }
        }
    }else if(token.isAgent == false && token.isSubAgent == false){
        return {
            isValid: false,
            errorMsg: "شما دسترسی انجام عملیات مورد نظر را ندارید."
        }
    }
    return {
        isValid: true,
        errorMsg: ""
    }
}




export async function RestartUserConnection(username) {
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
        var OpenVpnServers = await GetServers(apiUrls.types.OpenVpn);
        for (const user of allExpiredUsers) {
            if (user.type === apiUrls.types.Cisco) {
                var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                RestartUserCisco(selectedServer, user.username,user.password);
            // } else if (user.type === apiUrls.types.SoftEther) {
            //var selectedSoftEtherServer = SoftEtherServers.filter(server => server.servercode == user.currentservercode)[0];
            //     RemoveUserSoftEther(selectedSoftEtherServer, user);

            // } 
            }else if (user.type === apiUrls.types.OpenVpn) {
                var selectedOpenVpnServer = OpenVpnServers.filter(server => server.servercode == user.currentservercode)[0];
                RestartOpenVPNUser(selectedOpenVpnServer, user);
            }

        }

        return allExpiredUsers;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}





export default RestartUserConnection;