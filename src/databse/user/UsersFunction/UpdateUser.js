import { MongoClient, ServerApiVersion } from 'mongodb';
import { apiUrls } from 'src/configs/apiurls';
import { MONGO_URI } from 'src/lib/utils';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

function getTodayDate() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    let day = ("0" + currentDate.getDate()).slice(-2);
    let formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
}
export async function UpdateUser(id,type, currentservercode) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const collection = db.collection('Users');

        const filter = { _id: id };
        const updatedDoc = {
            $set: {
                type: type,
                currentservercode: currentservercode
            }
        };
        var resultUpdate =  await collection.updateOne(filter, updatedDoc);


        return resultUpdate;
    } catch (erros) {
        console.log(erros)
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}
