import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { MONGO_URI } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function RegisterUsersInDB(servers,user,type,selectedServer){
    if(type=='' || type ==null || type == undefined) 
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');

        var serverIdArray =[];
        servers.map((item,index) =>{
            let serverIdObj ={}
            serverIdObj.servercode = item['servercode'];
            if(item['servercode']==selectedServer.servercode){
                serverIdObj.policy = user.policy;
            }else{
                serverIdObj.policy = item.policy;
            }
            serverIdArray.push(serverIdObj);

            if(item['servercode']==selectedServer.servercode){
                user.userwithhub = user.username + '@' + item.HubName;
                user.currentservercode= item['servercode'];
                user.currenthubname = item.HubName;
            }
        });
        user['serverId']= serverIdArray;
        user.type = type;
        user.isfromagent = user.isfromagent;
        user.removedFromServer = false;
        var serverHubNames =[];
        servers.map((item,index) =>{
            serverHubNames.push(item['HubName']);
        });
        user['HubName']= serverHubNames;

        const result = await collection.insertOne(user);
        user._id = result._id;
        
        return user;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function RegisterUsersInDBForCisco(servers,user,type,agentInformation,selectedServer){
    if(type=='' || type ==null || type == undefined) 
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');

        var serverIdArray =[];
        servers.map((item,index) =>{
            let serverIdObj ={}
            serverIdObj.servercode = item['servercode'];
            if(item['servercode'] == selectedServer.servercode){
                serverIdObj.policy = user.policy;
                user.currentservercode= item['servercode'];
                user.agentcode = agentInformation.agentcode;
                serverIdArray.push(serverIdObj);
            }
        });
        user['serverId']= serverIdArray;
        user.type = type;
        user.isfromagent = user.isfromagent;
        user.removedFromServer = false;
        const result = await collection.insertOne(user);
        user._id = result._id;

        return user;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default RegisterUsersInDB;