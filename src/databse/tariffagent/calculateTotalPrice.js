import {Int32, Long, MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { getAgentPlans } from './getAgentPlans';
import { apiUrls } from 'src/configs/apiurls';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

function ExtractPlansPriceForAgent(selectedClientPlans,dbAgentPrice,agentCode){
    var totalPrice = 0;
    var ownerPrice = 0;
    for (var j=0;j<selectedClientPlans.length;j++){
        var clientItem = selectedClientPlans[j];
        
        var foundObject = dbAgentPrice.find(e=>e.tarrifcode==clientItem.tarrifcode 
            && e.tariffplancode==clientItem.tariffplancode);
        totalPrice = parseInt(totalPrice) + foundObject.agentprice;
        ownerPrice = parseInt(ownerPrice) + foundObject.price;
    }

    return {
        agentPrice:totalPrice,
        selectedPlans:selectedClientPlans,
        agentCode:agentCode,
        ownerPrice:ownerPrice
    }
}

function ExtractPlansPriceForOwner(selectedClientPlans,dbAgentPrice,agentCode){
    var totalPrice = 0;
    var ownerPrice = 0;
    for (var j=0;j<selectedClientPlans.length;j++){
        var clientItem = selectedClientPlans[j];

        var foundObject = dbAgentPrice.find(e=>e.tarrifcode==clientItem.tarrifcode 
            && e.tariffplancode==clientItem.tariffplancode);
        if(agentCode=='nobody'){
            totalPrice = parseInt(totalPrice) + foundObject.price;
            ownerPrice = parseInt(ownerPrice) + foundObject.price;
        }else{
            totalPrice = parseInt(totalPrice) + foundObject.agentprice;
            ownerPrice = parseInt(ownerPrice) + foundObject.price;
        }
    }

    return {
        agentPrice:totalPrice,
        selectedPlans:selectedClientPlans,
        agentCode:agentCode,
        ownerPrice:ownerPrice
    }
}

export async function CalculateTotalPrice(agentInformation,selectedClientPlans,type){
    if(type=='' || type ==undefined || type == null)
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const documents = await getAgentPlans(agentInformation.agentcode,type);
        if(documents.length > 0){
            const result = ExtractPlansPriceForAgent(selectedClientPlans,documents,agentInformation.agentcode);
            
            return result;
        }else{
            const db = client.db('SoftEther');
            const collection = db.collection('TariffPrice');
            const tariffPriceCollection = await collection.find({}).toArray();
            const result = ExtractPlansPriceForOwner(selectedClientPlans,tariffPriceCollection,'nobody');

            return result;
        }

    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}



export async function CalculateTotalPriceModifed(agentCode,selectedClientPlans,type){
    if(type=='' || type ==undefined || type == null)
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const documents = await getAgentPlans(agentCode,type);
        if(documents.length > 0){
            const result = ExtractPlansPriceForAgent(selectedClientPlans,documents,agentCode);  
            return result;
        }else{
            const db = client.db('SoftEther');
            const collection = db.collection('TariffPrice');
            const tariffPriceCollection = await collection.find({}).toArray();
            const result = ExtractPlansPriceForOwner(selectedClientPlans,tariffPriceCollection,'nobody');

            return result;
        }

    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


