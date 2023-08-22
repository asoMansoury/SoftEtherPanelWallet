import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { UpdateTank } from '../SalesTank/SalesTank';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


export async function CalculateWallet(email,type,boughtAmount){
    if(type=='' || type == undefined)
        type= "SF1";
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const wallet = await collection.findOne({email:{ $regex: `^${email}$`, $options: "i" }});
        UpdateTank(type,boughtAmount);
        wallet.cashAmount = wallet.cashAmount - boughtAmount;
        var result = await collection.updateOne({email:{ $regex: `^${email}$`, $options: "i" }}, 
        {
            $set: {
                cashAmount: wallet.cashAmount,
            }
          })

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


export async function TransferMoneyToOtherWallet(email,type,boughtAmount){
    if(type=='' || type == undefined)
        type= "SF1";
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const wallet = await collection.findOne({email:{ $regex: `^${email}$`, $options: "i" }});
        wallet.cashAmount = wallet.cashAmount - boughtAmount;
        var result = await collection.updateOne({email:{ $regex: `^${email}$`, $options: "i" }}, 
        {
            $set: {
                cashAmount: wallet.cashAmount,
            }
        })

        const result ={
            email:email,
            isAgent:wallet.isAgent,
            cashAmount:wallet.cashAmount,
            debitAmount:wallet.debitAmount,
            debitToAgent:wallet.debitToAgent,
            agentcode : wallet.agentcode,
            isValid:true
        }

        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function GetMoneyFromOtherWallet(email,type,boughtAmount){
    if(type=='' || type == undefined)
        type= "SF1";
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');

        const filter = { email:{ $regex: `^${email}$`, $options: "i" } };
        const updateOperation = { $inc: { cashAmount: boughtAmount } };
    
        const resultData = await collection.findOneAndUpdate(filter, updateOperation);

        const result ={
            email:email
        }

        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}