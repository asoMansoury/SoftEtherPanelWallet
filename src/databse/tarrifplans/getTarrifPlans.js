import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { ConvertCodeToTitle, MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function getTarrifPlans(type){
    if(type=='' || type ==null || type == undefined) 
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TariffPlans');
        const documents = await collection.find({type:type}).toArray();

        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function getTarrifPrice(type){
    if(type=='' || type ==null || type == undefined) 
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TariffPrice');
        const documents = await collection.find({type:type}).toArray();
        
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function getAllTariffPrices(){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('TariffPrice');
        const documents = await collection.find({}).toArray();

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
                    agentprice:item.price + 100000
                })
        });

        return tmpResult;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}



