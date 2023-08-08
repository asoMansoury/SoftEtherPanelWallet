import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function getAgentPlans(agentCode,type){
    if(type=='' || type ==null || type == undefined) 
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TariffAgent');
        const documents = await collection.find({agentcode:agentCode,type:type}).toArray();
        
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}




