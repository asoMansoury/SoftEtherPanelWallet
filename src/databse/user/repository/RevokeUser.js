import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI, formatDate } from 'src/lib/utils';

const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



export async function UpdateRevokingUser(username,nextExpirationDate,uuid) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const UserCollection = db.collection('Users');
        var result = await UserCollection.updateOne(
            { "username": username }, // Filter condition to match the document
            { $set: { "expires": nextExpirationDate, "isRevoked": true, "uuid": uuid,removedFromServer:false } } // Update operation using $set to set the new value
        )
        return result;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}





export default UpdateRevokingUser;