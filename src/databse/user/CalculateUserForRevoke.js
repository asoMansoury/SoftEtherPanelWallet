import {MongoClient,ServerApiVersion} from 'mongodb';
import {  MONGO_URI } from 'src/lib/utils';
import GetUsersBasketByUUID, { GetUsersBasketByUsername } from '../usersbasket/getusersbasket';
import { getAgentPlans } from '../tariffagent/getAgentPlans';
import { getTariffs } from '../tariff/getTariff';
import { getTariffPrices } from '../tariff/tariffPrice';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function CalculateRevokeForUsersOfAgent(userData){
    const AgentTariffPrices =await getAgentPlans(userData.agentcode,userData.type);
    
    const selectedTarifPlan = AgentTariffPrices.filter(e=>e.tarrifcode == userData.policy && 
                                                            e.tariffplancode==userData.tariffplancode)[0];

    return {
        selectedTarifPlan:selectedTarifPlan,
        AgentTariffPrices:AgentTariffPrices
    };

}

async function CalculateRevokeForUsers(userData){
    const tariffPrices =await getTariffPrices(userData.type);

    const selectedTarifPlan = tariffPrices.filter(e=>e.tarrifcode == userData.policy && 
                                                            e.tariffplancode==userData.tariffplancode)[0];

    return {
        selectedTarifPlan:selectedTarifPlan,
        AgentTariffPrices:tariffPrices
    };

}

export async function CalculateUserForRevoke(username){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');

        const UserBasket =await GetUsersBasketByUsername(username);
        const userData = (await collection.findOne({username:{ $regex: `^${username}$`, $options: "i" }}));

        var result = null;
        if(userData.isfromagent==true){
            result = CalculateRevokeForUsersOfAgent(userData,UserBasket);
        }else{
            result = CalculateRevokeForUsers(userData,UserBasket);
        }

        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default CalculateUserForRevoke;