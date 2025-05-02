import { MongoClient, ServerApiVersion } from "mongodb";
import { apiUrls } from "src/configs/apiurls";
import { GetVpnHoodConfiguration } from "src/databse/VpnhoodConfiguration/getVpnHoodConfiguration";
import { CreateNewUserVpnhood, DeleteVpnhoodUserAccount, GetAccessTokenVpnHood } from "src/lib/Vpnhood/CreateNewUserVpnhood";
import { MONGO_URI } from "src/lib/utils";


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function ChangeServerForUserVpnHood(servers, currentServerOfUser, foundUser, obj) {
    var foundNewServer = null;
    var username = foundUser.username;
    try {
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');
        var vpnHoodConfiguration = await GetVpnHoodConfiguration(apiUrls.vpnhoodTypes.All);
        var bearerToken = vpnHoodConfiguration.bearerToken;
        var vpnHoodBaseUrl = vpnHoodConfiguration.vpnhoodBaseUrl;
        
        var accessTokenId = "";
        var generatedToken = "";
        // Assuming servers is an array of objects
        await Promise.all(servers.map(async (serverItem, index) => {
            if (serverItem.servercode == currentServerOfUser.servercode) {
                // Delete username from this server
                await DeleteVpnhoodUserAccount(serverItem, foundUser.currenthubname, bearerToken, vpnHoodBaseUrl);
            } else if (serverItem.servercode == obj.servercode) {
                foundNewServer = serverItem;
                // Generate username on selected server
                const newToken = (await CreateNewUserVpnhood(serverItem, foundUser.expires, username, bearerToken, vpnHoodBaseUrl))[0];
                accessTokenId = newToken.accessTokenId;
                var createdToken = {
                    accessTokenId:accessTokenId
                }
                generatedToken =await GetAccessTokenVpnHood(serverItem,createdToken,bearerToken, vpnHoodBaseUrl);
            }
        }));
        if (foundNewServer != null) {
            var updated = await userCollection.updateOne({ username: obj.username }, {
                $set: {
                    currentservercode: foundNewServer.servercode,
                    currenthubname:accessTokenId
                }
            });
        }

        foundUser.newVpnHoodToken =generatedToken;
        return foundUser;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        //client.close();
    }
}

export async function UpdateVpnHoodInformation(User){
    const db = client.db('SoftEther');
    const userCollection = db.collection('Users');
    var updated = await userCollection.updateOne({ username: User.username }, {
        $set: {
            currenthubname: User.currenthubname
        }
    });
}