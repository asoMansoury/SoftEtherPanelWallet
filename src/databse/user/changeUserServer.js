import {MongoClient,ServerApiVersion} from 'mongodb';
import { GenerateOneMonthExpiration, GenerateRandomPassword, GenerateThreeMonthExpiration, MONGO_URI } from 'src/lib/utils';
import { getTarrifPlans } from '../tarrifplans/getTarrifPlans';
import GetServerByCode from '../server/getServerByCode';
import { ChangeUserGroupOnSoftEther } from 'src/lib/createuser/changeUserGroup';
import GetServers from '../server/getservers';
import { CreateUserOnSoftEther } from 'src/lib/createuser/createuser';
import { apiUrls } from 'src/configs/apiurls';
import  { ChangeServerForUserCisco } from './SoftEtherMethods/ChangeServerForUser';
import ChangeServerForUserSoftEther from './SoftEtherMethods/ChangeServerForUser';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function ChangeUserServer(obj){
    try{
        var userCreated = [];
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');



        var foundUser =await userCollection.findOne({username:obj.username});
        var currentServerOfUser = await GetServerByCode(foundUser.currentservercode);

        if(foundUser.type === apiUrls.types.SoftEther){
            var servers =await GetServers(apiUrls.types.SoftEther);
            ChangeServerForUserSoftEther(servers,currentServerOfUser,foundUser,obj)
        }else if(foundUser.type === apiUrls.types.Cisco){
            var servers =await GetServers(apiUrls.types.Cisco);
            ChangeServerForUserCisco(servers,currentServerOfUser,foundUser,obj)
        }


        return foundUser;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        //client.close();
    }
}

export default ChangeUserServer;