import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { GetWalletUser } from './getWalletUser';
import { IncreaseWallet } from './IncreaseWallet';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


export async function CreateNewWallet(email,isAgent,cashAmount,debitAmount,debitToAgent,agentcode){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        var insertedWallet =await collection.insertOne({
                email : email,
                isAgent : isAgent,
                cashAmount : parseInt(cashAmount),
                debitAmount : parseInt(debitAmount),
                debitToAgent : parseInt(debitToAgent),
                agentcode : agentcode
        });
        var result = {
            email : email,
            isAgent : isAgent,
            cashAmount : parseInt(cashAmount),
            debitAmount : parseInt(debitAmount),
            debitToAgent : parseInt(debitToAgent),
            agentcode : agentcode
        }
        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function CreateWalletForMemberedUser(email,isAgent,cashAmount,debitAmount,debitToAgent,agentcode){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        var insertedWallet =await collection.insertOne({
                email : email,
                isAgent : isAgent,
                cashAmount : parseInt(cashAmount),
                debitAmount : parseInt(debitAmount),
                debitToAgent : parseInt(debitToAgent),
                agentcode : agentcode
        });
        var result = {
            email : email,
            isAgent : isAgent,
            cashAmount : parseInt(cashAmount),
            debitAmount : parseInt(debitAmount),
            debitToAgent : parseInt(debitToAgent),
            agentcode : agentcode
        }
        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function CreateNewWalletForAgent(email,isAgent,cashAmount,debitAmount,debitToAgent,agentcode){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const agentWallet = await GetWalletUser(email);
        if(agentWallet.isValid==true){
            IncreaseWallet(cashAmount,email);
        }else{
            const collection = db.collection('Wallet');
            var insertedWallet =await collection.insertOne({
                    email : email,
                    isAgent : isAgent,
                    cashAmount : parseInt(cashAmount),
                    debitAmount : parseInt(debitAmount),
                    debitToAgent : parseInt(debitToAgent),
                    agentcode : agentcode
            });
            console.log({insertedWallet});
            var result = {
                email : email,
                isAgent : isAgent,
                cashAmount : parseInt(cashAmount),
                debitAmount : parseInt(debitAmount),
                debitToAgent : parseInt(debitToAgent),
                agentcode : agentcode
            }
            return result;
        }

    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function TransferedWalletLog(senderMoneyEmail,senderAgentCode,memberedEmail,transferedMoney,description){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('TransferedWallet');
        var insertedWallet =await collection.insertOne({
                senderMoneyEmail : senderMoneyEmail,
                memberedEmail : memberedEmail,
                senderAgentCode : senderAgentCode,
                transferedMoney : parseInt(transferedMoney),
                createdAt: new Date(),
                description:description
        });
        var result = {
            senderMoneyEmail : senderMoneyEmail,
            memberedEmail : memberedEmail,
            senderAgentCode : senderAgentCode,
            transferedMoney : parseInt(transferedMoney),
            createdAt: { $currentDate: { $type: "date" } }
        }
        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}