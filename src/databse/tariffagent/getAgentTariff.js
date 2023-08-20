import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { getAllTariffs } from '../tariff/getTariff';
import { getAllTariffPrices } from '../tarrifplans/getTarrifPlans';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function getAgentTariff(agentcode){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TariffAgent');
        const tariffs = await getAllTariffs();
        const plans = await getAllTariffPrices();
        const documents = await collection.find({agentcode:agentcode}).toArray();
        var result = [];
        documents.forEach((item)=>{
            var selectedTariff = tariffs.filter((e)=> e.code === item.tarrifcode && e.type === item.type)[0];
            var selectedPlan = plans.filter((e)=> e.code === item.tariffplancode && e.type === item.type)[0];
            result.push({
                agentprice:item.agentprice,
                price:item.price,
                tariffplancode:item.tariffplancode,
                tarrifcode:item.tarrifcode,
                type:item.type,
                tariffTitle : selectedTariff.title,
                plantitle: selectedPlan.title

            })
        });
        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}




