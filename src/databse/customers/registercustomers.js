import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { MONGO_URI, generateRandomNumberPassword } from 'src/lib/utils';
import { GetAgentByUserCode } from '../agent/getagentinformation';
import UpdateCustomer from './UpdateCustomer';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


export async function RegisterAgentCustomers(user,type){

    if(type=='' || type == undefined|| type ==null) 
        type= apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        var documents =await collection.find({email:{ $regex: `^${user.email}$`, $options: "i" }}).toArray();
        if(documents[0]){
            var doc = documents[0];
            return doc;
        }
        else{

            const result = await collection.insertOne({
                email:user.email,
                password:user.password,
                isfromagent:user.isFromAgent, 
                agentcode:user.agentcode,
                isAdmin:false,
                agentIntoducer:user.isFromAgent==true?user.agentInformation.agentcode:null
            });
            if(user.isFromAgent){
                result.agentIntroducerDetail = await GetAgentByUserCode(user.agentInformation.agentcode,type) 
            }
            return result;
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function RegisterAgentCustomersByOtherAgents(user,introducerEmail,isSubAgent){


    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        var documents =await collection.find({email:{ $regex: `^${user.email}$`, $options: "i" }}).toArray();
        if(documents[0]){
            var doc = documents[0];
            doc.introducerEmail = introducerEmail;
            doc.isSubAgent = isSubAgent;
            UpdateCustomer(doc,doc._id);
            return doc;
        }
        else{

            const result = await collection.insertOne({
                email:user.email,
                password:user.password,
                isfromagent:user.isFromAgent, 
                agentcode:user.agentcode,
                isAdmin:false,
                agentIntoducer:user.isFromAgent==true?user.agentInformation.agentcode:null,
                introducerEmail:introducerEmail,
                isSubAgent:isSubAgent
            });
            if(user.isFromAgent){
                result.agentIntroducerDetail = await GetAgentByUserCode(user.agentInformation.agentcode,type) 
            }
            return result;
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}


async function RegisterCustomers(user,type){

    if(type=='' || type == undefined|| type ==null) 
        type= apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        var documents =await collection.find({email:{ $regex: `^${user.email}$`, $options: "i" }}).toArray();
        if(documents[0]){
            var doc = documents[0];
            return doc;
        }
        else{

            const result = await collection.insertOne({
                email:user.email,
                password:user.password,
                isfromagent:user.isFromAgent, 
                isAdmin:false,
                agentIntoducer:user.isFromAgent==true?user.agentInformation.agentcode:null
            });
            if(user.isFromAgent){
                result.agentIntroducerDetail = await GetAgentByUserCode(user.agentInformation.agentcode,type) 
            }
            return result;
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function RegisterCustomersForOthers(user,type,agentIntroducerCode){
    if(type=='' || type == undefined|| type ==null) return
    type= apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        
        var documents =await collection.find({email:{ $regex: `^${user.email}$`, $options: "i" }}).toArray();

        if(documents[0]){
            var doc = documents[0];

            return doc;
        }
        else{

            const result = await collection.insertOne({
                email:user.email,
                password:generateRandomNumberPassword(5),
                isfromagent:true, 
                isAdmin:false,
                agentIntoducer:agentIntroducerCode
            });
            const insertedObjectId = result.insertedId;
            const registeredRecord = await collection.findOne({ _id: insertedObjectId });
            var obj ={
                isfromagent:false, 
                isAdmin:false,
                agentIntoducer:false,
                email:user.email,
                password:registeredRecord.password
            }
            return registeredRecord;
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default RegisterCustomers;