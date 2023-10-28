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

async function GetUsersServer(username) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');



        const usersCollection = db.collection('Users');
        const userDocs = await usersCollection.findOne({ username: username });

        const collection = db.collection('Servers');
        const documents = await collection.find({ type: userDocs.type }).toArray();
        var tmpResult = [];
        if (userDocs != null) {
            if (userDocs.type == apiUrls.types.SoftEther) {
                documents.map((item, index) => {
                    if (item.isremoved == false &&
                        item.servercode != userDocs.currentservercode) {
                        item.isCurrent = false;
                        tmpResult.push(item);
                    } else {
                        item.isCurrent = true;
                        tmpResult.push(item);
                    }
                })
            } else if (userDocs.type == apiUrls.types.Cisco) {
                var currentServerOfUser = documents.find(e => e.servercode == userDocs.currentservercode);
                documents.map((item, index) => {
                    if (item.isremoved == false
                        && item.servercode != userDocs.currentservercode) {
                        item.isCurrent = false;
                        tmpResult.push(item);
                    } else {
                        item.isCurrent = true;
                        tmpResult.push(item);
                    }
                })
            } else if (userDocs.type == apiUrls.types.OpenVpn) {
                var currentServerOfUser = documents.find(e => e.servercode == userDocs.currentservercode);
                documents.map((item, index) => {
                    if (item.isremoved == false
                        && item.servercode != userDocs.currentservercode) {
                        item.isCurrent = false;
                        tmpResult.push(item);
                    } else {
                        item.isCurrent = true;
                        tmpResult.push(item);
                    }
                })
            }


        }

        return tmpResult;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}

export default GetUsersServer;