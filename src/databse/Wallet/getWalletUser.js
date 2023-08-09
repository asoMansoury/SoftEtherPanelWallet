import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GetWalletUser(email,type){
    if(type=='' || type == undefined)
        type= "SF1";
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const wallet = await collection.findOne({email:{ $regex: `^${email}$`, $options: "i" }});
        if(wallet==null)
            return {
                isValid:false
            };

            const result ={
                email:email,
                isAgent:wallet.isAgent,
                cashAmount:wallet.cashAmount,
                debitAmount:wallet.debitAmount,
                debitToAgent:wallet.debitToAgent,
                agentcode : wallet.agentcode
            }

        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function CheckAgentWalet(email,type){
    var agentCode = code.toString();
    if(type=='' || type == undefined)
        type= "SF1";
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const wallet = await collection.findOne({email:{ $regex: `^${email}$`, $options: "i" }});
        if(wallet==null)
            return {
                isValidWallet:false
            };

        const result ={
            email:email,
            isAgent:wallet.isAgent,
            cashAmount:wallet.cashAmount,
            debitAmount:wallet.debitAmount,
            debitToAgent:wallet.debitToAgent,
            agentcode : wallet.agentcode
        }

        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}
