import {MongoClient,ServerApiVersion} from 'mongodb';
import { ConvertCodeToTitle, MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function getAgentPlans(agentCode,type){
    if(type=='' || type ==null || type == undefined) 
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TariffAgent');
        const documents = await collection.find({agentcode:agentCode,type:type}).toArray();
        
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function getAllAgentPlans(agentCode){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TariffAgent');
        const documents = await collection.find({agentcode:agentCode}).toArray();

        const collectionTariffPlans = db.collection('TariffPlans');
        const tariffPlans = await collectionTariffPlans.find({}).toArray();

        const collectionTariff = db.collection('Tariff');
        const tariffTypes = await collectionTariff.find({}).toArray();
        var tmpResult = [];
        documents.forEach((item,index)=>{
            var selectedPlan = tariffPlans.filter((plan)=> plan.code == item.tariffplancode)[0];
            var selectedTypeMonth = tariffTypes.filter((month)=> month.code == item.tarrifcode)[0];
            var title = ConvertCodeToTitle(item.type);
            tmpResult.push(
                {
                    type:item.type,
                    typeTitle: title,
                    tariffplancode:item.tariffplancode ,
                    tariffplanTitle:selectedPlan.title,
                    tarrifcode: item.tarrifcode, 
                    tarrifTitle:selectedTypeMonth.title,
                    price:item.price,
                    ownerPrice:item.price,
                    agentprice:item.agentprice
                })
        });

        return tmpResult;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}




