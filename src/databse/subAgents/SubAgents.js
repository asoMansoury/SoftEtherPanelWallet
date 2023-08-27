import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI } from 'src/lib/utils';
import { GetWalletUser } from '../Wallet/getWalletUser';
import WalletDocToDTo from '../Wallet/Utils/WalletDocToDTo';
import { GetCustomerByEmail } from '../customers/getcustomer';
import { ValidationDto } from '../CommonDto/ValidationDto';
import { GetAgentByUserCode, GetAgentByUserEmail } from '../agent/getagentinformation';
import { SubAgentDto } from './DTOs/SubAgentDto';


const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GetSubAgentsByEmail(email) {
    try {
        const connectionState = await client.connect();
        const db = client.db('SoftEther');
        const agentCollection = db.collection("Agents");
        var customer = await GetCustomerByEmail(email);
        if (customer.isvalid == false)
            return new ValidationDto(false, "مشتری برای این ایمیل وجود ندارد.")

        var agentInformation = await GetAgentByUserEmail(email);
        if (agentInformation.isValid == false)
            return agentInformation;

        var tmp = [];

        var allSubAgents = await agentCollection.find({
            isSubAgent: true,
            introducerEmail: email
        }).sort({ _id: -1 }).toArray();
        if (allSubAgents != null) {
            allSubAgents.map((item, index) => {
                tmp.push(new SubAgentDto(item.name, item.agentcode,
                    item.agentprefix, item.introducerEmail,
                    item.introducerAgentCode,item.email,item.agentcode));
            })
        }


        return {
            isValid: true,
            subAgents: tmp,
            agentInformation: agentInformation
        }
    } catch (erros) {
        return Promise.reject(erros);
    } finally {
        client.close();
    }
}


