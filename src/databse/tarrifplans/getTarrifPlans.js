import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { MONGO_URI } from 'src/lib/utils';


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
        const collection = db.collection('TariffPlans');
        const documents = await collection.find({}).toArray();
        
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}



