import {MongoClient,ServerApiVersion} from 'mongodb';
import { GenerateOneMonthExpiration, GenerateRandomPassword, GenerateThreeMonthExpiration, MONGO_URI } from 'src/lib/utils';
import { PAID_CUSTOMER_STATUS } from './PaidEnum';
import GetUsersBasketByUUID from './getusersbasket';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function InsertUsersBasket(body,statusPaid){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('UsersBasket');
        body.customer_paying_status =statusPaid ;
        body.isRevoked = false;
        const result = await collection.insertOne(body);

        return await GetUsersBasketByUUID(body.uuid);
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function UpdateUsersBasket(uuid,paidStatus,isAccountsCreated,userRegistered){
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

export async function UpdateUsersBasketForRevoke(uuid,paidStatus,isAccountsCreated){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('UsersBasket');
        
       var result = await collection.updateOne({ uuid: uuid }, {
            $set: {
              isAccountsCreated: isAccountsCreated,
              customer_paying_status: paidStatus,
            }
          })

        return result;
    }catch(erros){

        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default InsertUsersBasket;