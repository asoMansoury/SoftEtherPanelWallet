import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { GetWalletUser } from '../Wallet/getWalletUser';
import WalletDocToDTo from '../Wallet/Utils/WalletDocToDTo';
import { GetCustomerByEmail } from '../customers/getcustomer';
import { ValidationDto } from '../CommonDto/ValidationDto';
import { UserTestsDTO } from '../user/DTOs/UserTestsDTO';
import { GetAllServers } from '../server/getservers';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GetAgentUserTests(Token) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');

        const collection = db.collection('TestAccounts');
        const documents = await collection.find({ agentCode: Token.agentcode }).sort({_id:-1}).toArray();
        const servers = await GetAllServers();
        if(documents==null){
            return {
                users:[],
                isValid:true
            }
        }
        var tmp = [];
        documents.map((item,index)=>{
            var selectedServer = servers.filter((z) => z.servercode == item.servercode)[0];
            if(selectedServer!=undefined)
                tmp.push(new UserTestsDTO(item.email,item.username,item.password,item.type,item.removedFromServer,item.agentCode,selectedServer.title,item.expires));
        })
        const result = {
            users: tmp,
            isValid: true
        }

        return result;
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}

