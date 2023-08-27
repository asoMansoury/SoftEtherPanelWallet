import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { GetWalletUser } from '../Wallet/getWalletUser';
import WalletDocToDTo from '../Wallet/Utils/WalletDocToDTo';
import { GetCustomerByEmail } from '../customers/getcustomer';
import { ValidationDto } from '../CommonDto/ValidationDto';


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
        const AgentWallet = await GetWalletUser(customerDocumnts.email);
        const result ={
            agentInformation:documents,
            isAgentValid:true,
            agentTariffs:agentTariffs,
            tariff:tariff,
            agentWallet : WalletDocToDTo(AgentWallet),
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

export async function GetAgentByUserEmail(email){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const customerDoc = await GetCustomerByEmail(email);
        if(customerDoc.isvalid==false)
            return new ValidationDto(false,"برای ایمیل وارد شده کاربری تعریف نشده است.");

        const tariffCollection = db.collection('Tariff');
        const tariff = await tariffCollection.find().toArray();

        const collection = db.collection('Agents');
        const documents = await collection.findOne({agentcode:customerDoc.agentcode});
        if(documents==null)
            return new ValidationDto(false,"برای ایمیل وارد شده ایجنتی تعریف نشده است.");

        const customerCollection = db.collection('Customers');
        const customerDocumnts = await customerCollection.findOne({agentcode:customerDoc.agentcode});

        const TariffAgentCollection = db.collection('TariffAgent');
        const agentTariffs = await TariffAgentCollection.find({agentcode:customerDoc.agentcode}).toArray();
        const AgentWallet = await GetWalletUser(customerDocumnts.email);
        const result ={
            agentInformation:documents,
            isvalid:true,
            agentTariffs:agentTariffs,
            tariff:tariff,
            agentWallet : WalletDocToDTo(AgentWallet),
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

