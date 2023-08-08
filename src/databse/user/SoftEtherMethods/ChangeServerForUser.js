import {MongoClient,ServerApiVersion} from 'mongodb';
import { GenerateOneMonthExpiration, GenerateRandomPassword, GenerateThreeMonthExpiration, MONGO_URI } from 'src/lib/utils';
import { ChangeUserGroupOnSoftEther } from 'src/lib/createuser/changeUserGroup';
import { CreateUserOnCisco } from 'src/lib/Cisco/createuser';
import { DeleteUserCisco } from 'src/lib/Cisco/deleteuser';
import GetServerByCode from 'src/databse/server/getServerByCode';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


 async function ChangeServerForUserSoftEther(servers,currentServerOfUser,foundNewServer,foundUser,obj){
    var foundNewServer = await GetServerByCode(obj.servercode);
    if(foundNewServer==null )
        return null;
    try{
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');

        servers.map((serverItem,index)=>{
            if(serverItem.servercode == currentServerOfUser.servercode){
                var newObj = {
                    username:foundUser.username,
                    policy:'D1'
                }
                
                ChangeUserGroupOnSoftEther(serverItem,newObj);
            }else{
                if(serverItem.isremoved==false){
                    ChangeUserGroupOnSoftEther(serverItem,foundUser);
                }
            }
        });

        var updated=await userCollection.updateOne({username:obj.username},{ $set: {
            currentservercode: foundNewServer.servercode,
            currenthubname: foundNewServer.HubName, // Update the 'isactive' field to 0
            userwithhub:obj.username+"@"+foundNewServer.HubName, //
        }});

        return foundUser;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        //client.close();
    }
}


export async function ChangeServerForUserCisco(servers,currentServerOfUser,foundUser,obj){
    var foundNewServer = null;
    try{
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');

        servers.map((serverItem,index)=>{
            if(serverItem.servercode == currentServerOfUser.servercode){

                    // Delete username from this server
                    DeleteUserCisco(serverItem,foundUser.username);
            }else{
                if(serverItem.isremoved==false){
                    foundNewServer = serverItem;

                    // Generate username on selectedServer
                    CreateUserOnCisco(serverItem,foundUser.username,foundUser.password);
                }
            }
        });
        if(foundNewServer != null){
            var updated=await userCollection.updateOne({username:obj.username},{ $set: {
                currentservercode: foundNewServer.servercode,
            }});
        }

        return foundUser;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        //client.close();
    }
}


export default ChangeServerForUserSoftEther;