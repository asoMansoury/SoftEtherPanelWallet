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

function getTodayDate(){
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    let day = ("0" + currentDate.getDate()).slice(-2);
    let formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
}
export async function UpdateTank(type,amount){
    if(type=='' || type == undefined)
        type = apiUrls.types.SoftEther;
    try{
        const connectionState =  await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('SalesTank');


        let todayDatePure = getTodayDate();
        var foundDoc = await collection.findOne({todayDate:todayDatePure,type:type});
        if(foundDoc==null){
            const documents = await collection.insertOne({
                type:type,
                tank:amount,
                todayDate: todayDatePure
            });
        }else{
            const filter = {_id:foundDoc._id};
            let todayTank  =foundDoc.tank + amount;
            const updatedDoc = {$set:{
                tank:todayTank
            }};
            await collection.updateOne(filter,updatedDoc);
        }
        
        return [];
    }catch(erros){
        return Promise.reject(erros);
    }finally{
        client.close();
    }
}
