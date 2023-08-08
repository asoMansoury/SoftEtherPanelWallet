import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GetAgentBills(body){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const customerCollection = db.collection('Customers');
        const customerDoc =await customerCollection.findOne({email:{ $regex: `^${body}$`, $options: "i" }});
        const collection = db.collection('Agents');
        const documents = await collection.findOne({agentcode:customerDoc.agentcode});
        if(documents==null)
            return {agentInformation:documents};

        const basketCollection = db.collection('UsersBasket');

        const basketDocs = await basketCollection.find({
            isSetteledWithAgent: false,
            "agentInformation.agentcode":documents.agentcode,
            isFromAgent:true,
            debitToAgent: { $gt: 0 }
        }).toArray();
        
        return basketDocs;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


