import {MongoClient,ServerApiVersion} from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


export async function GetTelegramToken(body){
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const telegramCollection = db.collection('TelegramTokens');
        const telegramToken = await telegramCollection.findOne({});
        if (telegramToken==null){
            
            var obj = {
                isvalid:false,
            }

            return obj;
        }else{
            telegramToken.isvalid = true;
            
            return telegramToken;
        }
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}



export default GetTelegramToken;