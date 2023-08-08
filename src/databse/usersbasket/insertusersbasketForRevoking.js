import {MongoClient,ServerApiVersion} from 'mongodb';
import { GenerateOneMonthExpiration, GenerateRandomPassword, GenerateThreeMonthExpiration, MONGO_URI } from 'src/lib/utils';
import { PAID_CUSTOMER_STATUS } from './PaidEnum';
import GetUsersBasketByUUID from './getusersbasket';
import { getAgentPlans } from '../tariffagent/getAgentPlans';
import { getTariffPrices } from '../tariff/tariffPrice';
import { getTarrifPlans } from '../tarrifplans/getTarrifPlans';
import { getTariffs } from '../tariff/getTariff';
import { apiUrls } from 'src/configs/apiurls';
import GetServerByCode from '../server/getServerByCode';
import { UpdateExpirationTimeSoftEther } from 'src/lib/createuser/UpdateExpirationTime';
import GetServers from '../server/getservers';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const wrappedObject =(newBasketObj,price,agentPrice,isSetteledWithAgent,debitToAgent,
                        tariffplancode,tariffcode,tariffPlanTitle,tariffTitle)=>{
    newBasketObj.price = price;
    newBasketObj.agentPrice = agentPrice;
    newBasketObj.isSetteledWithAgent = isSetteledWithAgent;
    newBasketObj.debitToAgent = debitToAgent;
    newBasketObj.agentInformation.price = price;
    newBasketObj.tariffplancode = tariffplancode;
    newBasketObj.tarrifcode = tariffcode;
    newBasketObj.tariffPlanTitle = tariffPlanTitle;
    newBasketObj.tariffTitle = tariffTitle;

    return newBasketObj;
}
async function insertusersbasketForRevoking(username,tariffplancode,tariffcode,type,prveUUID,uuid){
    try{
        try{
            var userCreated = [];
            const connectionState =  await client.connect();
            const db = client.db('SoftEther');
            const userCollection = db.collection('Users');
            var currentDate = new Date();
            var foundedUser =await userCollection.findOne({username:username});

            var prevBasket =await GetUsersBasketByUUID(prveUUID);
            var tmpUsers = [];
            tmpUsers.push(foundedUser);

            var newBasketObj ={
                uuid:uuid,
                inserttime:currentDate.getTime(),
                isAccountsCreated:true,
                email:foundedUser.email,
                password:foundedUser.password,
                type:type,
                isRevoked:true,
                customer_paying_status:PAID_CUSTOMER_STATUS.WAITING,
                userRegistered:tmpUsers,
                isFromAgent:foundedUser.isfromagent,
                isLoggedIn:true,
                agentInformation:prevBasket.agentInformation,
                prevUUID:prveUUID
            };
            var tmpSelectedPlans =[];
            if(foundedUser.isfromagent==false){

                var tariffPrices = await getTariffPrices(type);

                var selectedTarifPlane = tariffPrices.filter((item)=> item.tariffplancode==tariffplancode
                                                                    && item.tarrifcode==tariffcode )[0];

                tmpSelectedPlans.push(selectedTarifPlane);

                var tariffs = await getTariffs(type);
                var selectedTariff = tariffs.filter((item)=> item.code == tariffcode)[0];
    
                var months = await getTarrifPlans(type);
                var selectedPlanType = months.filter((item)=> item.code == tariffplancode)[0];
                newBasketObj.tariffPlans = tmpSelectedPlans;

                wrappedObject(newBasketObj,selectedTarifPlane.price,0,true,0,tariffplancode,tariffcode,
                                selectedPlanType.title,selectedTariff.title)
                                
            }else{
                
                var tariffPrices = await getAgentPlans(foundedUser.agentcode,type);
                
                var selectedTarifPlane = tariffPrices.filter((item)=> item.tariffplancode==tariffplancode
                                                                    && item.tarrifcode==tariffcode )[0];

                tmpSelectedPlans.push(selectedTarifPlane);
                
                var months = await getTarrifPlans(type);
                var selectedPlanType = months.filter((item)=> item.code == tariffplancode)[0];

                var tariffs = await getTariffs(type);
                var selectedTariff = tariffs.filter((item)=> item.code == tariffcode)[0];

                newBasketObj.tariffPlans = tmpSelectedPlans;
                newBasketObj =wrappedObject(newBasketObj,selectedTarifPlane.price,0,true,0,tariffplancode,tariffcode,
                    selectedPlanType.title,selectedTariff.title)
            }

            
            const collection = db.collection('UsersBasket');
            const result = await collection.insertOne(newBasketObj); 
    

            return result;
        }catch(erros){
            return Promise.reject(erros);
        }finally{
            //client.close();
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function UpdateUsersbasketForRevoking(uuid,paidStatus,isAccountsCreated,userRegistered,usersBasketObj){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('UsersBasket');

       var result = await collection.updateOne({ uuid: uuid }, {
            $set: {
              isAccountsCreated: isAccountsCreated,
              customer_paying_status: paidStatus,
              userRegistered:userRegistered
            }
          })

        return result;
    }catch(erros){

        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default insertusersbasketForRevoking;