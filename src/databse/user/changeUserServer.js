import { MongoClient, ServerApiVersion } from 'mongodb';
import { GenerateOneMonthExpiration, GenerateRandomPassword, GenerateThreeMonthExpiration, MONGO_URI } from 'src/lib/utils';
import { getTarrifPlans } from '../tarrifplans/getTarrifPlans';
import GetServerByCode from '../server/getServerByCode';
import { ChangeUserGroupOnSoftEther } from 'src/lib/createuser/changeUserGroup';
import GetServers from '../server/getservers';
import { CreateUserOnSoftEther } from 'src/lib/createuser/createuser';
import { apiUrls } from 'src/configs/apiurls';
import { ChangeServerForUserCisco, ChangeServerForUserOpenVPN } from './SoftEtherMethods/ChangeServerForUser';
import ChangeServerForUserSoftEther from './SoftEtherMethods/ChangeServerForUser';
import GetUsersByUsernameAndPassword from './GetUsersByUsernameAndPassword';
import { sendEmailCiscoClientTest, sendEmailTest } from 'src/lib/emailsender';
import { GetAgentByAgentCode } from '../agent/getagentinformation';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function ChangeUserServer(obj) {
    try {
        var userCreated = [];
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');

        var foundUser = await userCollection.findOne({ username: obj.username });
        var currentServerOfUser = await GetServerByCode(foundUser.currentservercode);
        const foundNewServer = await GetServerByCode(obj.servercode);
        var agent = await GetAgentByAgentCode(foundUser.agentcode);
        if (foundUser.type == apiUrls.types.OpenVpn || foundUser.type == apiUrls.types.SoftEther) {
            foundUser.ovpnurl = foundNewServer.ovpnurl
        }
        var tmpUsers = []
        tmpUsers.push(foundUser);

        if (foundUser.type === apiUrls.types.SoftEther) {
            var servers = await GetServers(apiUrls.types.SoftEther);
            ChangeServerForUserSoftEther(servers, currentServerOfUser, foundUser, obj);
            var sendingEmailResult = await sendEmailTest(foundUser.email, tmpUsers, "لطفا پاسخ ندهید(اطلاعات اکانت تستی)", agent)

        } else if (foundUser.type === apiUrls.types.Cisco) {

            var servers = await GetServers(apiUrls.types.Cisco);
            ChangeServerForUserCisco(servers, currentServerOfUser, foundUser, obj);
            var emailResult = await sendEmailCiscoClientTest(foundUser.email, tmpUsers, foundNewServer, "اطلاعات اکانت شما", agent)
            var emailToAgent = await sendEmailCiscoClientTest(agent.agentInformation.email, tmpUsers, foundNewServer, "اطلاعات اکانت جدید کاربر", agent);
        } else if (foundUser.type == apiUrls.types.OpenVpn) {
            var servers = await GetServers(apiUrls.types.OpenVpn);
            ChangeServerForUserOpenVPN(servers, currentServerOfUser, foundUser, obj);
            var sendingEmailResult = await sendEmailTest(foundUser.email, tmpUsers, "اطلاعات اکانت شما", agent)
            var sendingEmailResult = await sendEmailTest(agent.agentInformation.email, tmpUsers, "اطلاعات اکانت جدید کاربر", agent)
        }
        foundUser.currentservercode = obj.servercode;


        // const filter = { _id: foundUser._id };
        // const updateOperation = { $set: foundUser };
        // var userUpdateOperation = await userCollection.updateOne(filter, updateOperation);
        // console.log({userUpdateOperation});


        return foundUser;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        //client.close();
    }
}

export async function ChangeUserFreeServer(obj) {
    try {
        var userCreated = [];
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');
        var userInformation = await GetUsersByUsernameAndPassword(obj.username, obj.password);

        if (userInformation.length == 0) {
            return null;
        }
        //متد بالا چک می کنیم که یوزر پسورد اکانتی که میخواد سرور عوض شود درست وارد شده باشد.


        var foundUser = await userCollection.findOne({ username: obj.username });
        var currentServerOfUser = await GetServerByCode(foundUser.currentservercode);

        if (foundUser.type === apiUrls.types.SoftEther) {
            var servers = await GetServers(apiUrls.types.SoftEther);
            ChangeServerForUserSoftEther(servers, currentServerOfUser, foundUser, obj)
        } else if (foundUser.type === apiUrls.types.Cisco) {
            var servers = await GetServers(apiUrls.types.Cisco);
            ChangeServerForUserCisco(servers, currentServerOfUser, foundUser, obj)
        }

        return foundUser;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        //client.close();
    }
}

export default ChangeUserServer;