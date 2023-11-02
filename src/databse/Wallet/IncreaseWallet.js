import {MongoClient,ServerApiVersion} from 'mongodb';
import { GenerateRandomPassword, MONGO_URI } from 'src/lib/utils';
import { CreateWalletForMemberedUser, TransferedWalletLog } from './CreateWallet';
import {  GetMoneyFromOtherWallet, TransferMoneyToOtherWallet } from './UpdateWallet';
import RegisterCustomers from '../customers/registercustomers';
import { sendEmailToInformCustomer, sendEmailToNewCustomer } from 'src/lib/Emails/emailToNewCustomer';
import { digitsEnToFa, addCommas } from "@persian-tools/persian-tools";
import { GetCustomerByEmail } from '../customers/getcustomer';
import { apiUrls } from 'src/configs/apiurls';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function IncreaseWallet(IncreasAmounMoney,email){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        await collection.updateOne({ email: { $regex: `^${email}$`, $options: "i" } },
        {
            $set: {
                cashAmount: IncreasAmounMoney,
            }
        })
        return {
            isValid:true
        };
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function DecreaseWallet(email,DecreasedAmounMoney){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const query = {email: { $regex: `^${email}$`, $options: "i" } }
        const update = { $inc: { cashAmount: -DecreasedAmounMoney } };
        var wallet = await collection.updateOne(query,update);

        return {
            isValid:true
        };
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function IncreaseWalletV2(email,IncreaseAmounMoney){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const query = {email: { $regex: `^${email}$`, $options: "i" } }
        const update = { $inc: { cashAmount: IncreaseAmounMoney } };
        var wallet = await collection.updateOne(query,update);
        return {
            isValid:true
        };
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function IncreaseAgentWalletByAdmin(email,IncreaseAmounMoney){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const query = {email: { $regex: `^${email}$`, $options: "i" } }
        const update = { $inc: { cashAmount: parseInt(IncreaseAmounMoney),debitAmount:parseInt(IncreaseAmounMoney) } };
        var wallet = await collection.updateOne(query,update);
        return {
            isValid:true
        };
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function DecDebitAgentWalletByAdmin(email,IncreaseAmounMoney){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const query = {email: { $regex: `^${email}$`, $options: "i" } }
        console.log("hello")
        const update = { $inc: { debitAmount:-parseInt(IncreaseAmounMoney) } };
        var wallet = await collection.updateOne(query,update);
        return {
            isValid:true
        };
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}