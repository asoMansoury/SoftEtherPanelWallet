import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function CheckIsUserExists(email){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Customers');
        const customer = await collection.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
        
        var obj = {
            isvalid:false,
        }
        if (customer!=null)
            obj.isvalid =true;

        return obj;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default CheckIsUserExists;