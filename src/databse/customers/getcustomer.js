import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function GetCustomerByEmailAndPassword(email,password){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        const customer = await collection.findOne({ email: email, password: password });
        if (customer==null){
            
            var obj = {
                isvalid:false,
            }

            return obj;
        }else{
            customer.isvalid = true;

            return customer;
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export async function GetCustomerByEmail(email){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        const customer = await collection.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
        if (customer==null){
            
            var obj = {
                isvalid:false,
            }

            return obj;
        }else{
            customer.isvalid = true;

            return customer;
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default GetCustomerByEmailAndPassword;