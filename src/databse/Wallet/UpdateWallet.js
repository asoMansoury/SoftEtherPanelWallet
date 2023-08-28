import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { UpdateTank } from '../SalesTank/SalesTank';
import { GetCustomerAgentCode } from '../customers/getcustomer';
import { GetAgentByUserCode } from '../agent/getagentinformation';
import { GetWalletUser } from './getWalletUser';
import { CalculateTotalPriceModifed } from '../tariffagent/calculateTotalPrice';
import { IncreaseWallet } from './IncreaseWallet';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function  RecalculateForParentAgent(introducerEmail,introducerAgentCode,tariffPlans,type,boughtAmount){
    var IntroducerAgenttWallet = await GetWalletUser(introducerEmail);
    const IntroducerAgentCustomer = await GetCustomerAgentCode(introducerAgentCode);
    var CalculatedResult =await CalculateTotalPriceModifed(IntroducerAgentCustomer.agentcode,tariffPlans,type);
    const differPrice = boughtAmount - CalculatedResult.ownerPrice;//محاسبه ما به تفاوت قیمت فروش ما به ایجنت و قیمت فروش ایجنت به مشتری
    IntroducerAgenttWallet.cashAmount = IntroducerAgenttWallet.cashAmount + differPrice;
    IncreaseWallet(IntroducerAgenttWallet.cashAmount,IntroducerAgentCustomer.email);
}

export async function CalculateWallet(email, type, boughtAmount, usersBasketObj) {
    if (type == '' || type == undefined)
        type = "SF1";
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Wallet');
        const wallet = await collection.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
        wallet.cashAmount = wallet.cashAmount - boughtAmount;
        IncreaseWallet(wallet.cashAmount,email);
        //        console.log("Cash Amount", wallet.cashAmount,"Email:",email );

        //محاسبه مابه تفاوتی که باید به ایجنت اصلی ایجنت معرفی شده برگردد.
        const agent =await GetAgentByUserCode(wallet.agentcode);
        if(agent.isAgentValid == true){
            if(agent.agentInformation.isSubAgent==true){
                RecalculateForParentAgent(agent.agentInformation.introducerEmail,
                                          agent.agentInformation.introducerAgentCode,
                                          usersBasketObj.tariffPlans,
                                          usersBasketObj.type,
                                          boughtAmount)
            }
        }


        if (usersBasketObj.agentIntoducer != null) {
            if (usersBasketObj.agentIntoducer != "") {
                //در صورتی که خرید توسط یکی از مشتریان غیر ایجنتی انجام شده باشد، می باشد ما به تفاوت قیمت تعیین شده برای ایجنت و قیمت فروخته شده ره به کیف پول ایجنت برگردانیم
                const mainAgentCustomer = await GetCustomerAgentCode(usersBasketObj.agentIntoducer);
                const mainAgentWallet = await collection.findOne({ email: { $regex: `^${mainAgentCustomer.email}$`, $options: "i" } });
                const differPrice = boughtAmount - usersBasketObj.ownerprice;//محاسبه ما به تفاوت قیمت فروش ما به ایجنت و قیمت فروش ایجنت به مشتری
                mainAgentWallet.cashAmount = mainAgentWallet.cashAmount + differPrice;
                IncreaseWallet(mainAgentWallet.cashAmount,mainAgentCustomer.email );
                UpdateTank(type, usersBasketObj.ownerprice);

                if(mainAgentCustomer.isSubAgent==true){
                    var CalculatedResult =await CalculateTotalPriceModifed(mainAgentCustomer.agentcode,usersBasketObj.tariffPlans,usersBasketObj.type);
                    RecalculateForParentAgent(mainAgentCustomer.introducerEmail,
                                              mainAgentCustomer.introducerAgentCode,
                                              usersBasketObj.tariffPlans,
                                              usersBasketObj.type,
                                              CalculatedResult.ownerPrice)
                }

            }
        }else{
            UpdateTank(type, boughtAmount);
        }


        const result = {
            email: email,
            isAgent: wallet.isAgent,
            cashAmount: wallet.cashAmount,
            debitAmount: wallet.debitAmount,
            debitToAgent: wallet.debitToAgent,
            agentcode: wallet.agentcode
        }

        return result;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}


export async function TransferMoneyToOtherWallet(email, type, boughtAmount) {
    if (type == '' || type == undefined)
        type = "SF1";
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');
        const wallet = await collection.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
        wallet.cashAmount = wallet.cashAmount - boughtAmount;
        var result = await collection.updateOne({ email: { $regex: `^${email}$`, $options: "i" } },
            {
                $set: {
                    cashAmount: wallet.cashAmount,
                }
            })

        const result = {
            email: email,
            isAgent: wallet.isAgent,
            cashAmount: wallet.cashAmount,
            debitAmount: wallet.debitAmount,
            debitToAgent: wallet.debitToAgent,
            agentcode: wallet.agentcode,
            isValid: true
        }

        return result;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}

export async function GetMoneyFromOtherWallet(email, type, boughtAmount) {
    if (type == '' || type == undefined)
        type = "SF1";
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('Wallet');

        const filter = { email: { $regex: `^${email}$`, $options: "i" } };
        const updateOperation = { $inc: { cashAmount: parseInt(boughtAmount) } };

        const resultData = await collection.findOneAndUpdate(filter, updateOperation);

        const result = {
            email: email
        }

        return result;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}