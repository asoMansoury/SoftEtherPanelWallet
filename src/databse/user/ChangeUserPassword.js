import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function ChangeUserPassword(password,email){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const customerCollection = db.collection('Customers');
        var user =await customerCollection.findOne({ 
            email: { $regex: `^${email}$`, $options: "i" }
        });
        if(user!=null) 
        {   
            const filter = {_id:user._id};
            const updatedDoc = {$set:{
                password:password
            }};
            await customerCollection.updateOne(filter,updatedDoc);
            return {
                isValid:true
            }
        }else{
            return {
                isValid:false,
                errorMsg:"کاربر مورد نظر وجود ندارد."
            }
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default ChangeUserPassword;