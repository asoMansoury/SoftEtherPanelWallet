import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function GetServerByCode(code){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Servers');
        const documents = await collection.findOne({servercode:code,isremoved: false});
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function GetServerByCodeForChangingServer(code){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Servers');
        const documents = await collection.findOne({servercode:code});
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default GetServerByCode;