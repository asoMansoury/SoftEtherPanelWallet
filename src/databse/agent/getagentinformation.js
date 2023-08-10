import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GetAgentByUserCode(code,type){
    var agentCode = code.toString();
    if(type=='' || type == undefined)
        type= "SF1";
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const tariffCollection = db.collection('Tariff');
        const tariff = await tariffCollection.find({type:type}).toArray();

        const collection = db.collection('Agents');
        const documents = await collection.findOne({agentcode:agentCode});
        if(documents==null)
            return {
                agentInformation:documents,
                isAgentValid:false
            };

        const customerCollection = db.collection('Customers');
        const customerDocumnts = await customerCollection.findOne({agentcode:agentCode});

        const TariffAgentCollection = db.collection('TariffAgent');
        const agentTariffs = await TariffAgentCollection.find({agentcode:agentCode,type:type}).toArray();
        const result ={
            agentInformation:documents,
            isAgentValid:true,
            agentTariffs:agentTariffs,
            tariff:tariff,
            customer:{
                email:customerDocumnts.email
            }
        }

        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function IsAgentValid(email){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const customerCollection = db.collection('Customers');

        const customer = await customerCollection.findOne({
            email:{ $regex: `^${email}$`, $options: "i" }
        });
        const collection = db.collection('Agents');
        const documents = await collection.findOne({agentcode:customer.agentcode});
        if(documents==null)
            return {isAgent:false};

        return {isAgent:true,agentcode:customer.agentcode};
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

