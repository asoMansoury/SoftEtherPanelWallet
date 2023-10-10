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

async function GetServers(type){
    if(type=='' || type == undefined)
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Servers');
        const documents = await collection.find({type:type,isremoved: false,}).toArray();
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function GetServersByTypeAndCode(type,code){
    if(type=='' || type == undefined)
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Servers');
        const documents = await collection.find({type:type,isremoved: false,servercode:code}).toArray();
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


export async function GetServerByTypeAndCode(type,code){
    if(type=='' || type == undefined)
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Servers');
        const documents = await collection.findOne({type:type,isremoved: false,servercode:code});
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function GetAllServers(){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Servers');
        const documents = await collection.find({}).toArray();
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function GetAllEnabledServers(){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Servers');
        const documents = await collection.find({isremoved: false}).toArray();
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function GetServersForTest(type){
    if(type=='' || type == undefined)
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Servers');
        const documents = await collection.findOne({type:type,usedForTest:true,isremoved:false});
        
        return documents;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default GetServers;