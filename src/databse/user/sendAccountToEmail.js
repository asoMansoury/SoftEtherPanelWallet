import {MongoClient,ServerApiVersion} from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import {  MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function SendAccountToEmail(email){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');
        
        const data = (await collection.find({email:{ $regex: `^${email}$`, $options: "i" }}).toArray());
        
        var result = data.map((item)=>{
            
            return{
                email:item.email,
                username:item.type===apiUrls.types.SoftEther?item.userwithhub: item.username,
                expires:item.expires,
                password:item.password,
            }
        });

        return result;
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}

export default SendAccountToEmail;