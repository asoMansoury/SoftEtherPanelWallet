import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function CreateNewAgent(name,cardnumber,comission,agenturl,agentcode,price,agentprefix){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Agents');
        const documents = await collection.insertOne({
            name,
            cardnumber,
            comission,
            agenturl,
            agentcode,
            price,
            agentprefix
        })
        if(documents==null)
            return {isValid:false};

        return {isValid:true};
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function CreateNewAgentByAgents(name,cardnumber,comission,agenturl,agentcode
                                                 ,price,agentprefix,introducerEmail,isSubAgent){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Agents');
        const documents = await collection.insertOne({
            name,
            cardnumber,
            comission,
            agenturl,
            agentcode,
            price,
            agentprefix,
            introducerEmail:introducerEmail,
            isSubAgent:isSubAgent
        })
        if(documents==null)
            return {isValid:false};

        return {isValid:true};
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


