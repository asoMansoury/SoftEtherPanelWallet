import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { GetWalletUser, GetWalletUserByCode } from 'src/databse/Wallet/getWalletUser';
import { GetAgentByUserCode } from 'src/databse/agent/getagentinformation';
import { GetCustomerAgentCode, GetCustomerByEmail } from 'src/databse/customers/getcustomer';
import GetServers from 'src/databse/server/getservers';
import { getTariffs } from 'src/databse/tariff/getTariff';
import { getTariffPrices } from 'src/databse/tariff/tariffPrice';
import { CalculateTotalPriceModifed } from 'src/databse/tariffagent/calculateTotalPrice';
import { getAgentPlans } from 'src/databse/tariffagent/getAgentPlans';
import { getTarrifPlans } from 'src/databse/tarrifplans/getTarrifPlans';
import { PAID_CUSTOMER_STATUS } from 'src/databse/usersbasket/PaidEnum';
import GetUsersBasketByUUID from 'src/databse/usersbasket/getusersbasket';
import {  UpdateUsersBasketForRevoke } from 'src/databse/usersbasket/insertusersbasket';
import { UpdateExpirationTimeSoftEther } from 'src/lib/createuser/UpdateExpirationTime';
import { GenerateOneMonthExpiration, GenerateOneMonthExpirationStartDate, MONGO_URI, calculateEndDate } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function RevokeUser(username,tariffplancode,tariffcode,type,uuid){
    try{
        var userCreated = [];
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');
        var foundedUser =await userCollection.findOne({username:username});
        if(foundedUser.isfromagent==false){
            var tariffPrices = await getTariffPrices(type);

            var selectedTarifPlane = tariffPrices.filter((item)=> item.tariffplancode==tariffplancode
                                                                && item.tarrifcode==tariffcode )[0];

            var tariffs = await getTariffs(type);
            var selectedTariff = tariffs.filter((item)=> item.code == tariffcode)[0];

            var months = await getTarrifPlans(type);
            var selectedPlanType = months.filter((item)=> item.code == tariffplancode)[0];

        }else if (foundedUser.isfromagent==true){
            var customer =await GetCustomerAgentCode(foundedUser.agentcode)
            var getAgentPricePlans =await getAgentPlans(foundedUser.agentcode,foundedUser.type);
            var agentPlans = getAgentPricePlans.filter((item)=> item.tariffplancode==tariffplancode
                                                                    && item.tarrifcode==tariffcode );

            var totalPrice = await CalculateTotalPriceModifed(foundedUser.agentcode,agentPlans,foundedUser.type);
            var agentWallet =await GetWalletUserByCode(foundedUser.agentcode,foundedUser.type);
            var checkHasCash = agentWallet.cashAmount - totalPrice.ownerPrice
            if(checkHasCash<0){
              res.status(200).json({ name: {
                isValid:false,
                message:"موجودی کیف پول شما برای خرید اکانت کافی نمی باشد. لطفا با مدیریت تماس بگیرید."
              } });
              return;
            }

            const walletCollection = db.collection('Wallet');
            var result =await  walletCollection.updateOne({email:{ $regex: `^${customer.email}$`, $options: "i" }}, 
            {
                $set: {
                    cashAmount: checkHasCash,
                }
            })
            var months = await getTarrifPlans(foundedUser.type);
            var selectedPlanType = months.filter((item)=> item.code == tariffplancode)[0];
        }

        var updatingUserBasket = UpdateUsersBasketForRevoke(uuid,PAID_CUSTOMER_STATUS.PAID,true);
        var nextExpirationDate = calculateEndDate(foundedUser.expires,selectedPlanType.duration);
        foundedUser.isRevoked = true;
        foundedUser.expires = nextExpirationDate;


        await userCollection.updateOne(
            { "username": username }, // Filter condition to match the document
            { $set: { "expires": nextExpirationDate,"isRevoked":true,"uuid":uuid } } // Update operation using $set to set the new value
        )
        if(foundedUser.type==apiUrls.types.SoftEther)
            UpdateSoftEtherUserExpiration(foundedUser,nextExpirationDate);

        return foundedUser;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        //client.close();
    }
}

export async function CalculatingForRevoke(username,tariffplancode,tariffcode,type){
    try{
        var userCreated = [];
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const userCollection = db.collection('Users');

        var foundedUser =await userCollection.findOne({username:username});

        if(foundedUser.isfromagent==false){
            var tariffPrices = await getTariffPrices(type);
            
            var selectedTarifPlane = tariffPrices.filter((item)=> item.tariffplancode==tariffplancode
                                                                && item.tarrifcode==tariffcode )[0];

            return {
                isFromAgent:false,
                agentPrice:0,
                price:selectedTarifPlane.price
            }
        }else{
            
            var tariffPrices = await getAgentPlans(foundedUser.agentcode,type);
            
            var selectedTarifPlane = tariffPrices.filter((item)=> item.tariffplancode==tariffplancode
                                                                && item.tarrifcode==tariffcode )[0];

            return {
                isFromAgent:true,
                agentPrice:selectedTarifPlane.agentprice,
                price:selectedTarifPlane.price
            };
        }

        return foundedUser;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        //client.close();
    }
}


async function UpdateSoftEtherUserExpiration(foundedUser,nextExpirationDate){
    var UserServers =await GetServers(apiUrls.types.SoftEther);
    
    UserServers.map((serverItem,index)=>{
        UpdateExpirationTimeSoftEther(serverItem,foundedUser,nextExpirationDate.toString())
    })
}


export default RevokeUser;