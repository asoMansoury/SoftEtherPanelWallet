import {MongoClient,ServerApiVersion} from 'mongodb';
import {  MONGO_URI } from 'src/lib/utils';
import GetAgentInvoice from '../usersbasket/getAgentInvoice';
import RegisterCustomers, { RegisterAgentCustomers } from '../customers/registercustomers';
import { WrapperCustomer } from '../customers/customerUtils';
import { CreateNewWallet } from '../Wallet/CreateWallet';
import { CreateNewAgent } from '../agent/CreateNewAgent';
import { DefineNewTariffAgent } from '../tariffagent/DefineNewTariffAgent';

const options = { useNewUrlParser: true, useUnifiedTopology: true };

const client = new MongoClient(MONGO_URI,options,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function DefineNewAgent(agent,plans){
    try{
        const connectionState =  await client.connect();
        const {email,password,agentcode,cashAmount,agentprefix,name} = agent;

        var user = WrapperCustomer(email,password,agentcode);
        RegisterAgentCustomers(user);
        CreateNewWallet(email,true,cashAmount,0,0,agentcode);
        CreateNewAgent(name,"6221061221256532",20,agentcode,agentcode,20000,agentprefix);
        DefineNewTariffAgent(plans,agentcode);
        return {
            isValid:true
        };
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}



