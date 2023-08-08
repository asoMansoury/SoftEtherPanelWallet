import {MongoClient,ServerApiVersion} from 'mongodb';
import {  MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function GetUsersBasketByUUID(UUID){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('UsersBasket');
        
        const result = await collection.findOne({uuid:UUID});

        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function GetUsersBasketByUsername(username){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('UsersBasket');
        
        const result = await collection.findOne({"userRegistered.username":{ $regex: `^${username}$`, $options: "i" }});
        
        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}



export default GetUsersBasketByUUID;