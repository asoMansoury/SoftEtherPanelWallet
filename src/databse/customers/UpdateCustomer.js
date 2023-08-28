import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function UpdateCustomer(updatedCustomer,id){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        await collection.updateOne(
            { _id: id },
            { $set: updatedCustomer }
        )
        return {
            isValid:true
        };
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default UpdateCustomer;