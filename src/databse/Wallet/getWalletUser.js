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
                isValid:false,
                errorMsg:"کیف پول تعریف نشده است."
            };

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

export async function GetWalletUserByCode(agentCode,type){
    if(type=='' || type == undefined)
        type= "SF1";
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const wallet = await collection.findOne({agentcode:agentCode});
        if(wallet==null)
            return {
                isValid:false
            };

            const result ={
                email:wallet.email,
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


export async function TransferMoneyToOtherAccount(senderEmail,memberedEmail,transferedMoney){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');

        const agentCustomer =await GetCustomerByEmail(senderEmail);
        const memberedCustomer =await GetCustomerByEmail(memberedEmail);
        if(memberedCustomer.isvalid==false){
            //در این بخش ابتدا یک اکانت برای ایمیل تعریف می کنیم سپس یک کیف پول جدید تعریف و سپس از حساب ایجنت اصلی کمی میکنیم
            //در نهایت یک لاگ درون جدول والت لاگ زده می شود.
            var userObj = {
                email:memberedEmail,
                password:GenerateRandomPassword(),
                isFromAgent:true,
                isAdmin:false,
                agentInformation:{agentcode:agentCustomer.agentcode}
            }
            var registerCustomer = await RegisterCustomers(userObj,apiUrls.types.SoftEther);

            await CreateWalletForMemberedUser(memberedEmail,false,transferedMoney,0,0,"");
            await TransferMoneyToOtherWallet(senderEmail,"",transferedMoney);
            await TransferedWalletLog(senderEmail,agentCustomer.agentcode,memberedEmail,transferedMoney,"انتقال پول به مشتری عادی");
            await sendEmailToNewCustomer(memberedEmail,"اطلاعات اکانت برای دسترسی به سایت",
                                                    userObj,addCommas(digitsEnToFa(transferedMoney)),senderEmail);
        }else {
            const memberedWallet = await GetWalletUser(memberedEmail);

            if(memberedWallet.isValid==false){
                await CreateWalletForMemberedUser(memberedEmail,false,transferedMoney,0,0,"");
                await TransferMoneyToOtherWallet(senderEmail,"",transferedMoney);
                await TransferedWalletLog(senderEmail,agentCustomer.agentcode,memberedEmail,transferedMoney,"انتقال پول به مشتری عادی");
            }else{

                var transfered =  await TransferMoneyToOtherWallet(senderEmail,"",transferedMoney);
                if(transfered.isValid == true){
                    await GetMoneyFromOtherWallet(memberedEmail,"",transferedMoney);
                    await TransferedWalletLog(senderEmail,agentCustomer.agentcode,memberedEmail,transferedMoney,"انتقال پول به مشتری عادی");
                }
            }
            sendEmailToInformCustomer(memberedEmail,"شارژ اکانت" ,addCommas(digitsEnToFa(transferedMoney)),senderEmail);
        }

        
        return {
            isValid:true
        };
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

