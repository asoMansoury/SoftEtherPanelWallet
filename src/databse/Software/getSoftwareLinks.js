import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GetSoftwareLinks(){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('SoftwareLinks');
        const Links =await collection.find().toArray();
        
        return Links;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


