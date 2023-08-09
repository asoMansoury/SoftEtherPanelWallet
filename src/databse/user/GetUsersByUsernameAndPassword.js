import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import {  MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GetUsersByUsernameAndPassword(username,password){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');
        
        const data = (await collection.find({
                                                username:{ $regex: `^${username}$`, $options: "i" },
                                                password:password
                                            }).toArray());
        
        if(data==null || data.length==0) 
            return [];
        
        var result = data.map((item)=>{
            var typeTitle = "";
            if(item.type== apiUrls.types.SoftEther)
                typeTitle = "وی پی ان ایران";
            else if(item.type == apiUrls.types.Cisco)
                typeTitle = "وی پی ان سیسکو"

            return{
                email:item.email,
                password:item.password,
                username:item.username,
                expires:item.expires,
                type:item.type,
                typeTitle:typeTitle,
                userwithhub:item.userwithhub
            }
        });

        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function GetUserInformation(username){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');

        const data = (await collection.findOne({username:username}));

        return{
            email:data.email,
            username:data.username,
            expires:data.expires,
            type:data.type,
            agentcode:data.agentcode,
            isfromagent:data.isfromagent
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}




export default GetUsersByUsernameAndPassword;