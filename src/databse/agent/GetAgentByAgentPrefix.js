import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { GetWalletUser } from '../Wallet/getWalletUser';
import WalletDocToDTo from '../Wallet/Utils/WalletDocToDTo';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GetAgentByAgentPrefix(agentprefix){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Agents');
        const documents = await collection.findOne({agentprefix:{ $regex: `^${agentprefix}$`, $options: "i" }});
        if(documents==null)
            return {
                agentInformation:null,
                isAgentValid:false
            };
        else{
            return {
                agentInformation:documents,
                isAgentValid:true
            };
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

