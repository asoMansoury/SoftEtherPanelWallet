import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI, formatDate } from 'src/lib/utils';
import { apiUrls } from 'src/configs/apiurls';
import { RestartUserCisco } from 'src/lib/Cisco/restartuser';
import { RestartOpenVPNUser } from 'src/lib/OpenVpn/RestartOpenVPNUser';
import { GetServersByRemoved } from 'src/databse/server/getservers';
import { GetVpnHoodConfiguration } from 'src/databse/VpnhoodConfiguration/getVpnHoodConfiguration';
import { RestartVpnhoodUserAccount } from 'src/lib/Vpnhood/CreateNewUserVpnhood';
import { UpdateVpnHoodInformation } from '../Vpnhood/ChangeServerForVpnHood';



const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});




export async function RestartUserConnection(username) {
    const today = formatDate(new Date());
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');
        const allExpiredUsers = await collection.find({
            username: username
        }).toArray();
        var CiscoServers = await GetServersByRemoved(apiUrls.types.Cisco,true);
        var SoftEtherServers = await GetServersByRemoved(apiUrls.types.SoftEther,true);
        var OpenVpnServers = await GetServersByRemoved(apiUrls.types.OpenVpn,true);
        var VpnHoodServers = await GetServersByRemoved(apiUrls.types.VpnHood,true);
        var vpnHoodConfiguration = await GetVpnHoodConfiguration(apiUrls.vpnhoodTypes.All);
        var requestedType = apiUrls.types.Cisco;
        var newGeneratedVpnHoodUser;
        for (const user of allExpiredUsers) {
            if (user.type === apiUrls.types.Cisco) {
                var selectedServer = CiscoServers.filter(server => server.servercode == user.currentservercode)[0];
                RestartUserCisco(selectedServer, user.username,user.password);
            }
            if (user.type === apiUrls.types.SoftEther) {
                var selectedSoftServer = SoftEtherServers.filter(server => server.servercode == user.currentservercode)[0];
                RestartUserCisco(selectedSoftServer, user.username,user.password);

            }
            else if (user.type === apiUrls.types.OpenVpn) {

                var selectedOpenVpnServer = OpenVpnServers.filter(server => server.servercode == user.currentservercode)[0];

                RestartOpenVPNUser(selectedOpenVpnServer, user);
            }else if(user.type===apiUrls.types.VpnHood){
                requestedType=apiUrls.types.VpnHood;
                var selectedVpnhoodServer = VpnHoodServers.filter(server => server.servercode == user.currentservercode)[0];
                var resultToken =await  RestartVpnhoodUserAccount(selectedVpnhoodServer,
                                          user,
                                          vpnHoodConfiguration.bearerToken,
                                          vpnHoodConfiguration.vpnhoodBaseUrl); 
                if(resultToken.existed==false) {
                    user.currenthubname = resultToken.accessTokenId;
                    newGeneratedVpnHoodUser=user;
                    UpdateVpnHoodInformation(user);
                    return user;
                }
            }

        }
        if(requestedType===apiUrls.types.VpnHood)
        {
        }else{
            return allExpiredUsers;
        }

    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}





export default RestartUserConnection;