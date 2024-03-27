import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { GetWalletUser } from '../Wallet/getWalletUser';
import { DecDebitAgentWalletByAdmin, IncreaseAgentWalletByAdmin, IncreaseWallet, IncreaseWalletV2 } from '../Wallet/IncreaseWallet';
import { GetMoneyFromOtherWallet, TransferMoneyToOtherWallet } from '../Wallet/UpdateWallet';
import { TransferedWalletLog } from '../Wallet/CreateWallet';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function RefundSubAgent(refundMoney, agentcode, subAgentEmail, email, isAdmin) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Agents');
        const subAgent = await collection.findOne({ agentcode: agentcode });
        if (subAgent == null)
            return { isValid: false, errorMsg: "کد ایجنت وارد شده صحیح نمی باشد." };
        var subAgentWallet = await GetWalletUser(subAgentEmail);
        if (subAgentWallet.isValid == false)
            return subAgentWallet;

        if (isAdmin == false && (subAgentWallet.cashAmount < refundMoney || subAgent.isSubAgent == false || subAgent.introducerEmail != email))
            return { isValid: false, errorMsg: "داده وارد شده صحیح نمی باشد." };
        if (isAdmin == true && subAgentWallet.cashAmount < refundMoney)
            return { isValid: false, errorMsg: "داده وارد شده صحیح نمی باشد." };
        await TransferMoneyToOtherWallet(subAgentEmail, "", refundMoney);
        GetMoneyFromOtherWallet(email, "", refundMoney);
        TransferedWalletLog(subAgentEmail, agentcode, email, refundMoney, "برگشت پول زیرمجموعه فروش به ایجنت اصلی")

        return { isValid: true };
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}



export async function IncreaseAgentByAdmin(refundMoney, agentcode, email, isAdmin) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Agents');
        const subAgent = await collection.findOne({ agentcode: agentcode });
        if (subAgent == null)
            return { isValid: false, errorMsg: "کد ایجنت وارد شده صحیح نمی باشد." };

        if (isAdmin == false)
            return { isValid: false, errorMsg: "داده وارد شده صحیح نمی باشد." };

        await IncreaseAgentWalletByAdmin(email,refundMoney).then((response)=>{
            if(response.isValid==true){
                TransferedWalletLog("َAdmin@gmail.com", agentcode, email, refundMoney, "افزایش اعتبار ایجینت توسط ادمین")
            }
        });

        return { isValid: true };
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}



export async function SaveToCache(uuid,object) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');

        const cacheCollection = db.collection('CachCollection');
        const result = await cacheCollection.insertOne({
            uuid:uuid,
            object:object
        });
        return ;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}

export async function GetFromCache(uuid) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');

        const cacheCollection = db.collection('CachCollection');
        var cachData = await cacheCollection.findOne({uuid:"bf007f2e-746d-45a6-8231-6b01081c064b"});
        return cachData;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}
