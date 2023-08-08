import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectMongo(){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Servers');
        const documents = await collection.find({}).toArray();
        
        return connectionState;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default connectMongo;